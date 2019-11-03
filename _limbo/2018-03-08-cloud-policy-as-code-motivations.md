---
layout: post
title: "Cloud Policy As Code Pt 1: Why You Should be Using It"
categories: [technology]
image: ibelonghere.png
---

As the more and more people migrate their infrastructure onto cloud platforms, and usage patterns mature, we have seen that Policy-As-Code is an area that is becoming more and more important. Estates are getting larger and in need of more management, and we are seeing Cloud use increase in more highly regulated environments which have more stringent requirements for governance and security. As we will see, applying policy on the cloud platform level can solve some of these problems that come when scaling cloud usage. 

## So why are we all using cloud in the first place? 

Well, there are some advantages around elasticity of infrastructure and/or transmuting big capital expenditure into smaller but ongoing operational expenses. These can be real and important advantages, depending on the risk of those investments, but by far the most important advantage of the cloud is that it enables self-service for development teams. Long lead times in procurement are antithetical to agile working practices, and so adopting cloud with this self-service model can produce qualitative changes in the way organizations are able to develop software. 

## What are the downsides to this? 

We can see mysterious instances, volumes and weird subnets appear over time. This is inevitable when you commit to the self-service model, as when you give people the freedom to create things, you are also giving them the freedom to make a mess. One of the aims of devops is to go through quick feedback loops, which is great, but ultimately the more work you are doing, the more entropy you are creating. So we need to manage the resulting disorder. 

There are two reactions to this. One unfortunately very common reaction is to introduce a central service to vet all resource creation requests before they are created. In its most simple form, this may be to mandate that all resource creation gets done as a job in Jenkins, but this can also result in developing much more complicated facade services. Whatever their implementation, the motivator for these services is to prove that provisioning requests are OK before they are actioned. Given the complexity of cloud platforms, this is typically not possible to achieve in practice, and what is possible to apply is a set of very restrictive heuristics. The freedom that is given in one hand (cloud) is taken away by the other (facade).  

The second way is more light-handed. Typically, some foundational policies must be applied to make sure that the nature (and also provenance) of the resources that are deployed is specified, at least to some level. These typically look like naming or tagging conventions. Then we have the information we need to make decisions on what to do with provisioned resource. There may still be some policies that block specific resource configurations from getting deployed but these can be somewhat looser. Now we can also apply policies to clean up any dubious policies after they get created.  

## Isn't that like auditing?

This kind of approach looks very similar to auditing (benchmarking) but it is slightly different. There are a whole load of tools out there to help you implement best practices based on a fixed set of security rules. Because the rules are fixed, the architecture of these tools can be simpler. A query language can still be helpful but its not too hard to implement in a general purpose programming language. Another simplification of auditing tools relative to general policies is that there is always a human in the loop to look at the results and decide how to action them. A policy may have an automated response. 

In any case, there are already a bunch of useful tools for this. In AWS you can use [Prowler](https://github.com/Alfresco/prowler), or [Scout2](https://github.com/nccgroup/Scout2), or [scans](https://github.com/cloudsploit/scans). And in Kubernetes you can use [kube-bench](TODO).

## So what actually is a policy?

Well we were just talking about a few things that are important. In the abstract sense, a policy is just something that specifies allowed or forbidden states for resources. Or maybe something in between. If resources are pre-existing, then it must also specify either how to remove it, or what else should be done with it. 

Although they are closely related, there is a difference in nature between preventative and remediative policies. You could look at the preventative policies as being a missing feature in a cloud platform (amongst others), similar to the IAM policies you apply to users, but applied globally. AWS in particular does not support this. (TODO: Kubernetes, Azure) Interestingly only GCP seems to have these kinds of policies [baked into the platform](https://cloud.google.com/resource-manager/docs/organization-policy/understanding-policies). However there is another feature of this policy landscape. There is always some grey area of resources that can be created but should not stick around, or resource configurations that become forbidden after they are created due to either changes in design or discovery of vulnerabilities. In practice, its also not a good thing to stifle experimentation by forbidding everything, but it is important to be able to clean up unsuccessful or more risky experiments.

When we want to restrict things without making them totally *verboten*, external tools for applying remediative policies look more interesting. In this case, we don't prevent resources from being created but at some time after they are created we analyse them and work out if any remediation actions need taking. Its not so clear that these are functions that should belong to the platform itself, or whether they should be provided by additional tooling. In any case, we will see that there are many things we can do we the tools that we simply cannot do with the cloud APIs exposed. 

## What kind of tools are there and what do they do?

There are a whole load of tools out there at this point! Perhaps if we limit the question to tools looking at policy on AWS we can give a reasonable services. There are relatively well-known services based on simple rules, foremost amongst them is amazon's AWS Config service. If you are looking to create a fairly common rule, this might have you covered, and if that is the case this is the best tool to use. Netflix's Security Monkey is also worth a mention as the grandfather in this space, also enforcing a set of specific rules, but I didn't see a compelling reason to use it at the current time.

Next up is the set of DSL-based policy tools. These have their own custom DSLs that can be used to define a policy. There seems to be quite a few security focussed tools like this: Dome9/ (TODO). I have only looked at the policy DSL for Dome9 which does look relatively attractive, but, that is part of their commercial offering (TODO). Although there is a free tier, this only includes auditing for specific rulesets.

My favorite tool AWS-wise, and therefore the one I have spent the most time with, is [Cloud Custodian](). This is an open-source project primarily supported by Capital One. It has a pretty broad coverage of AWS resources in its YAML-based policy DSL, with support for a few different types of actions on many resources. A nice thing operationally is that you can set policies to be triggered on resource creation, or indeed on any event, or you can run the policy periodically. Either way typically you would run the policy execution in a lambda and receive a report of the results either by email or by reading from a message queue. I found that use of serverless looks quite elegant in this use-case.

Broadening things from AWS, there are two tools that are worth a mention. [Sentinel](TODO) from Hashicorp is a Policy-As-Code tool that is integrated into Terraform Enterprise. It analyses the plan output against the policy, and only allows the apply to go ahead if the plan is compliant. So this is a preventative form of policy. What is particularly interesting is that, since this is terraform, rules could be applied across cloud providers. So cross cutting policies - naming conventions springs to mind - could be defined in a single place. Of course this does mean that *all* provisioning must now go through terraform if these policies are to have teeth.

Also worth a quick mention is (TODO: openpolicy??) for kubernetes. It plugs into the Admission Controller interface in Kubernetes and is called during the authentication flow when a user calls the API server to create a resource. For preventative policies, this model looks very nice, and the policy DSL also seems intuitive. 

## To Be Continued

Here we started with some contemplation of the self-service nature of the Cloud. In that context we looked at how we can use Policy-As-Code to put some guardrails on self-service without stifling experimentation and innovation. We have surveyed some different approaches to policies and identified some tools that extend the capabilities of Cloud APIs - on AWS in particular - to enable us to make more customizable policy rules. Next time - we will begin to put this into practice, showing how policiesi, implemented with Cloud Custodian, can be helpful when deploying complex systems onto AWS. We will also look at the limitations of a policy DSL, both in the specific case of Cloud Custodian, and more generally. 
