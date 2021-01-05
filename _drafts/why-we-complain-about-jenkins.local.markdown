---
layout: post
title: "Is Jenkins Still A Good Choice for Delivery Pipelines?" 
categories: [technology]
image: ibelonghere.webp
---

Over the years I have worked on projects utilising all sorts of different technologies, but there is one tool that has been almost omnipresent: Jenkins. Yet in most projects the administration of Jenkins has been problematic and ended up consuming a lot more time than we expected. As a platform engineer, Jenkins may be the tool that I heard coworkers complaining about the most. It's best to ignore a lot of this negativity, but there are real issues behind the complaints here, and we should talk about them. 

I'm not saying Jenkins is bad. Things that are bad don't get to be omnipresent. It has been very useful tool, helping to  make CI a ubiquitous practice. However, as CI has become more important, patterns and anti-patterns have become clearer. Ideas have evolved and new competitors have brought new things to the table. Applying these new practices with Jenkins is difficult, which leads to people getting frustrated. Which in turn begs the question: is it worth changing the tool? 

## Problem I: Security Model

Ultimately I believe the root of most problems in Jenkins is its security model. Jenkins has its notions of Jobs and Executors. So when you run a Job, that 'Job Execution' will be allocated to either the Jenkins machine itself, or to a 'Jenkins slave'. In general, each machine would be configured to run many Jobs concurrently. So the machines tend to have much more capacity than individual Jobs require - they are not dynamic and associated with Jobs, but they form a static pool of execution capacity to be consumed by whatever Jobs are running at the moment. 

In conjunction with this, when Jobs run, they don't have any sort of isolation, at least at the OS layer. That is to say, Jenkins doesn't (natively) understand containers. This means that jobs running shell commands can run whatever commands they like and they will have the permissions of the Jenkins user.

In general, this is problematic, as the actions needed to run a pipeline are inseparable from the ability to administrate Jenkins. In the pipeline (Groovy) world this becomes much easier to exploit as Groovy scripts could invoke the same internal APIs used in Jenkins plugins. Since plugins are used to provide essential functions of the system, e.g. creating workers, this is bad, and it is for this reason that the security sandbox for Groovy was introduced. 

Unfortunately this has many bad effects on the programming model. Specific function calls get blocked by the sandbox and you must explicitly authorize each of them to get scripts to function. Furthermore, Jenkins functions cannot be imported as a normal library into Groovy, but instead seem to be understood by Jenkins' groovy interpreter directly. Which means that it is very difficult to understand how code that is written and tested locally is going to run in Jenkins. This is a massive problem. There are similar issues with different behaviour between modules and classes which can make it more difficult to modularize code. 

So all of this adds up to making it unnecessarily difficult to write code for pipelines. 

## Problem II: Installation and Configuration Is Hard to Script

Another choice that no longer looks so good is how Jenkins accepts its configuration. When driving things through the GUI, it is really easy to do things like creating new Jobs, installing plugins, setting worker and security configuration, even setting secrets. However, when you attempt to script these things you find there is a multitude of different ways to attempt it, and it has a lot of complexity.

I worked on one project that had an Ansible playbook to stand up Jenkins from scratch with all of its configuration and that thing fundamentally worked, as far as I could tell. However, the problem was that people would constantly make changes to Jenkins directly, for two reasons. The first was that that playbook was a behemoth - a mix of groovy scripts, dropping down to the raw xml configuration files that ultimately drive the Jenkins runtime when required. Writing an Ansible playbook to be understandable is difficult at the best of times - when working with Jenkins, the question of "where do I change this piece of config" becomes almost impossible to answer. 

The most successful Jenkins installation I worked with was where we had a Jenkins dedicated to our small team. We actually didn't script Jenkins at all ( this was a while ago, before Jenkins pipelines were *de rigour*, we might use them today ). Instead, we changed everything through the GUI and installed a plugin which exports the configuration to git. Then we created a Docker file to run Jenkins and we ran the whole thing in Jenkins, recreating the whole running thing relatively frequently. In this scenario the fact that we were a small team both ensured that everyone knew how this worked and we didn't have to worry about isolation of jobs.

## Problem III: Too much Heritage and too many Choices 

Jenkins' declarative pipelines are a good example of the problem here. There are a lot of use cases which don't have sophisticated requirements for their pipelines. In theory, these jobs could run on any CI server. If we compare declarative pipelines to Travis or Circle (etc), they are actually quite similar. They avoid quite a few of the problems we have been talking about. Unfortunately, they don't seem to be the default choice when people are setting up Jenkins pipelines. I had been working with Jenkins pipelines for years before I encountered the use of declarative pipelines, and saw how they were meant to be used. Even after the choice to use declarative pipelines has been made, it is still possible to use scripted pipelines and its not clear how or why you should do that.

This weakness is one that is common to technologies that have stuck around a long time. It is clearer to start again with a separate tool, but then you have to do more work to take the users and the tooling integrations with you. It's a difficult issue to address.  

## The Flipside: Power and Customizability


## The Future


