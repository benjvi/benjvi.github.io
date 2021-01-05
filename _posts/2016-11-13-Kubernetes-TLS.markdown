---
layout: post
title: "Securing communications in Kubernetes"
categories: [technology]
image: ibelonghere.webp
---

As more and more organisations are bringing Kubernetes clusters to production, we are seeing a lot more concerns about availability and security surfacing. And while there are quite a number of tutorials and scripts for bringing up out there for getting up and running (see Lorenzo's very thorough and understandable guide), it remains relatively difficult to bring up a maintainable setup that also follows best practices. In this post we will look at an  areas where best practices are quite well understood but documentation is unfortunately still a bit lacking. That is, how privacy and authentication can be provided for communication between cluster components. 

<!--more-->

## Eavesdropping

 ![Black Hat Cat]({{site.url}}/img/blackhatcat.jpg)

The first thing we want to do is to make sure that an attacker who has gained access to the cluster network cannot intercept confidential information. 

One of the most important communication channels is the connection of the kubelet to the apiserver. This is how the kubelet can get the information it needs to run the [pods](https://kubernetes.io/docs/user-guide/pods/) according to the desired state specified by the scheduler. Similarly the kube-proxy needs to look up information about [services](https://kubernetes.io/docs/user-guide/services/) and [endpoints](https://kubernetes.io/docs/api-reference/v1/definitions/#_v1_endpoints) to set routing correctly. There is also a connection in the opposite direction, whereby the apiserver connects to the kubelet. This is used when running `kubectl exec`.

### etcd

etcd is used to store information about the state of the cluster, including secrets files which at the moment are not encrypted in etcd. This means that access to etcd must be tightly restricted. etcd nodes, being clustered, also need to talk directly to each other, so accessibility from and communication over the network is unavoidable. 

Normally, the apiserver will need to connect to remote etcd nodes so this also needs to be secured. etcd is intended to be encapsulated by the API server so access from elsewhere shouldn't be enabled. Some other technologies also make use of etcd to store information and so may tempt you to reuse the same etcd cluster. One example is flannel which needs a distributed store for maintaining its overlay network configuration. However, this is bad for security as this means the worker nodes now all require access to read and write into (parts of) etcd. 

![Kubernetes Architecture]({{site.url}}/img/Kubernetesarchitecture.png)

## Locking down unprivileged users

There are other communication channels between components, but it should all be through localhost, which means we also need to protect these channels against already logged-on users.

### Master nodes

Conveniently, there are very few reasons a non-admin user should be logged into a master node. This lessens the likelihood of information disclosure or privilege escalation occurring here. Nevertheless, for defense in depth reasons, it is good to secure the communication between master node components too. Completely locking this down hasn't been too well supported until recently, but now it is possible to entirely disable insecure communications on the API server (see [issue #13598](https://github.com/Kubernetes/Kubernetes/issues/13598)). 

### Worker nodes

On the worker nodes, the docker daemon is the main point to be protected, as it is able to start privileged containers as root. By extension, the kubelet also requires the same protections against local unprivileged users. This is especially important as processes in containers should run as unprivileged users in the host namespace. Therefore, despite the various limitations that are placed on containers, there is always the possibility of container break out that needs to be considered. 

## TLS 

![We Love TLS]({{site.url}}/img/welovetls.jpg)

TLS is the answer for most of these problems. In fact, did you know it is specifically engineered for providing privacy between communicating applications? Although it has not always been the case, happily, all the components of a Kubernetes cluster now support TLS. Listing out all the requirements we specified so far, the actual capabilities look like this: 

### Master

*apiserver* 

-  Supports server certs for serving the API, and clients can authenticate with client certs
-  Supports client certs for connecting to etcd
-  Supports client certs for connecting to kubelet

*scheduler* 

-  Supports client certs for connecting to API server

*controller-manager* 

-  Supports client certs for connecting to API server 

### Worker

*kubelet* 

-  Supports server certs enabling connections for `kubectl exec`, and clients can authenticate with client certs
-  Supports client certs for connecting to API server

*kube-proxy* 

-  Supports client certs for connecting to API server

/* changes required here! */
The documentation on some of these capabilities is pretty poor, but at least for the components that connect to the API server, the authorization information can always be loaded through [kubeconfig](http://Kubernetes.io/docs/user-guide/kubeconfig-file/). 

### etcd

-  Supports server certs for presenting to clients, and clients can authenticate with client certs
-  Supports server/client certs for peer communication
-  Can set permissions for authenticated users [based on key prefixes](https://coreos.com/etcd/docs/latest/auth_api.html#key-value-resources) 

## Securing the Docker endpoint

Docker [operates as a client-server application](https://docs.docker.com/engine/understanding-docker/). Clients interact with a daemon that controls all the containers on the host - normally through an IPC (Unix domain) socket. By default, access to the docker socket is [secured by the permissions of the containing folder](http://man7.org/linux/man-pages/man7/unix.7.html) (by default it is only accessible by docker group users).

As Docker only needs to be accessed by the local kubelet, usually communication through a socket [is the most appropriate mechanism](http://bhavin.directi.com/unix-domain-sockets-vs-tcp-sockets/). However, if remote access is required to the docker daemon, it [can be accessed over HTTPS] using a server cert. Additionally, clients may authenticate with a client cert, although [no permissioning is applied](https://docs.docker.com/engine/extend/plugins_authorization) to authenticated users. In fact, all authenticated users become [root-equivalent](https://docs.docker.com/engine/security/security/#docker-daemon-attack-surface) on the host. 

## Least privilege in Kubernetes APIs

A compromise of one of the worker nodes (e.g. via a new container breakout attack) would mean that an attacker could do anything that the kubelet and kube-proxy can do. It would be simple to start signing requests to the apiserver using their certificates. As the orchestrator of containers on the host kubelet and kube-proxy normally need to retrieve state information about pods, services and endpoints from the apiserver. In addition, the kubelet needs to be able to publish events relating to current pod and container state.  

Since the required privileges are relatively narrow, it would be difficult for an attacker to use just these privileges to disrupt the rest of the cluster. This drives the need to give the minimum possible privileges to the kubelet. There are [a number of authorization mechanisms](https://kubernetes.io/docs/admin/authorization/) available in the apiserver to do this, the most common being Authorization-Based-Access-Control (ABAC) and Role-Based-Access-Control (RBAC). As a prerequisite to client-specific permissioning we need client side authentication to identify the kubelet with the apiserver. This is implemented using client side certificates. 

This requirement also drives the need to add privileges for the scheduler to use certificates when talking to the apiserver.

Service accounts generally seem to be added using the ABAC authorization function on the API service, and an example of how components are to be permissioned can be found in an [example ABAC policy file](https://github.com/Kubernetes/Kubernetes/blob/master/pkg/auth/authorizer/abac/example_policy_file.jsonl) in the Kubernetes repo (note this doesn't include the controller-manager!).


## Hungry for more?

The threat model and mitigation for the core components is hopefully now a little clearer. However, there's still some work for the interested reader to do.  There are lots of other services that may need to be securely connected to a Kubernetes cluster which are currently less standardized. If using RBAC in the cluster, there needs to be a connection to a identity provider using OIDC, or the API server can simply delegate authentication to a different server. Similarly, we have not spoken about monitoring or log aggregation. Or, if using a cloud provider, there needs to be an authorized cluster user to perform actions like mounting volumes. 

### Useful Links

[Don't run as root inside of Docker containers](http://blog.dscpl.com.au/2015/12/don-run-as-root-inside-of-docker.html)  
[SSL and TLS: A Beginners Guide](https://uk.sans.org/reading-room/whitepapers/protocols/ssl-tls-beginners-guide-1029)  
[OWASP TLS Guidelines](https://www.owasp.org/index.php/Transport_Layer_Protection_Cheat_Sheet)   
[etcd security model](https://coreos.com/etcd/docs/latest/security.html)  
[GDS Docker Secure Deployment Guidelines](https://github.com/GDSSecurity/Docker-Secure-Deployment-Guidelines)
[IAM User permissions for Kubernetes in AWS](https://github.com/kubernetes/kops/blob/master/docs/iam_roles.md)

