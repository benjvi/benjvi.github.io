---
layout: post
title: "Java Certification: What You Need to Know"
categories: [technology] 
---

Last weekend, I became an Oracle Certified Java Professional. It took some efforts to prepare for this exam, but in the end I was able to pass with flying colours. So, I thought this would be a good time to share some tips on preparing for the exam - and what you might hope to get from that work beyond a certificate.  

First off, I have to say, this is not an easy exam. I do not work with Java every day, but I have been using it sporadically and in my own projects for more than two years. Still, it took me a month of hard (albeit part-time) study including a week of heavy cramming to be really well-versed on all the material. Part of the reason for this is that, as a user of the language, you are not necessarily aware of all the different possibilities; once you find some patterns that work you can just re-use them without knowing about all the other options that the language provides for you.  

<!--more-->

There are certainly some pre-requisites: you should have a solid understanding of basic object oriented principles - what are objects, and their variables and methods, what is inheritance, etc. I don't think it would be feasible to pass this exam without having previously seen these concepts and used them in practice. Neither should this exam be the first goal of a newcomer to programming in my opinion - common imperative constructs and flow control need to be second nature to work out what's going on in the code samples that form the questions.  

### Tackling the exam

The exam format is centred around the presentation of many different samples of code, which you typically have to evaluate and predict what will happen when the code is run. These samples are quite short, no more than 40 lines, but the scope of these questions should cover the full set of Java syntax and also the use of core Java APIs (common classes in the java.util and System.io packages, amongst others).  

The core information on the exam is covered by the Kathy Bates SCJP6 book. This is a big book - but it covers everything you need to know <em> for Java 6</em>. This is fine for me - I am working in a Java 6 environment and with Android, which is basically a fork of Java 6. But, for later versions of Java, some topics like the use of Exception/File/Calendar would need to be revised. Unfortunately this book was not updated for Java 7, but nevertheless the quality of the exposition in it makes it well worth recommending as a starting point.  

Beyond reading the textbook, I found the most useful two activities to be: 
<ol>
<li>Taking practice questions (lots of practice questions)</li>
<li>writing out my own notes from the parts of the book that I found difficult - doing further research if things didn't seem clear</li>
</ol>
Writing code is also an important activity, but it will be tricky to find meaningful projects where all the edge cases you will run into on the exam will be applicable. Ideally relevant exercises would be included in your textbook - but the SCJP6 book only has one or two. I therefore found it slightly more productive to focus on the conceptual basis and the reasoning behind the language design.  

### Learning Points 

That idea, of having a conceptual basis, also tended to divide the useful topics from the less useful topics of the exam. For me the most interesting learning points were:  
<ul>
<li><em>Getting in-detail with Polymorphism</em>. this is a profoundly useful concept in program design. Perhaps most commonly, this forms a basis for the Dependency Injection pattern, whereby we are able to cast an object to an interface and keep encapsulation whilst still ensuring the necessary dependencies are captured by our object. Similarly it is valuable to be able to realise that instance variables and static methods are still accessible through objects but are not subject to polymorphism.</li>

<li><em>Embracing the expressive power of the language</em>. Java is a large language, and we don't have to use all its concepts to get by. But it is helpful to be aware of the constructs available to express ourselves  most accurately and with fewer side-effects. A good example would be the use of assertions to reason about correct state as we progress through a method. The presence of this as a language feature rather than having to code it up manually indicates that this is an important tool to use when programming, and is a prompt to add it to our toolkit of useful patterns</li>

<li><em>Immutability vs. mutability</em> (reference value assignment vs. object state change). Not strictly a topic on the exam, but from the code presented, we start to see why immutable objects tend to be preferred where possible. Many of the complications in the examples presented come from objects changing in the background (eg if we put an object in a hashmap, and change it, we may not be able to find it again!). This also leads to complicated situations in synchronizing multi-threaded code.</li>

<li><em>Usage of data structures</em>. These are some of the most important basic tools of a programmers trade; it is important not to equate every problem with a nail to be hammered. Not every problem requires a dictionary, or an iterator - this are specific constructs we should use to reflect the needs of a particular design. If that's not enough, most companies want to know that you are able to use these effectively - to know which are appropriate for a particular situation. The exam requires you to know how to make best use of the standard java structures available in the collections framework.</li>
</ul>  
And the least useful:  
<ul>
<li>The topics on internationalisation, dates, and formatting didn't seem especially useful to me (especially as most of the Calendar class will be deprecated in Java 8). These topics (a) are not very important to what I'm currently doing, and (b) don't have a strong logic underlying their implementation.</li>

<li>In general, we are expected to go into a little bit too much detail with memorising things like which methods and method arguments are required for each class. Certainly, we sometimes want to know that we must implement (eg) the Sortable interface for sorting objects in our classes, but we can generally rely on an IDE/compiler to point out any mistakes in the method arguments. So long as we know the limitations of those mechanisms, the specific interface details are not always important.</li>
</ul>  

In general, I would say that the interesting points are where we can identify language features as enabling good program design, and less interesting is when we have to memorize seemingly arbitrary (or poorly thought-out) choices in language or API design. The main thing I was left wanting was guidance as to correct usage of patterns beyond that enforced by the language. Although we are provided with many code samples, we are left to reason them out on our own. This is the most important next step to build upon this qualification, to synthesize understanding of the language vocabulary with the abstract design patterns theories (like those from GoF/POSA1).

### References

<ul>
<li><a href="http://www.amazon.co.uk/Certified-Programmer-Study-Guide-CX-310-065/dp/0071591060/ref=sr_1_1?ie=UTF8&qid=1402743264&sr=8-1&keywords=scjp6">SCJP6 book by Kathy Bates</a></li>
<li><a href="http://www.examlab.org/">ExamLab (hard practice exams)</a></li>
<li><a href="http://www.amazon.co.uk/Design-patterns-elements-reusable-object-oriented/dp/0201633612/ref=sr_1_1?ie=UTF8&qid=1402743542&sr=8-1&keywords=gof">"Gang of Four" classic design patterns book</a></li>
<li><a href="http://www.amazon.co.uk/Pattern-Oriented-Software-Architecture-Volume-Patterns/dp/0471958697/ref=sr_1_1?ie=UTF8&qid=1402743604&sr=8-1&keywords=posa1">POSA1 Design Patterns book</a></li>
<li><a href="https://www.coursera.org/course/posa">POSA for Android MOOC</a></li>
</ul>
	

