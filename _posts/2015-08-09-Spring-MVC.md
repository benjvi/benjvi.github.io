---
layout: post
title: "Servlets and SpringMVC"
categories: [technology]
---
On a reecnt project, I was using Java Servlets. The reason was, the prototype for the project was written solely with JSPs, and understanding how those work within the servlet container made it very easy to migrate the controller from being in the JSPs to being in a Java servlet. This enabled me to refactor a lot of the secondary logic and the models to POJOs, which would largely remain unchanged regardless of the Java framework.   

Separately, I was working on a Spring project in my spare time, and have come to appreciate the relative benefits of an architecture based around an DI container that holds a number of Java beans. So then, the question that concerned me was: is it true that the SpringMVC approach to request handling is more elegant due to the way it deals with dependency injection and so on? And if so, does that make up for the extra complexity that comes with the Spring framework itself?

### Servlets

For the Servlet, the situation is fairly simple. The webapp's eb.xml defines a mapping from a URL to a servlet, then the Servlet itself contains two methods: doGEt and doPost. Both of these methods take in two objects, an HttpServletRequest and an HttpServletResponse. the first contains details of the request we received, and the second is where we will write our model details to. In fact, anything we send to standard out from these methods will be part of the HTML response, although it is normal to use a requestdispatcher to render the response via a jsp (with our request/response objects included). In effect the normal flow should look like this:

1. Servlet method invoked
2. Create Service object to parse input
3. Construct appropriate model based on decision/info passed from service object
4. Add model to the request and invoke the jsp to be rendered

This doesn't seem too bad, but there is a potential problem. Because all our work in the servlet must be done within the doGet/doPost methods (we cannot have any instance variables) we cannot adopt a normal OO coding style there and must therefore delegate to the Service object. This is not so nice because then we have to split up our controller code (or create a duplicate controller) if we need to use OO design patterns in the controller logic. We would prefer to have a POJO directly as the controller.

### Spring MVC

Enter Spring MVC. Here our controller is just a normal POJO (with some annotations). This enables us to inject the controller's dependencies from the Spring IoC container (and therefore we are allowed to populate instance variables for each request). similarly o with servlets, we must write our model details to an object in a method which is annotated as being the request dispatcher. We have some flexibility in the exact object class used to do this; we may choose to use the same HttpServletREquest & Response as the Servlets use. However, we do not construct the mechanism used to return the HTML response, nor do we construct it directly. Instead, we can specify only a string that is an internal identifier for the template that will be used to render the model data that we have provided.  

This internal identifier is picked up by another java object, a ViewResolver. This performs the mapping between the internal String identifier and the physical path of the template to be rendered. Finally, there is a view object that picks up the physical template path and renders it, along with the model, as an html page to be returne.

### Comparision

So, this is all very nice. All the restrictions we should normally put on the Servlets (not using physical path names, not directly building html there, etc) are now enforced by the framework. However, we did introduce a bit of opacity: namely, in how the java beans are instanciated. In the servlet we know that only the state we specifically add to the session will be persisted beyond the request; everything else is constructed within the servlet method and therefore should be gone after that method returns.

In Spring we may easily make an error so that beans are accidentally shared between requests (although of course we are able to configure it so that each time a bean is injected it is with a new instance).

