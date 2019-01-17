 To Mob or Not To Mob? Experiences of Mob Programming

At its core, mob programming ("mobbing") is a simple idea. Instead of one programmer per task, you have three or more programmers sharing a single computer, working on the same thing. It is a collaborative and communicative way of working, similar to pair programming. 

I had [heard](https://news.ycombinator.com/item?id=11854541) [*this*](https://blog.newrelic.com/engineering/mob-programming-campfire/) [much](https://www.infoq.com/news/2015/11/unruly-mob-programming) some time ago, but I did not get the opportunity to practice mobbing until I joined the [PCFS team](https://pivotal.io/services/pcf-solutions) in Pivotal last year. Mobbing is an important tool in the toolbox here, brought out fairly regularly but judiciously. So, why would you choose to mob program? 

<!--more-->

Well, mobbing takes the idea of pair programming and takes it to the extreme. By putting more minds to a single problem at the same time, it doubles down (or quadruples down?) on building shared understanding as an engineering team. It makes [collaboration and consensus-building](http://sedano.org/toddsedano/2017/10/23/considerate-pair-programming.html)  even more important to your development process.

The main objection to mobbing is that it seems expensive. It's the same objection we hear sometimes about pair programming. People are uncomfortable with the faster consumption of effort when multiple developers work on a single task. For pair programming, there are [many benefits](https://www.slideshare.net/motochan/agile-the-pivotal-way-compressed/89) to the practice which make the approach a productive one. However, mobbing will consume programmer time much quicker even than pairing. So if it to be worthwhile, we should see additional productivity gains.

Given that mobbing is still not a widespread way of working, I want to share some of the experiences I've had with mobbing, the benefits we realized, and some of the pitfalls we've fallen into along the way.

## Unstructured Mobbing

A while ago, as a junior developer, I was employed on a project where a lot of collective work happened. But we didn't call it mobbing at the time, in fact we didn't call it anything at all. If a particularly troublesome or critical problem came up then often my colleagues would call other people over. After that, a couple more people would drift over to see what was going on. Then we would continue working together until various people lost interest, one by one, and the person that encountered the problem was back to soloing again. 


This wasn't a methodology, nor even a concious choice about the way of working. So, you couldn't call it mobbing per se. But aspects of these behaviours are useful. We see some of the same things in the [*Incident Command System*](https://www.usenix.org/conference/srecon18americas/presentation/chapman) for [incident response](https://www.heavybit.com/library/video/every-minute-counts-coordinating-herokus-incident-response/): the person who discovers the incident remains the leader, he is able to pull in additional expertise, and see things through to the end. Although unstructured, this was a skillful way to respond to incidents that occurred. However, there are some problems.

The first is that it should be up to the responder to pull in expertise as needed. The initiator needs to be particularly aware of what help is available to them and ready to call on it. People joining of their own accord doesn't make a productive mob. Everyone should be contributing. 

Secondly, when we were working on things other than incident response, we had some troubles keeping people focussed. Part of this was that we didn't have the right people in the mob. Another reason was that we didn't rotate as you do in mob programming proper. So, naturally, attention levels would drop as people didn't feel involved enough. Attention levels drop, and productivity goes down. 

I don't think that anyone ever held up that team as an example of a highly-performing team. But, even without a system, or a clear intention to practice any methodology, we saw some of the benefits that normally come with mob programming. As a junior programmer I found that way of working particularly helpful in coming to an understanding of how the broader system worked. After some time I had learned enough to take charge of designing some new features of the system, which I credit largely to these experiences.

## The Jump-Start

My first proper experience of mobbing was at the start of one of our [Pivotal-led] [Dojos](https://medium.com/@dormaindrewitz/secrets-of-successful-cloud-foundry-adopters-232193111b18). The nature of [what we are doing in the PCFS team](https://www.youtube.com/watch?v=ccKy6Np7Jxo), building platforms [with our clients](https://blog.usejournal.com/why-is-pivotals-dojo-so-good-c96cdb497ddf), often implies a critical section at the start of a dojo which is the foundation for all further work. After this, parallel tracks of work are more meaningful. Often careful planning can avoid such bottlenecks but not always. In this case, we had the choice to go through similar tasks in parallel or all together as a mob. 

The concious decision of doing mob programming means that there are some ground rules to follow. There is always only one 'driver' on the keyboard, while the rest of the mob are 'navigators'. The driver shouldn't ever act unilaterally, only with the consensus of the navigators. The navigators should all be focused on the driver's screen, and devices are generally forbidden. The role of driver will rotate frequently so everyone gets to drive.

In our case, our mob was about half a dozen people. we rotated our driver every 15 minutes. With 6 people this was definitely necessary as our drivers found it hard to synthesize the different opinions and directions of so many engineers. Some engineers not having English as a first language made driving particularly tiring. 

In these circumstances, this approach engendered a few positive outcomes. Although doing things on a screen in a big room of people could be intimidating, with the mobbing rules it was relatively stress-free. Having the whole team's expertise actively helping meant there was always a lot of guidance available. At the same time, this quickly raised the overall level of understanding of the platform we were building. It allowed people to gain confidence, and gel as a team, without too much pressure.

After the mobbing sessions, the engineers were more confident that (i) the activities we would be doing in building this platform would be not so different to things they had done before (ii) there were resources available that they could draw on, and people in the team with different experiences that they could direct questions to.

There were also some downsides to the mobbing. Half a dozen people seemed more than the optimum number - at times the number of opinions in the mix was too much. Although we were aware of the potential for overload, and trying to manage this, it was still a difficulty. 

Another difficulty of mobbing is knowing when to stop. After two or three days, the engineers had more confidence in what they were doing and had started to disengage a bit from the mobbing. I think that at some point the brain realizes when its not absorbing or emitting as much important information and accordingly, switches off. The trick lies in stopping the mobbing before this happens. Our intention had been to split out tasks earlier but blocking issues (the reality of engineering) meant that it took a couple of days longer to prepare things. 

Overall, I counted it as a successful experiment. Working on foundational tasks, this shared understanding we gained was important.  Getting the familiarity with the environment and foundations of what you will be working with, all together, is a great way to gain confidence and kick off a new initiative. 

## Pair Programming ++

There is another reason you might find yourself doing mob programming. On a later dojo, we had already familiarised ourselves with the environment in pairs and were working on parallel tracks. An additional engineer then joined us for the subsequent weeks.

Introducing a single extra person meant either allocating a track for solo activities or expanding one of the pairs into a trio. Sometimes engineers need time to research things to solidify their own understanding or to deal with administrative tasks, or to do other solo work. However, as our engagements are short, normally we see more benefits from investing in more communication and more collaboration to build more shared understanding. So, naturally, we chose to create a small mob.

Our objectives were different in this case.  We expected an additional person in the pair to contribute additional ideas, stimulate additional discourse and to speed up the track of work a little. A secondary goal was to use the time each person spent driving as a time box to better balance the need for intense concentration while pairing with the need for the brain to rest every so often. Ensuring shared understanding for the whole team was not a goal as there was still a pair working separately. 

We tended to be three people, or sometimes four, which meant that the problems of having too many cooks spoiling the broth did not recur. In our retro, there was a consensus that focus had improved during the week of the mobbing and there was a desire to continue.  

Still, over time, the extra value of mobbing became less. The additional input became a little less needed as each engineer learned more. And after some time spent mobbing, the act of pairing throughout the day was much less challenging and more rewarding. Since we were still getting some extra value, and still had an additional engineer present, we did not formally stop the mobbing, but we were able to loosen up the rules a little to (eg) allow each person to stay on the keyboard longer.


## To Mob or Not to Mob?

In my experience, the process of mobbing has been intensely useful. In both cases, the mobbing achieved what we set out to do and promptly made itself redundant. As mobbing is an expensive activity this is a happy outcome.  

Although it has not been the case for me yet, I can imagine situations where logistics, complexity or risk mean that mobbing will continue to be efficient and effective over the long term. People within Pivotal talk a lot about the specific practices we use but my biggest learning so far has been in how experimenting and consciously choosing ways of working based on your own specific situation give the best results. 

With that in mind, this decision diagram tries to summarize my learnings for when you might think about trying mobbing:

<img src="{{site.url}}/img/whentotrymobbing.png"/>
