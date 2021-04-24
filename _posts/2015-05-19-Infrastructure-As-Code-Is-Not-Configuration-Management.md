---
layout: post
title: "Terraform: Go Beyond Configuration Management"
categories: [technology]
---

For the past few months, I have been concerned with deploying complex applications from the ground up on top of my company's IaaS platform, Interoute VDC. Wanting not to re-invent the wheel , we have spent quite some time looking at tools that could do the job. In this search I somewhere came across the sentiment that forms the title of this piece, and for some time, I was quite confused about this [1]. And it seems like lots of others are confused too. There are a plethora of plugins adding cloud provisioning capabilities to traditional Configuration Management tools such as Puppet, Chef, or Ansible. But, we eventually settled on a different solution for our provisioning: a new framework called Terraform. This is designed with IaaS specific problems in mind, which leads to some big wins, as we will see. There are three main points of differentiation:
 
<!--more--> 

### 1. Advanced Graph Abstraction

The infrastructure provisioning process is quite a complex one: many different kinds of resources need to be created, and very often one resource must be instantiated before another can start to be built. It is desirable that the resource provisionings that don't depend on each other are performed in parallel, as some provisioning actions can take quite a long time. This sequence of dependency relations can be naturally described as a directed acyclic graph. Let's see the graphs for a couple of example infrastructure configurations:

<img src="{{site.url}}/img/lync-graph.png" style="min-height:230px"/>
<img src="{{site.url}}/img/cluster-coreos.png" style="max-height:230px"/>

These correspond to a Lync installation and a CoreOS cluster, respectively. For the Lync installation (for example), this diagram tells us that the Lync Windows template must be present before the VMs (instances) can be created, as must the networks be present before the VMs are added to them. One VM has an additional volume, so the VM must be ready before that volume can be attached.

Having had the experience of developing one of these with custom code (and no framework), I must say that ensuring that the order of component deployment was not trivial and took up a significant amount of thinking time and development time. Therefore, this is a great place to apply Inversion of Control to replace these ideosyncratic problems with a general solution. to that end, Terraform includes a graph-building algorithm that will build resource provisioning order for you at run-time, given only a description of the resources you want to create. The graph abstraction is not unique to Terraform, but it has the most advanced system I have seen. E.g. to create a template, network and VM from our lync environment, we would need the following <em>configuration</em>: 
<pre><code>
resource "cloudstack_template" "z1-lync-win-tmpl" {
    name = "ubuntu image"
    url = "https://mywebsite.com/myimage.ova"
    os_type = "Windows"
    hypervisor = "VMware"
    format = "OVA"://
    zone = "Slough (ESX)"
}

resource "cloudstack_network" "z1-lync-ipvpn-DUMMY" {
    name = "SL-ipvpn-lync-DUMMY"
    cidr = "192.168.49.0/26"
    network_offering = "PrivateWithGatewayServices"
    zone = "Slough (ESX)"
}

resource "cloudstack_instance" "z1-lync-fe" {
    name = "SL-LFE101-MSLYNC-HFE-ua"
    service_offering = "32768-8"
    network = ["${cloudstack_network.z1-lync-ipvpn-DUMMY.name}"]
    template = "${cloudstack_template.z1-lync-win-tmpl.name}"
    zone = "Slough (ESX)"
}
</code></pre>
As we see here, to indicate dependencies between two resources, we can simply reference one property of resource no. 1 that will be used to construct resource no. 2. For example, our desired VM configuration in this configuration refers to both the network and the template. It doesn't actually matter whether the property value was something we knew ahead of time (as above) or whether the property is calculated while provisioning the resource. This is a great feature and I'm not aware of any other configuration management tool that can do anything like this so easily. In Ansible, it seems fairly easy to reference variables we've defined - as tasks run in a shared context, but we get no help in ordering resources as there is no graph abstraction. In Puppet, there is a graph abstraction so we can specify ordering declaratively, but its not so easy to refer to variables. I have not used Chef or Salt, but I believe these fall somewhere between the approach of Ansible and Puppet. 

Configuration management tools like Puppet and Ansible are aimed at a different problem domain in which the graph abstraction is less important. People seem to think about software installing and configuration as a purely sequential process, and therefore Puppet's graph-based ordering is often described in negative terms - as confusing and over-complicated. The time taken for operations is to be completed is usually quite short, so it is more acceptable to trade away performance in the provisioning strategy for a simpler model. 

