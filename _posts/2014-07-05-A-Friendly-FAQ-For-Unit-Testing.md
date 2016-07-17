---
layout: post
title: A Friendly FAQ For Unit Testing
categories: [technology] 
---
 
<h3>The Basics</h3>
 
Unit testing, in its modern form, is the process of writing automated test scripts that run against your units of code. This is usually tied together with OO programming practices, but also can be applied elsewhere. The benefits are as follows:
<ul>
	<li>Lowers chance of regression in the codebase. This in turn encourages (enables!) refactoring</li>
	<li>Shortens the feedback loop; problems are found earlier</li>
	<li>Is a precise documentation of the system, and the intent of pieces of code</li>
	<li>Encourages good design; it makes you think about the coupling and interfaces of the design</li>
</ul>

The form of the test is usually quite simple - you will have:
<ol>
	<li>A method to set up resources than can be used by all tests</li>
	<li>A method to initialize before every test common dependencies/common state</li>
	<li>The test method itself - which includes:
		<ul>
			<li>Initialization of state and dependencies that are specific to that test method</li>
			<li>Call to the method under test</li>
			<li>Assertions of the expected state that is produced by the test method</li>
		</ul>
	</li>
	<li>Test-specific cleanup</li>
	<li>Cleanup of shared resources after all tests have run</li>
</ol>
 
Tests will pass when the assertions all return true, and no exceptions are encountered during the test execution. Otherwise, the test will fail.

<!--more-->

<h3>How many tests will I need to write?</h3>
 
<ul>
	<li>Tests should act as a design document. They should specify all significant conditions that the code under test is expected to deal with and check the correct output is given in each case.</li>
	<li>Typically there will be multiple tests for each public method in a class</li>
	<li>Often people will talk about code coverage. This is merely a convenient heuristic; do not feel compelled to make sure every line of code is covered. Any complex logic which might fail or give unexpected results - or where you could have made a mistake - needs to be tested. That's the principle you must follow.</li>
</ul>
 
<h3>What exactly is a unit?</h3>
 
We start from the general, approximate, answer: <em>a unit is an object</em>. An object should be a cohesive unit containing its own behaviours. It is these behaviours we want to test in isolation when we are unit testing. But, there is a complication. 

Objects have dependencies. And these dependencies may affect the methods we want to test. And, those objects in turn may have dependencies. We start to get into divisive issues here - but there is a simple question to ask ourselves: how much complexity is hiding behind those objects? 

Is there a single model class behind? - in which case we can extend our notion of a unit into a functional one that is composed of the two classes. As shown by design patterns, we are able to identify cohesive units that are larger than a single class. And speaking practically, we should always be able to diagnose a test that fails based on the tests that also fail for the model. Alternatively, is it an input we are receiving through a public interface? Are we trying to access complex resources - a database, or something over the network? These are things that do not belong in the same unit with a normal piece of business logic. 

A further principle we need to keep in mind: tests should be largely independent - if one test fails that shouldn't make loads of other tests fail as well. This is what helps us to identify the unit where the problem is and is what helps us debugging. 
 
<h3>What are the common pitfalls?[1]</h3>
<ul>
<li>Don't start by trying to add tests to your existing codebase! It may be possible but the first step should be to add tests to new classes only. You will be able to come back to the existing classes when you have some experience</li>
<li>Avoid testing static methods - unless you are absolutely sure they are functional. Any global state held in static variables leads to unpredictable results in unit tests. Even where static methods are functional, keep a note of them in case the static method might change and become non-functional later. </li>
<li>Avoid testing anything to do with threading or where external resources such as databases, remote servers are involved (later you will find out how to deal with these with mock/fake objects). At the start, just avoid them.</li>
<li> Make sure that you set things up and clear them down properly after each test. Tests can be run in any order so any persistent state between tests - even in external artefacts - will play havoc with your test results</li>
</ul>
<h3>What are mock objects?</h3>

