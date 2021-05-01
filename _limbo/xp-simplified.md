
# XP Experienced

A lot of people are familiar with XP as a concept but dont realize how much depth there is to it. In fact, XP is a complete philosophy and guide of how to do development. If you want to learn the complete system, then the book "XP Explained" is a good read and will give you a good idea of how everything fits together. However, theory is one thing and practice is another. At Pivotal, XP has always been part of the DNA and it has clearly influenced almost everything we do. However, people don't make reference to the theory of XP on an everyday basis, but even without enquiring deeply into it, we still get a sense of the philosophy. Its that that I want to focus on here - what I see working, used to reconstruct XP from an experiential POV. Given that I am working as a Platform Engineer, I want also to share some points where I see specific practices change.

## The Organising Principle

"Extreme" - take what works and turn it up to 11. Ignore the rest. When the initial book was being written by kent beck, there were a certain set of practices that seemed sensible and were accepted by thoughtful professionals as being best practices. The defining difference of XP was the idea that additional benefits could be realized by taking some of those things to extremes. The insight is that we are too conservative with our practices, and too attached to what we do right now (see: status quo bias). 

What practices are seen as sensible may have changed over the intervening twenty years, but the principle of probing our 'sensible' practices and radicalising some of them remains revitalizing.

## Values

### Communication

PRs seem sensible, so that not only one person knows how things work. They are insufficient to achieve this though which is why pairing should help. 

### Feedback (Iterations)

Its common practice to do scrum with 'sprints', referred to more neutrally in XP as iterations. It seems to be common to have sprints of 2 weeks, sometimes up to 4 weeks. We believe that the process of feedback through validating completed features is valuable. One week seems to be the shortest feasible iteration time to give sufficient time for planning, demos and retros, so we don't accept iteration times longer than one week.

### Simplicity

The conservative thing to do is to keep things simple and write clean code. Additional code or additional abstractions beyond what is required by the story is generally seen as wasteful, but would generally be accepted as a sunk cost. XP is clear that code that introduces superfluous elements should not be accepted. This does not entirely resolve the debate of what is quality code vs over-abstraction, nor the debate over what exactly quality code is. However, it does help everyone to strive towards the same goal.

One metaphor folks in Pivotal have found useful is that of a car vs a skateboard. This effectively helps to convey that you don't get everything you want at first, just enough to give you feedback that you're going in the right direction (or not!).

TODO: identify common themes that are commonly outside of a skateboard. This is for a different piece

## Practices

## Testing (in Platform Engineering)

The practice of TDD is still uncommon in platform engineering. There are good reasons for this and bad reasons. The good reasons perhaps need a dedicated post to do them justice, but in short, a sufficient set of continuous delivery pipelines is often likely to validate the acceptance criteria called for by the pipeline. Added to this, the units we deal with in platform engineering are often much larger than those in development, so there is less space where traditional unit testing adds value.

The bad reason is that platform engineers are often unfamiliar with testing practices. There are still places where orthodox testing approaches add value in platform engineering.

## Stories

Stories are de rigour in software development these days. However, people are still attached to the notion that stories carry some fixed scope of work. Stories should produce some technical assets as a side-effect, but these should not be measured explicitly in the story. We prefer to estimate and breakdown stories into small chunks of work, so that we can get continuous feedback on the work. At most, we want to get feedback within one iteration. 

This has the unfortunate effect that we are reluctant to abort stories once they are started. And we think that the technical assets are what is required from the story. In theory there should be some length of time at which we decide that the feedback we wanted to get from the story is not cost-effective, and we can take a different approach. Since we only deal with stories, we should be happy to throw away our technical assets accrued so far and start afresh.

TODO: clean up this thought (above) or remove it