By contrast, infrastructure provisioning can be a lengthy process, and so Terraform must apply all the actions it can in parallel (given the constraints of the graph). Given the graph can be generated from a set of resource configuration, we must still make sure to use this graph at runtime to determine the ordering of actions. This is where the <em>Communicating Sequential Processes</em> of Go come in. This approach to concurrency is powerful enough to capture the graph abstraction, and therefore when a graph of resources is provisioned by Terraform, it acts as though it is stepping through the leaves of the graph in parallel. The result is a powerful and efficient approach to concurrently provisioning resources. 

### 2. Being Node-less

Configuration management tools are designed to ensure the correct configuration exists on a set of pre-existing computers that are under your management. Each computer is treated as a node, which has a particular target configuration. The CM tool performs actions on each node to ensure that its state converges to the desired configuration.

For infrastructure provisioning this seems like nonsense, because it is completely foreign to our use-case. Our resource graph might well contain 'nodes' (VMs) but equally it might not. Nodes don't have a first-class status - indeed our configuration usually only needs to be applied once [2]. While we can work around this with the agent-less Ansible and even with Puppet or Chef, we don't actually need this construct at all. Nevermind all the extra concepts that these systems have for managing and classifying those nodes(classes, roles, etc.). Indeed Terraform, as a specialised and focussed tool, doesn't have any of this and so we won't get distracted by this baggage. [3]

### 3. Safe Convergence

A CM system (rightly) assumes that it can do anything it likes on nodes that it owns. Once a node is added into a configuration manager, it 'manages' the system without regard to the initial state. It simply performs some checks and performs the according actions to converge the state. 

In the infrastructure domain, we do not have the same freedom. In this world, we cannot say that everything in my Cloudstack account is 'managed' by Terraform. Instead it is only particular resources within the account that are managed. Therefore, if I create a new Terraform configuration that conflicts with the existing state - for example, I might create a VM that is identically named and in the same network - Terraform will refuse to update the existing VM. According to the convergence model of the Configuration Managers, we expect the VM to be updated to match the new configuration applied. But, as this updating could be destructive, this approach would not be ideal. Instead, we need a more nuanced approach - non-existant resources can be updated, managed resources can be updated or destroyed, but non-managed resources should not be updated or destroyed. Returning to our prexisting VM - we do not know why that VM was already there, and we must ensure that it does not contain any valuable assets before we can manage it with our new Terraform configuration [4].

The other much-touted feature of Terraform is its plan system. Based on the current state of the provisioned infrastructure, it can calculate the actions it will need to perform in order to reach the desired configuration. This is much like the no-op modes of Puppet and Salt. The innovation is that these plans can be used to restrict the provisioning - i.e. only the actions specified by the plan can be performed when it comes time to really apply the configuration. I have not used this too much, so I won't comment on its effectiveness, but this seems like a very useful feature to have in a more mature and/or mission-critical system.

### Conclusion

We have seen how Terraform, in choosing to focus on the provisioning aspect of Infrastructure as Code, has been able to make some new abstractions and different design choices compared to configuration management tools. These make the system faster, more understandable, and safer. In doing so, it expands a new niche, performing the management functions needed to co-ordinate IaaS for 'a modern datacenter' - expanding the remit of what we are able to do with Infrastructure as Code and acting as a complement to the other tools that are available.

### Notes

[1] What's more, by most common definitions, Configuration Management <em>is</em> Infrastructure as Code. (i.e. it is a contained-by relation)

[2] This doesn't mean there is no room for mechanisms to allow configuration re-use. Although it still needs some more refinement, Terraform brings modules which provide composability of re-usable porttions of a resource graph.

[3] It is important to note that this idea of a 'node' under management doesn't map well to any concepts in Terraform either. I have spend a lot of time thinking that a particular provider should work like a node. This is not correct - there can be multiple difference infrastructure providers in the same configuration. It is really the entry point into the graph - the base dependency that each resource must have.

[4] Unfortunately, import of resources into Terraform is not currently available. There is a rather inelegant workaround of going to get resource ids and writing them manually into your state file. But the core developers say that an import feature is on the roadmap so hopefully it is coming soon!

### More Info

<a href='https://www.terraform.io/'>Terraform</a>

<a href='http://www.aosabook.org/en/puppet.html'>Puppet architecture</a>

<a href='https://news.ycombinator.com/item?id=8098496'>Terraform discussion on HN</a>

<a href='https://groups.google.com/forum/#!msg/terraform-tool/6Fxnl_bejX4/0O-d17UwhHcJ'>Terraform vs Ansible</a>

<a href='http://www.infoq.com/news/2015/05/hashimoto-modern-datacenter'>'Automating the Modern Datacenter'</a>

<a href='http://people.scs.carleton.ca/~soma/biosec/readings/burgess-immunology.pdf'>Theoretical basis of CFEngine - Computer Immunology</a>
