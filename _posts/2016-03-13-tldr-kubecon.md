---
layout: post
title: "TL/DR: Kubecon"
categories: [technology]
image: ibelonghere.png
---

It was a great couple of days at Kubecon - so much going on, so many great speakers and so much to process! Surely I missed quite a lot, given that there was four tracks, but this is my summary and synthesis of some of the major (and minor) points that I learned. 
<!--more-->
1. The short description of Kubernetes: "an opinionated framework for building distributed systems". Also the new Kubernetes overview [here](http://kubernetes.io/docs/whatisk8s/) is very good
2. How Kubernetes differs from Docker swarm + compose: more opinionated and more feature-rich. Part of this comes from their provenance - Kubernetes defines its own APIs specifically for distributed systems whereas docker overloads/extends the existing APIs.
3. There is a new way to get configuration into a pod with the new ConfigMap object in Kubernetes 1.2. Its nice that there's now a single canonical way to do this, as there is with secrets. Hopefully, this will also make it easier to maintain single replicasets which can be used across environments. 
4. There are other ways we can influence the pod lifecycle other than through the livenessProbe. We can also specify a readinessProbe which will determine when a pod is added to a load balancer, and we can specify a preStop command to ensure a pod's graceful shutdown.
5. If everything goes as promised, 1.3 will be a massive release:
	- Ubernetes will provide a real (if preliminary) solution to cross-zone clusters 
	- IAM will be added in the form of an [OIDC](http://openid.net/connect/) integration. This is much needed to distinguish between different types of users accessing a cluster
	- [PetSet](https://github.com/kubernetes/kubernetes/pull/18016) (nee NominalServices) should solve the problems currently encountered with systems where the identities of the nodes is important (primarily for different types of database). This will be important for me to run my MongoDB replica set in a Kubernetes-friendly way
6. PersistentVolumes are currently seen as being provisioned manually by an administrator and so are not linked to the pod lifecycle. This manual provisioning makes them quite pet-like, the answer to this is Dynamic Volumes which are already available for AWS/GCP
7. Volumes are abstracted from the pods by PersistentVolumeClaims - the idea is that pods don't need to know which precise volume will be attached, they just need to be given a certain amount of space on a volume with the required characteristics.
	- This is done by matching labels => not automatically enforced that the pod only uses the space it asked for!
 	- Storage Service Classes extend this - abstract specific labels into something like service tiers
8. rkt sounds pretty nice and useful: 
	- runs without a daemon, so starting containers works like starting processes with systemd. Interesting to note that this makes upgrades much easier, at the moment updating docker requires first stopping all running containers.
	- Can build and run docker images with rkt
	- rkt unit of execution (pods) closely match pods of Kubernetes - in this case, composed of multiple [App Container Images](https://github.com/appc/spec/blob/master/spec/aci.md#app-container-image)
	- Integrates nicely with CoreOs's trusted computing model by adding a hash of the container image and config when a rkt pod is started; creates a tamper-proof audit log
9. There are some interesting things being done to hybridize containers + virtualization: rkt works with Intel's clear containers, also [Hyper](https://hyper.sh) containers seem to be doing something very similar
10. Introduction of network policy objects in Kubernetes sounds really interesting (think this was another thing for 1.3). This will allow the developer to express which apps are allowed to communicate with each other, and block all other traffic
11. Details of project calico networking model sounded interesting: just aiming to provide a router on each machine so that routing works as it does on the internet, and can consequently be debugged with ping and traceroute. Claim is that this gives better performance and scales better - this is something I need to investigate, still need to better understand how the networking models work!
12. [Deployments](https://github.com/kubernetes/kubernetes/blob/master/docs/proposals/deployment.md) (new in 1.2) give more control over updates. Allowing the choice of DeploymentStrategy means we can do things like rollbacks, parameterized rolling updates etc 
13. There is a new UI which will be included in 1.2 by default, integrating both with Heapster and the API server. Not sure how this will compare to other products which visualize application topologies like WeaveScope and SysDig, but it looks good for a simple dashboard
14. Running applications in containers gives us lots of opportunities to simulate various network failure types through a netem interface - as [tcd](https://github.com/kinvolk/tcd) does. Especially when we start to think about running Ubernetes, it might be interesting to see how network failures could change application behaviour. Also good to be able to test how different used experience the application under various adverse conditions.
15. The rate of change and innovation going on in the community is mind-boggling. There is a lot of investment going into this too - even excepting Google, just Red Hat has ~20 engineers working on Kubernetes.

## Things to Investigate

- Kubernetes 1.2 is coming out very soon so its time to set up a cluster for testing!
- How to make it so we don't have repeated replica sets for test/prod? Will configMaps be enough, how can I parameterize the different labels and different image versions?
- How will Ubernetes work and how complex will it be? Will it meet all my use cases (primarily around HA for different types of applications)?
- How do Network Policies work? Do we need to use Project Calico as a backend to enforce the policies or are there other options?
- How can we get a list of deployments for use as an audit log?
- How to manage workloads with different priorities in Kubernetes?
- Interesting that Ian from Google had chosen to create four different apps to extract data from his MIDI controller and send it to the other controller (via the Kubernetes API!). I would have assumed that this decomposition was inducing too much overhead, but perhaps, when the container orchestration is already there and mature, the cost of creating multiple services is much much lower?