Mock objects - or test objects as we'll call them here [2] - are simulated objects that we can use to stand in for resources we can't access in test, or to for resources which are beyond the scope of our test (ie outside our unit). There are three different categories we might be interested in:
<ol>
<li><em>Stub</em>: These objects return the expected values to the unit that is under test. They might give a single canned response or a number of responses corresponding to parameters passed. They are used to stand in for external dependencies of our test.</li>
<li><em>Fake</em>: This is an object which contains a lightweight implementation of the required functionality. There will actually be some operations/calculations that are actually performed by the object. They largely are used for much the same purpose as stubs, but will be used where it is easier to create some simple logic to make responses, than to manually specify a large number of canned responses.</li>
<li><em>Mock</em>: This is an object that expects to receive a particular number of method calls, with particular parameters. It servers a different purpose than stubs or fakes, it checks that a particular method is called as a result of a test. In other words, these objects are not concerned with providing the correct state for the test case. Rather, they are concerned with behavioural verification. For example, you might check that some logic in a save() method results in a call to a method that writes the result to the database.</li>
</ol>
 
<h3>Do I need to use stubs or fake objects?</h3>
 
 It is not absolutely vital to use them in your tests immediately. However, once you have got to grips with the basic unit test ideas, it is a good idea to move onto using these quite quickly, as they are necessary to limit the scope of your testing. If your method takes some data from a complicated factory method and then performs some business logic on it, you would probably not want to test the factory method in the unit test for your business logic calculation method. Instead, you should use a stub that directly returns the source data which you want to test on[3]. 
 
<h3>Do I need to use mock objects?</h3>

Occasionally. If it feels more comfortable, it is possible to use mock objects instead of stubs. However, it is less often necessary to check the order and the number of method calls and can potentially be an obstacle to re-factoring. For most tests the important point is that the correct state is produced in response to the input conditions. But, where there are concrete (eg externally-facing) interfaces it can be helpful to know that the method calls are made at the right time. There is a lot more to go into here - Martin Fowler writes a more comprehensive (if slightly one-sided) <a href="http://martinfowler.com/articles/mocksArentStubs.html">piece</a>. Bottom line: for a beginner there is more complexity to this approach and limited situations where its absolutely necessary. Don't start off here.

<h3>Which are good testing frameworks to use?</h3>

For basic unit testing frameworks it may be helpful to stick with xUnit - which is a common framework that has been ported to many different languages. With that said, there's not too much difference - I have used the Visual Studio Testing Framework for C#, coming from jUnit, and its not very difficult at all to switch. Most of these frameworks are quite mature and work well so there are not too many problems either way. 

With stubbing and mocking frameworks, there is a little bit more variety and a little bit more of a choice to make. From my impressions, Mockito in Java is the cleanest to use, and <a href="http://stackoverflow.com/questions/22697/whats-the-best-mock-framework-for-java">does seem to be the most popular</a>. But, there are many different frameworks with similar features and each with their adherents(this is especially the case for C#), so <a href="http://stackoverflow.com/questions/642620/what-should-i-consider-when-choosing-a-mocking-framework-for-net">there is not always a simple answer</a>. I have been working MoQ with .NET3.5 for some time now and I found that was very easy to use and with enough features, at least for TDD.

<h3>Notes and References</h3>
<ol>
<li>More discussion in <a href="http://www.daedtech.com/introduction-to-unit-testing-part-3-unit-testing-sucks">this article</a></li>
<li>Unfortunately the terminology that is used seems to be a bit inconsistent. For example, "mock" is the most commonly used umbrella term, but it is also a more specific category of object as well. So we use the generic term "test object" for clarity - and use "mock" as a specific type of test object used for behaviour verification</li>
<li>Even this is subject to some debate - as there is some benefits to running mini-integration tests that tests a method along with its dependencies. But, the primary thing we want to know is whether THIS method (the one I'm working on now) works as designed.</li>
<li><a href="http://blog.8thlight.com/uncle-bob/2014/05/10/WhenToMock.html">When to Mock (some straightforward rules)</a></li>
</ol>
