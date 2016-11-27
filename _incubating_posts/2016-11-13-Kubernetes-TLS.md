---
layout: post
title: "Securing communications within Kubernetes clusters"
categories: [Technology]
image: ibelonghere.jpg
---

More and more companies are bringing Kubernetes clusters to production, we areo seeing a lot more concerns about availability and security surfacing. And while there are quite a number of tutorials and scripts for bringing up out there for getting up and running (see my colleague Lorenzo's very thorough and understandable guide), it remains relatively difficult to bring up a maintainable setup that also follows best practices. For today's post we will look at one of the areas where best practices are quite well understood. That is, how privacy and authentication is provided for communications between cluster components. 

<!--more-->

### Eavesdropping

The first thing we want to do is to make sure that an attacker who has gained access to the cluster network cannot intercept confidential information. 
 ![Black Hat Cat]({{site.url}}/img/blackhatcat.jpg)

One of the most important communication channels is the connection of the kubelet to the apiserver. This is how the kubelet can get the information it needs to run the pods according to the desired state specified by the scheduler. There is also a reverse connection, where the apiserver connects to the kubelet, such as when running `kubectl exec`.

In the general case, the apiserver will also need to connect to remote etcd nodes as well so this communication needs to be encrypted. etcd is intended to be encapsulated by the api server so direct access shouldn't be enabled. In particular, if using flannel for networking it may be tempting to reuse the same etcd cluster for the flannel backing store, however, this is bad for security as this means the worker nodes now all require access to read and write into (parts of) etcd. 

etcd stores information about the state of the cluster, including secrets files which at the moment are not encrypted in etcd. etcd nodes, being clustered, also need to talk directly to each other.  

### Locking down unprivileged users

There is some other communication between components, but it should be just local communication on the master node, which is less worrying. In general there are few reasons a non-admin user should be logged into a master node. 

Nevertheless, for defense in depth reasons it is good to secure the communication between master node components too. This is an area which hasn't been too well supported until recently (see [issue #13598](https://github.com/kubernetes/kubernetes/issues/13598)). 

On the worker node, the docker daemon is the main point to be protected, as it is able to start privileged containers as root. By extention, the kubelet also requires the same protections against local unprivileged users. This is especially important as processes in containers should run as unprivileged users in the host namespace. Therefore, despite the various limitations that are placed on containers, there is always the possibility of container break out that needs to be considered. 

### TLS 

TLS is the answer for most of these problems. In fact, it is specifically engineered for providing privacy between communicating applications. Although it has not always been the case, happily, all the components of a kubernetes cluster now support TLS. 

#### Master

api server
 - Supports server certs for serving the API, and clients can authenticate with client certs
 - Supports client certs for connecting to etcd
 - Supports client certs for connecting to kubelet
scheduler
 - supports client certs for connecting to api server
controller-manager
 - supports client certs for connecting to api server 

#### Worker

kubelet
 - Supports server certs enabling connections for `kubectl exec`, and clients can authenticate with client certs
 - Supports client certs for connecting to api server
kube-proxy
- supports client certs for connecting to api server (why does this connect to api server??)

The documentation on some of these capabilities is pretty poor, but at least for the components that connect to the API server, the authorization information can usually be loaded through [kubeconfig](http://kubernetes.io/docs/user-guide/kubeconfig-file/). 

#### etcd

- Supports server certs for presenting to clients, and clients can authenticate with client certs
- Support server/client certs for peer communication
- Can set permissions for authenticated users [based on key prefixes](https://coreos.com/etcd/docs/latest/auth_api.html#key-value-resources) 

#### Docker

- By default, access to the docker socket is [secured by the permissions of the containing folder](http://man7.org/linux/man-pages/man7/unix.7.html) (by default it is only accessible by docker group users (??))
- If remote access is required, it can be accessed over https using a server side cert. Clients may authenticate with a client cert
- All authenticated users can do anything; they become root-equivalent on the host 

### Minimum privilege on the cluster API

There is the possibility that one of the worker nodes could be compromised which would mean that an attacker could do anything that the kubelet can do. This drives the need to give the minimum possible privileges for the kubelet, and for that we need client side authentication. This is normally implemented using client side cerificates. 

This requirement also drives the need to add privileges for the scheduler to use certificates when talking to the apiserver.

[What privileges does the controller-manager need in the api server??]

### Still want more??

The threat model and mitigation for the core components is hopefully now a little clearer. However, there's still some work to do!  There are lots of other services that may need to be securely connected to a kubernetes cluster which are currently less standardized. If using RBAC in the cluster, there needs to be a connection to a identity provider using oidc, or the api server can simply delegate authentication to a different server. Similarly, we have not spoken about monitoring or log aggregation. Or, if using a cloud provider, there needs to be an authorized cluster user to perform actions like mounting volumes. 

### Useful Links

[Don't run as root inside of Docker containers](http://blog.dscpl.com.au/2015/12/don-run-as-root-inside-of-docker.html)
[SSL and TLS: A Beginners Guide](https://uk.sans.org/reading-room/whitepapers/protocols/ssl-tls-beginners-guide-1029)
[OWASP TLS Guidelines](https://www.owasp.org/index.php/Transport_Layer_Protection_Cheat_Sheet)
[Example ABAC policy file for Kubernetes API](https://github.com/kubernetes/kubernetes/blob/master/pkg/auth/authorizer/abac/example_policy_file.jsonl)
[etcd security model](https://coreos.com/etcd/docs/latest/security.html)
[Protect the Docker socket](https://docs.docker.com/engine/security/https/)
