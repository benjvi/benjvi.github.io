---
layout: post
title: "Securing communications within Kubernetes clusters"
categories: [Technology]
image: ibelonghere.jpg
---

In previous blog posts we have seen the components of Kubernetes and how easy it is to set up a basic Kubernetes cluster. For the puposes of testing this is great, but as more and more companies are bringing Kubernetes clusters to production, we areo seeing a lot more concerns about availability and security surfacing. For today's post we will look at one of the areas where a best practice is fairly well established. That is, how TLS is used to provide privacy and authenticationfor communications between cluster components. 

<!--more-->

### Eavesdropping

The first thing we want to do is to make sure that an attacker who has gained access to the cluster network cannot intercept confidential information such as that passed from the kubelet to the apiserver.

There is also a converse communcation, where the apiserver connects to the kubelet, such as when running `kubectl exec`.

In the general case, the apiserver will also need to connect to remote etcd nodes as well so this communication needs to be encrypted. etcd is intended to be encapsulated by the api server so direct access shouldn't  be enabled. etcd stores information about the state of the cluster, including secrets files which at the moment are not encrypted in etcd. etcd nodes, being clustered, also need to talk directly to each other.

There is some other communication between components, but it is local communication, which we don't need to worry about. (unprivileged user on machine??)

### Privilege Escalation

There is the possibility that one of the worker nodes could be compromised which would mean that an attacker could do anything thatthe kubelet can do. This drives the need to give the minimum possible privileges for the kubelet, and for that we need client side authentication. This is notmally implemented using client side cerificates. 

This requirement also drives the need to add privileges for the kube-shecules and kube-controller-manager to use certificates when talking to the apiserver.            
