---
layout: post
title: "What I've Been Reading: Accelerate"
categories: [technology]
---

<a href="https://en.wikipedia.org/wiki/Hyperspace#/media/File:Hyperspace-star-streaks-effect.jpg">
  <img src="{{site.url}}/img/hyperspace.jpg" alt="accelerating to hyperspace" title="accelerating to hyperspace" style="max-height: 400px;width: 75%; overflow: hidden;">
</a>

_Accelerate: The Science of Lean Software and DevOps: Building and Scaling High Performing Technology Organizations, Nicole Forsgren PhD, Jez Humble, Gene Kim_

I read this as part of a book club at work. It's a book that gives an overview of many practices and gives some well-proven conclusions for each. As such, it made a good jumping-off point for a general discussion of 'DevOps', which is reflected in the expansive and questioning nature of these notes. 

It is particularly good for those that work on software projects with a 'Transformation' aspect. It could help guide you when bringing practices from the modern 'DevOps' movement, in particular for large organizations that have gotten stuck in a local optimum in their approach to technology. With that said, in 2021, it reads as being a little conservative, and I would suggest casting a more critical eye on ideas that may go unquestioned in the DevOps movement. Overall though, there's a lot of good stuff here.

In particular, I liked:
- Decomposition of "DevOps" / "Continuous Delivery" into separate capabilities that could be adopted (to some degree!) incrementally e.g. automated delivery vs continuous delivery
- Discussion of security, has often been neglected in DevOps discussions
- Discussion of architecture, which also has been neglected previously and has been problematic in practices ( e.g. "distributed monolith")
- Explicitly called out practices that don't contribute to delivery ( although sometimes it seemed a bit contradictory / unclear e.g. with Change Approval Boards (CABs) )
- Focus on measurement, and [DORA (DevOps Research and Assessment) metrics](https://www.blueoptima.com/blog/how-to-measure-devops-success-why-dora-metrics-are-important) seem like things that actually can be measured too
- I don't read the "State of DevOps" reports, so a lot of this stuff is new to me, particularly on the side of measurements / proving the impact of practices
- Emphasis on the principle of [small batches](https://queue.acm.org/detail.cfm?id=2945077). For me this is core to the whole Continuous Delivery thing

<img src="{{site.url}}/img/small-batch-of-ducklings.webp" alt="ducklings are happiest in small batches too" title="ducklings are happiest in small batches too" style="max-height: 360px;">

Didn't like: 
- In concluding, they would say things like: "quality doesn't need to be traded off against speed" - which is true, eventually. However, along the journey, and with a limited level of investment, you might need to make those tradeoffs. In general, the book is about the endpoint and not the journey (it's a small book!)
- Didn't talk about when shouldn't you do Continuous Delivery? Again, tradeoffs
- View of the world is still quite dev-centric, less about operations / Site Reliability Engineering. SRE book is complementary but also contradictory in some things
- Nothing massively new here, very aligned to the "lean principles, bringing dev practices / automation to delivery & ops" school of DevOps, which has been around for some time (almost 15 years?) now
- Discussion of practices could have tied things back more to how this specifically improves the metrics we're interested in. In general, they just say there's a correlation
- Too many buzzwords and too much self-promotion (ideas-wise), this is written in a way that's a bit too business-y for my tastes

Questions:
- What did you feel were the overall drivers that would make people follow this path? - for me, it still seems the promise of speed is driving things above all else
- If we imagine ourselves as app operators or (embedded) SREs, what's our contribution to the practices here? What about as platform engineers?
- Why haven't people succeeded with this path? Have we improved things overall? Lack of interest? Lack of willingness to invest? Roadblocks or bad experiences?
- Have you seen people measuring the DORA metrics? With success?
- What here do you really disagree with? What is common knowledge / received wisdom? And what do you think is really valuable?

## Ch 1: Accelerate

- Didn't find much to note specifically here as its more of an intro and summary of the findings

## Ch 2: Measurement

- Calls out the problematic nature of using velocity for comparing teams or as a measurement of productivity, which is nice. This happens a lot
- Talks about the relationship between utilization (efficiency) vs lead time (for unplanned work/events), which is a really interesting topic. A very high utilization causes lead time to diverge (to infinity)
- The idea is to focus (these practices) on strategic software. Use Wardley maps to determine this
  - Wardley maps - does anyone actually know how to use them? Its a thing I've heard people talk about a lot but never used
- Metrics to be used for learning, not evaluation/comparison/control! Books like "weapons of math destruction" are interesting on the problems of management by metrics

## Ch 3: Culture

Two ideas I found valuable here:
- Westrum model of culture identifies three types: Pathological, Bureaucratic and Generative. [This GCP page](https://cloud.google.com/architecture/devops/devops-culture-westrum-organizational-culture) has a nice summary of this aspect of things
- The book also spoke about 3 levels of culture: invisible assumptions, values (explicit, observable through actions and communication), and artefacts (mission statements, procedure, rituals, etc)

In general, I'm wary of this aspect of things, as culture is always nebulous. In the context of an organization, I'm even more wary of "organizational culture" as, in my experience, the team culture has always been more important. At least for the behaviour being talked about. Even after re-reading sections, I'm not completely sure where teams are being discussed and where the organisation is the subject. This distinction simply isn't made clear. 

Yuval Noah Harari's [ideas about collective myths](https://fs.blog/2016/01/why-humans-dominate-earth/) seem much more relevant/useful when talking about organizational culture.

## Ch 4: Technical Practices

- "computers perform repetitive tasks; people solve problems". A very simple phrase for what we're trying to do with continuous delivery as a whole, really persuasive phrase
- "everyone is responsible" [ for holistic system-level outcomes ] - it's super important that teams work together towards a shared goal, although I ask, what are the limits of this?
- Nice that [trunk-based development](https://trunkbaseddevelopment.com/) is one of the practices, it's a modern practice, and solves a number of problems I've seen teams struggle with 
- Emphasis placed on version control of system configuration as well as application code, which is important. 
- Interesting that the ability for teams to choose their own tools is also in here, and measured to be associated with high performance for continuous delivery
- Section on quality is unconvincing, surely this is just availability / RED metrics? They measure by time spent on unplanned work, which is important but I don't see it as being a good measure of the product itself
- They say devs should create acceptance tests/ TDD should be used -> so that designs are inherently testable. This doesn't mean no QA or QA shouldn't also write acceptance tests. This is surprisingly opinionated to me, but would be difficult to implement in a place with lots of dedicated QAs
- Architecture is called out as a crucial barrier. It is!
- XP popularity is waning! :( why?
- I haven't been (deeply) involved on a team in production, doing multiple deploys a day. What proportion of others have?

## Ch 5: Architecture

- Loose coupling is important! Its the big potential win from a 'microservices transformation'
- Should talk about backwards compatibility, people never understand it
- Interestingly says that release software doesn't make any difference to who was high performing / low performing. For all teams and projects that I've been involved with, this has always been a source of difficulties or confusion (e.g. Spring release train, spinnaker)

## Ch 6: Security

- Chapter is a bit short but had a couple of good prompts for further thought
- Talks about scarcity of security professions / limited capacity which is a big problem
- Main idea is to make security practices easy to consume, in various ways - mostly by setting standards, libraries and automated checking
- Doesn't negate the need for security reviews on substantial new features. But this can be at the design level at not necessarily at the code level 

Questions
- How to get developers to have a better level of security knowledge? Is this mostly about incentives? Can blue-red team exercises help?

## Ch 7: Management Practices for Software

- Talks about lean and limiting WIP. It seems like most PMs I've worked with now want to limit WIP, but with varying degrees of success. I wonder what makes the difference? The ability to make thin slices? Or the number of dependencies in the tasks (which in turn may rely on appropriate team boundaries)?
  - They do explicitly call out the need to make obstacles visible. This is always a struggle with planning software
- Visual display of work is generally a good practice, one that I haven't focused on for a while. Its a problem in a remote world
- CAB doesn't work - not sure if what's written here is enough to convince people that CAB doesn't work though. I think you have to prove that changes are low risk first and that equivalent controls are in place. Since CAB is by definition an external group, you probably have to make this processes auditable too

## Ch 8: Product Development

- Very short chapter
- Not much new in this chapter that is not very familiar to me personally from Pivotal's ways of working / User-Centric Design / "The Lean Startup" book
- They talk specifically about making the flow of work from the customer to the team visible so that the team understands the work / the meaning of the work better

## Ch 9: Making Work Sustainable

- The topic of deployment pain is interesting. I have worked on a traditional, low-performing team and the need to do releases and the dangerous nature of them was not something I saw engineers struggle with. But then we didn't do releases very often
- This is the only place I see platform mentioned, in the context of reducing deployment pain. Platform does more than this, I think its under-emphasised in this book, but its an interesting framing - of lightening the load for developers. It seems that self-service is not mentioned anywhere, which is strange

## Ch 10: Employee Satisfaction, Identity, and Engagement

- Mostly skim-read this section, Net Promoter Score is (more-or-less) fine but not that interesting a topic for me
- DevOps can provide better conditions for autonomy, mastery and purpose - so it makes sense that there's a correlation with satisfaction

## Ch 11: Leaders and Managers

- Leaders are crucial in motivating people around a program of change (transformation)
- Support is needed from leadership to give support and promote the technical practices of DevOps
- There a lot of good information about how to create a productive/generative working environment

## Ch 12-15

These chapters are about the methodology used to gather the data that informs the conclusions of the book. Most reviews say this part is pretty dull, so I skipped it.

## Ch 16: High-Performance Leadership and Management

This chapter seems most relevant to upper management - as such, I didn't find much that held my attention here either.

## Other thoughts

- When "digitally transforming" _analogue_ services, how much do people care about higher availability?
- With these topics, especially in regard to architecture and organizational structure, I always wonder if there's some connection to chaos theory - if at some point there's a critical transition where the nature of how things get done fundamentally changes (see [NOTE: Chaos In Organizations and IT Engineering](Chaos%20In%20Organizations%20and%20IT%20Engineering))
- Where's the discussion of how MTTR is improved by various practices?

## Reference

[This page](https://www.softwaremeadows.com/devops/accelerate_notes_and_quotes/#chapter-6-integrating-infosec-into-the-delivery-lifecyle) has a great summary of the book, hewing a bit closer to just the content of the book
