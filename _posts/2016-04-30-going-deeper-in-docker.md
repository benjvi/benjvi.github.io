---
layout: post
title: "Going Deeper in Docker"
categories: [technology]
image: ibelonghere.png
---

There's been a couple of awesome resources come out in Docker over the last few weeks. First was the ["Hitler uses Docker" video](https://www.youtube.com/watch?v=PivpCKEiQOQ), which gives a sample of the common complaints that people have about Docker distilled down into a couple of minutes. And some of the complaints are totally valid! Watching this video really made me want to understand better the status of the many claims being made. How often do problems come from abuse of the technology, how often from missing features, and how often from fundamental limitations? To do this we need to look underneath the orchestration tools and the packaging format and look at the technologies that are being built upon.

<!--more-->

When starting off with Docker, the most important thing is that it improves the developer's workflow. There is this simple file you define to build your app which is basically just a build script where each statement defines one layer of a copy-on-write filesystem. After building, you can just push an immutable image[1]. Pull from anywhere you like and all the application's configuration will be the same - voila! Your process is now "build once, run anywhere". So you get this handy language agnostic packaging format and it becomes easy to define a common CD pipeline across any heterogeneous technology stacks you might be running (hurray, microservices!).

The problem is, at some point we will want our containers to do more than that. We will want them to actually *contain*. That is, after all, their *raison d'être*, right? We want, for example, to be able to pack our containers onto nodes to improve our utilization. But then, we need to put limits on the resources each container can use so one container can't deny service to the other containers on the node. And we want to make sure that each container can only access its configuration and files (etc) and not those of other containers. Next, if we run containers with different security profiles we have to worry about the attack vectors that exist from an individual container to others or to the host - we have to worry about privilege escalation, restricting communication between containers, etc.

This brings us to the second interesting piece: its a comprehensive security whitepaper, ["Understanding and Hardening Linux Containers"](https://www.nccgroup.trust/globalassets/our-research/us/whitepapers/2016/april/ncc_group_understanding_hardening_linux_containers-10pdf/) describing the state of security in Docker, describing all the way up from the kernel features (primarily namespaces and cgroups but also capabilities and more...) to how they are implemented in container runtimes and also how they should be tweaked to harden your containers. This is a pretty detailed (and long!) report but it really brings attention to the fact that there's a lot going on under the hood to provide isolation (and there are a lot of places where things can go wrong).

This paper is way too long to be summarized in a single blog post, but there are a few points in there that are especially interesting:

- The interface with the kernel is much larger than the interface exposed by a hardware VM to the hypervisor - so (all other things being equal) for maximal security, OS-virtualization is not the best design.

- Not only is the implementation of isolation through namespaces (in particular) not complete in Docker, but the implementation of namespaces in the Linux kernel is not complete - examples of which are the proc fs / sys fs, neither of which are namespaced and allows access and modification of kernel variables. Also, access to devices is not namespaced.

- The user namespace is fairly new and fairly complex which means that quite a number of vulnerabilities in it have been discovered. So, while this means root in container is not root on host, its still better not to be root at all (of course!). But, in Docker, user namespace is still not enabled by default, it uses a shared namespace for all containers, and only remaps the root user (although this is likely to change soon)!

- Capabilities are a method for granting individual processes just the privileges they need to execute correctly. In this way, the risk of privilege escalation should be minimised. However, many of these capabilities (especially CAP_SYS_ADMIN) are known to be fairly weak and could allow the user to gain additional capabilities or full root. Fortunately, if operating within a user namespace, this still only means root within the namespace.

- PIDs cgroup was only added to the linux kernel in 2015 to limit processes in a namespace. I also found out support was added to Docker in version 1.11. So from now on, Hitler doesn't have to worry about fork bombs in his containers!

- Mandatory Access Controls are important as another layer of defence, given that namespaces are incomplete and capabilities must be dropped. These apply to root as well as other users. Most important are SELinux and AppArmor - although these (especially SELinux) can be complex and difficult to set up.

- Seccomp filters the syscalls an application may make to interface with the kernel. Again, it may be difficult to set up the appropriate white list (or black list) of calls allowed (but fortunately Docker applies a generic list by default)

- No cgroups support for /dev/random which allows DoS attacks for containers that need PRNG

- Bridged networking, allowing container-to-container traffic by default, is convenient, but is a security weakness. A good point is that Docker ports are not exposed by default. Also, we can choose to disable inter-container traffic.

- It's possible to enforce the immutable container model in Docker with the --read-only flag (this may require also making mounts for temporary app data in /tmp and /run)

- Linked to an [interesting piece from Jessie Frazelle](https://blog.jessfraz.com/post/docker-containers-on-the-desktop/) about running desktop programs with Docker, which is a pretty unorthodox way of running Docker but (kind-of) makes sense.

Overall, its an interesting read and the single takeaway, if there is one, is that containers contribute significantly to the security of running processes. They are not necessarily an approach for hardware virtualization (in multi-tenant situations that would probably still be preferred) but they do provide meaningful isolation and flexibility for running applications. In many use-cases, that is just what is required.

[1] Tags are not immutable which is a bit of a fly in the ointment   
