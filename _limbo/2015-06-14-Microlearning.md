---
layout: post
title: "Microlearning"
categories: [technology]
image: blank.jpg
---
I've read for some time on the subject of effective learning techniques - one important part of which is the consolidation of knowledge. Two stand out in particular as seeming reasonably well-proven: *spaced repetition* [see Gwern's summary and refs] and *interleaving*[citation needed]. But, for some reason the actual application of these theories in a structured way seems to be a fairly niche occupation. I propose that what is needed is an integration of these techniques with the way we actually encounter and initially learn new information. 
<!--more--> 

Learning is an iterative and concurrent process. Each thing we learn builds upon what we already knew, and the things we want to learn are therefore dependent on our current state of knowledge as well as our inherent temperament (insofar as such a thing exists). Simultaneously, the concepts we are currently learning also relates to other concepts and experiences that we encounter. In general[do some research], the learning process seems to follow the following process: 

1. Discovery of a resource that matches our interests and/or furthers our instrumental/instrinsic goals
2. Comprehension of that resource (reading or watching and being able to understand how the theory presented can be used to solve the problem that is presented)
3. Deliberate practice - application of the apparatus to new problems 
4. Consolidation - integration of the new knowledge into long term memory and 'making it second nature' 

I would also note that this process seems to be divided into concepts - i.e. we learn one concept at a time (while we can sometimes manage to absorb one concept and another one that builds upon it, this becomes difficult very quickly). Concepts seem to have a relatively long lead time for persistence into longer term memory which seems to be required for true mastery of them [unless I am conflating two parallel processes - research this]. And although there have been shown some benefits to doing deliberate practice in an interleaved manner, it is really in the consolidation process where the parallel learning capabilities of the human brain come to the fore.

My proposal is this: when you access a resource containing information you want to learn, which I will assume to be a web page, there should also be a set of simple questions associated. These will be aimed at the consolidation stage of practice - and so will cover simple definitions relating to the concepts desribed - perhaps covering their nuances or edge cases. After reading the resource, you may then subscribe to these questions. Then, following the spaced repetition algorithm, questions will be sent to your smartwatch at random (convenient?) times  thoughout the day. The user will amswer a sequence of interleaved multiple choice questions pertaining to the different resources he has subscribed to.

There is a good reason to focus on consolidation rather than comprehension or deliberate practice. To make the initial advance in comprehension and capability you must plan and set aside some time to study and/or practice your resource with some deliberation and concentration. However, the consolidation stage is qualitatively different; prolonged focus is not required, quick tests of recall should suffice for learning to occur. Therefore, this is an activity well-suited to filling in "dead-time" throughout the day. 

It is important how the questions are surfaced to you - I suspect we should bow to the spaced repetition algorithm on that. If the user opens up the app to do some questions, and keeps up with the spacing specified, then no notifications should be sent. However, we should normally expect the user to follow behind what is "optimal" in this narrow domain, and in this state we should then start to send them random questions one by one. We would send these prompts at specified intervals and allow them to choose how many questions to answer in response. I feel that this second model should somehow be the dominant mode of operation. 

The questions will follow a subscriber model, so in case you lose interest in the subject, you may choose to unsubscribe from some particular set of questions and they would be removed from your collection. Of course, once you know a subject, the spaced repetition algorithm ensures these questions will be asked very infrequently anyway, so this only should be used when you lost interest in the subject.

In addition, we should somehow score the user on the promptness of their answers - if they answer the question on time we should score 100 points (say) but if they are two days late it might be 60 pts, or after 5 days the score might decrease again down to 20 points. Obviously this scoring system should ideally depend on the extent to which learning outcomes are sensitive to these small timing changes [resesarch this]. In fact, it is more important that the questions are attempted on time than that they are answered correctly so we will score accordingly. 

The model I've described here would seem to be a reasonable one, and seeks to make use of (relatively) new technologies to provide a learning process which should improve outcomes compared to the most common model of block learning, whilst reducing friction and provifing a clearer focus compared to existing spaced repetition models. However, up until this point, this is all theoretical. From here, the next practical step is to validate my idea. Since I am the user, I must check that the purported benefits I have desribed here actually exist.

For first steps, there are three points to validate: 

1. There are resources (URLs) for which I want to create question/answer pairs for the purpose of consolidating knowledge. I will use Anki to record these.
2. The process of creating the flashcards is not crucial to the learning experience. I want to provide a crowdsourced set of questions for a particular resource, so if it is best for each user to create their own questions then this part of the service must be changed. This will be rather difficult to validate, but I may be able to do so if I can find some sets of Anki cards already existing that *closely* match my own interests.
3. Purported deadtime is not serving a useful function (eg reflection) and therefore I would be positively inclined to respond to the random prompts to answer questions that ome in. I may test this by creating randomised reminders to review  my anki cards.

<!-- IRRELEVANT ASIDE: on the subject on problems/learning, actually one of the major problems for people seems to be plain old tiredness. This seems rather silly, and the most simple solution is just to make sure you have enough sleep. .This would come in 3 forms:
- Scheduling - specifically avoidance of over-scheduling wherever possible. This also would include trying to do work in the hour before bedtime (for me) because this hour is needed to wind down the day
- Avoiding insomnia - Things like, avoiding the use of laptops/screens and other forms of bright (/UV) light before bedtime, drinking caffeinated drinks late in the day and choosing appropriate energy activities for the evening
- Amelioration of the effects of tiredness in the instances where it is unavoidable - this most often requires ingesting something - normally caffeine which is moderately effective (although I wonder if it is more effective in suppressing the appearance of tiredness than the actual mental slowness), but modafinil would be more effective depending on the activity. Also, my anecdotal experience suggests that a cold shower in the morning is helpful in reducing sleep inertia - which is probably to do the shock triggering a shot of adrenaline. I have not yet discovered the effects under a condition of sleep deprivation. -->
