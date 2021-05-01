---
layout: post
title: "Why You Shouldn't Run That Monolith On Kubernetes"
categories: [thoughts]
image: ibelonghere.jpg
---

## You might have to figure out your app's configuration

Do you know that big old Puppet script you use to finagle your applicaotion into something approachine a production-ready configuration? Well, that's not going to work anymore. You'll need to rework all that logic. Some of it needs to go into Dockerfiles, some into entrypoint script (if you're a bad person) and the rest into ConfigMAps, SEcrets and Pod definitions, And if you get this wrong, you can foget about "Build Once, Run Anywhere".

## You still need to run databases outside of Kubernetes

Doing non-container stuff??! THat's *such* a drag. But yes, you do still have to. Most databases don;t allow you to add and remove instances arbitrarily, mostly because they need to communicate to reach some consistency of state. And, because Kubernetes loves destroying applications [cf rolling-update, liveness/readiness] , this doesn't make for a good match. If you speak to your hipster DevOps friends who only ever wear customized t-shirts from Redbubble (chcek out my page!), then they'll tell you that this is the problem PetSEts were designed to address. But what they might not lead with is that they're still in Beta and only support very particular scaling modes (which??). Of course, you could give people time for them to help the community push things forward, but wouldn't that mean less time spent on real business projects? [[who is acctually using petsets]]

## You need to stop making breaking changes to your schemas

Yeah, you can't do rolling-updates between applications with incompatible schemata. Which is a shame, because its so handy to just drop a column when you're done using it. Instead, you have to go through a laborious release process just to get pairwise version compatibility. THen you need to figure out how to get Kubernetes to enforce this... [[ research this ]]

## Your app is stateful and you know it

![LMFAO]({{site.url}}/img/lamfao.gif)

Personally, I think this bould down to the second law of thermodynamics. Entropy always increases. And over time, apps acquire more state. Everything requires its own session, and sessions hold more and more information.   

Or maybe that's just how we made software, back in the day.  

In any case, all this stuff won't fly in Kubernetes. You need to refactor so you state lives in external databases or caches. Surely you can get this done by lunchtime so I shouldn't even have made this a reason. But its here now and I'm not removing it.

## The service needs to be PCI/HIPAA/ABDC compliant

Whats ABDC I hear you say?

![What's ABDC?]({{site.url}}/img/jabbawockees.gif)

This. This is. And personally I like to make sure all my services can reach at least week 5 before promoting them to prod. 

Anyway... let's continue.  

Kubernetes is primarily for startups and tech companies and everyone knows they don't care about security. (actually, many of our clients are not tech companies but everyone knows consultancy clients aren't representative of the market as a whole). 

Being compliant is possible with Kubernetes but the framework itself won't give you everything you know at this point. 

[[need more here]]

## It's Written in COBOL and only runs on a punch-card machine

Wait, is that even possible?

Well, Kuberenetes only runs linux containers so I guess if tou can run linux on a punch card machine then it might work? To be completely honest, I don't know much about how punch cards work so I'll need your help on this, dear reader.

So, yeah...

## In Conclusion

All software is rubbish (just to a greater or lesser extent) adn eventually entropy will kill us all. If your software is working today, be grateful and don't take it for granted. Prize it like tour firstborn.

![Entropy]({{site.url}}/img/entropy.jpg)
