---
layout: post
title: "Spring Boot: A Hitchhiker's Guide"
categories: [technology]
---

After some years of doing minimal Java and Spring Boot development, recently, I have once again been developing a project with Spring Boot. It's a powerful framework, but one of the difficult things about it is understanding the structure it imposes on programs. For this reason, it has a bit of a reputation for magic, as it can be hard to grasp everything that your code is doing. In particular, it takes some time to understand where annotations are needed and why.

Without this understanding, you'll pick up a bad habit it can be hard to break out of: when encountering a problem, you assume there is an annotation to solve the problem. So you google your precise problem, and then copy in the first annotation you find. You get an error, so you iterate through the search results until you find the syntax that works. Eventually, this produces a working program, but what its actually doing remains mysterious.

![a mysterious system]({{site.url}}/img/mysterious-system.png)

Trying to avoid this, I thought back to the concepts that I've seen experienced developers use as a guide. Spring has a lot of documentation. But it can be difficult to find the important concepts amongst the details. Expert-level details can be discarded when you just want to produce an MVP. For that you need just the core concepts, enough to understand the consequences of the choices you're making. So here's what I've learned in my time writing Spring Boot programs.

## Inversion of Control ("IoC") container

This is the core concept of Spring, and builds on the [Dependency Injection pattern](https://martinfowler.com/articles/injection.html) - for constructing objects by explicitly passing dependencies to them. Although sometimes used to extract things that don't need to be widely available, this is generally a great pattern to use in your code. Each object declares the objects it needs, ideally in its constructor, and in this way the program can be initialized in an understandable way, with a sequence of object creations defining a clear object graph.

The "[IoC container](https://kozmic.net/2012/10/23/ioc-container-solves-a-problem-you-might-not-have-but-its-a-nice-problem-to-have/)" (or "[dependency injection container](https://blog.ploeh.dk/2012/11/06/WhentouseaDIContainer/)") reifies this pattern, removing the imperative, sequential, object-creation code you have to write, and "[inverting the control](https://en.wikipedia.org/wiki/Inversion_of_control)". It makes object definition declarative, either through XML config or annotations in the code. Once declared, the "IoC container" knows how to link the objects together and construct everything in the correct order. Next, we'll look more concretely at the kinds of configuration Spring needs to be given to achieve this.

### Annotations

Although XML is still a possibility for Spring configuration, it is now very rarely used. Instead now everything is done by annotations. The most important thing to understand about annotations is that [they don't contain any behaviour, they are metadata only](https://dzone.com/articles/how-annotations-work-java). The processing of annotations happens somewhere else entirely, by an annotation processor that is part of the framework. In Spring, the processing typically occurs at runtime via reflection.  

For the sake of understanding how the sausage is made, it would be nice to understand in more detail how this processing [is done in general](http://hannesdorfmann.com/annotation-processing/annotationprocessing101) and [in Spring specifically](https://dzone.com/articles/spring-annotation-processing-how-it-works). However, truth be told, for regular ([business stream-aligned](https://teamtopologies.com/key-concepts)) development knowing this stuff is not necessary. Processing the annotations is solely the responsibility of Spring, and can generally be treated as a black box.

#### Using Dependencies: `@Config` and `@Bean`'s

`@Config` is used to annotate a class with methods that return objects (or "[beans](https://www.tutorialspoint.com/spring/spring_bean_definition.htm)") to the Spring container. Each of those methods should be annotated with `@Bean`. So you would use this when constructing an object from a dependency you import. This will look something like this:

```
@Configuration
public class SecurityConfiguration {
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
}
```

#### Instantiating Your Classes: `@Autowired` and `@Component`

The `@Component` annotation on a class instructs Spring to construct an object of that class in the Spring container. Other annotations, such as `@Autowired`, can be used on such classes to instruct Spring exactly how to initialize that object. The `@Autowired` annotation specifically would be placed on the constructor, telling Spring to call the constructor, passing dependencies of the correct types from the Spring container:

```
@Component
public class ExampleClass {
        private PasswordEncoder encoder;
	@Autowired
	public ExampleClass(PasswordEncoder encoder) {
		this.encoder = encoder;
	}
}
```

Other annotations such as `@Controller`, `@Service` and `@Repository` will do the same as `@Component`, but they also are used for different functions too. They represent different "stereotypes", which we will come back to. For now we just need to know that generically to put objects in the IoC container we should use `@Component`.

## AutoConfiguration and Starters

There is another layer of abstraction that comes with Spring Boot - classpath scanning. This is different to the scanning that will be performed by Spring applications to process the annotations previously mentioned. With Spring Boot, you don't need to define all the beans that you want to use in your application, instead, you import some "spring-boot-starter"s that contain the functionality you need. These 'starters' also typically include dependencies of the corresponding Spring project, that you would otherwise have to add manually.  

When you add `@SpringBootApplication` to your main class in the root module, this enables autoconfiguration (via `@EnableAutoConfiguration`, which is included in the `@SpringBootApplication` annotation). Spring libraries contain rules to trigger the addition of relevant beans to the IoC container based on what Spring finds scanning the classpath, as described in [this video](https://www.youtube.com/watch?v=Sw7I70vjN0E).

For the same reason, in certain cases these starters will change their behaviour depending on the dependencies you have available. For this they typically use the `@Conditional` annotation on the relevant class. For each starter, you will have to look up the specifics of what they are doing, but [this article](https://dzone.com/articles/how-springboot-autoconfiguration-magic-works) gives a good intro to the mechanics of this and where to start looking into the details of how individual rules governing the AutoConfiguration is specified.

## Stereotypes

There are 3 common stereotypes that people use to specify specific types of "beans" (objects in the Spring container, managed by Spring):

#### 1 - `@Service`

The service layer in a Spring application is defined as being the layer in a web application that does not do request handling, and does not deal with making calls to the database. It covers the domain logic in between. This identification makes sense, but its a little vague. Its for this reason that, although you might want to use this annotation to communicate intent, it doesn't actually get processed any differently than a normal `@Component`.

#### 2 - `@Controller`

This is the annotation that always made the most sense to me. This identifies a class containing methods to handle HTTP requests. There are various annotations you can add to the class and to its methods to determine of HTTP request types will be routed to the methods. In the end you will end up registering a set of routes into an HTTP server that's built into the framework. This would be a regular blocking server that uses a thread per request in the case of SpringMVC, or a faster, non-blocking, HTTP server when you use Spring WebFlux. In this case the object returned will be "reactive", that is to say that they work in an asynchronous way. This is important to allow the web server to handle many requests using a single thread. Its also worth mentioning that there is a newer way of registering routes in WebFlux, with [Functional Endpoints](https://docs.spring.io/spring-framework/docs/current/reference/html/web-reactive.html#webflux-fn). This way is much clearer, and more similar to HTTP frameworks in other languages.

On the web topic, one other thing that's worth mentioning is [Spring Security](https://spring.io/guides/topicals/spring-security-architecture), as it adds pre- or post-processing steps to request processing. It applies cross-cutting concerns, so will affect the way requests are processed in all controllers. It's another place you need to look at when debugging request processing. There are quite a few different classes involve in Spring securities flows, so its worth getting familiar with the design of the framework. This is an area I've seen people struggle a lot with in the past.

#### 3 - `@Repository`

This is one of the most magical annotations in common use. This is named after the [repository pattern](https://docs.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/infrastructure-persistence-layer-design). In actual fact, this using the [JPA interface](https://en.wikipedia.org/wiki/Jakarta_Persistence) for [ORM](https://wozniak.ca/blog/2014/08/03/1/)s, typically implemented with [Hibernate](https://hibernate.org/orm/). So, that's a whole chunk of stuff you need to know about, the value of which has been hotly debated over many years. The `@Repository` itself, instead of being a class, is just an interface, from which the Spring Data framework will generate all the code for talking to the database.

A `@Repository` also expects that the entity type you specify for the repository must be a class with the `@Entity` annotation and various other annotations to make it suitable for use as an entity in the ORM framework. In theory the interface exposed by the Repository should be a domain model, so you have to be very careful that the  requirements for persistence annotations do not compromise the design of the domain model. Often they do, this is [a fundamental flaw of the ActiveRecord pattern](https://softwareengineering.stackexchange.com/questions/119352/does-the-activerecord-pattern-follow-encourage-the-solid-design-principlespersonal). My preference in this space would be to use a non-ORM framework like [jOOQ](https://docs.spring.io/spring-boot/docs/2.1.13.RELEASE/reference/html/boot-features-sql.html#boot-features-jooq) which would avoid the avoid the use of all of these annotations, and allow for clear separation of database operations from domain logic.

## SpringAOP annotations and `@Transactional`

Most of the examples so far have been about configuring classes to work within a container (context) provided by the framework, or about wiring in dependencies. But we can also insert framework functionality in between our method calls. These work like [the classical model of Aspect-Oriented Programming](https://abstractowl.github.io/2014/07/09/intro-to-aop.html) ("AOP"). Using the [`@transactional` annotation](https://dzone.com/articles/how-does-spring-transactional) as a specific example, a dynamic proxy is used to establish a database transaction before the contents of the method are executed. After the method returns, the proxy commits the transaction, or rolls back if an exception is thrown. A former colleague wrote  [a nice blog post](https://opencredo.com/blogs/dynamic-proxies-java/) that goes into more details about how dynamic proxies work. You may also want to look into cglib, which is an alternative to jdk dynamic proxies.

# App Structure

By now, we have enough to undrestand the overall structure of a Spring app. If we draw out the components of a typical app, it might look something like this:

![spring app structure]({{site.url}}/img/spring-app-structure.png)

This shows that all the code we write in a (simple) Spring Boot app is heavily dependent on the context that Spring provides. For a simple app, very little actual code is needed! One thing we cannot forget to mention is that the entire skeleton of an app can be generated by the [Spring Initializr](https://start.spring.io/), which is the best way to start your Spring projects.

# Package Structure

Because the Spring framework provides so many standard features and cross-cutting concerns, it seems to be a common practice to structure by stereotype, i.e. putting web controllers, repositories, data models, etc together. This can be helpful for demo applications as it emphasizes the different parts of the framework in play. But there is nothing in Spring Boot that requires you to do this and [it is normally not the best approach](https://dzone.com/articles/package-by-layer-for-spring-projects-is-obsolete). You can also read a [more detailed take on why this is](https://phauer.com/2020/package-by-feature/). Remember that the use of packages is still relevant in Spring - Spring components should be some subset of your public classes, but there is still room for encapsulated package-local classes in your program design. This is something that I think there should be more of in Java projects being developed with Spring, as it allows for better separation of different components withing a single service.

# Summary

As we have seen, there's plenty of different uses of annotations in Spring, corresponding to the different projects. Here we have looked at how the annotations define the overall architecture and have highlighted at the high level how different Spring subprojects are invoked to do additional processing of beans based on the type of annotation applied. You will still make mistakes and will still need to consult the docs, but hopefully this base of understanding will allow you to fit what you find into your understanding of the system. Going deeper, the dedicated practitioner has a lot more work to do to understand the specific affordances enabled by each Spring subproject, and to really understand the implementation by digging into the code.
