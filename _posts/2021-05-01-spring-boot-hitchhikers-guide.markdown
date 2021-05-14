---
layout: post
title: "Spring Boot: A Hitchhiker's Guide"
categories: [technology]
---

After some years of doing minimal Java and Spring Boot development, recently, I have once again been developing a project with Spring Boot. It's a powerful framework, but one of the difficult things about it is understanding the structure it imposes on programs. For this reason, it has a bit of a reputation for magic, as it can be hard to grasp everything that your code is doing. In particular, it takes some time to understand where annotations are needed and why.

Without this understanding, you'll pick up a bad habit it can be hard to break out of: when encountering a problem, you assume there is an annotation to solve the problem. So you google your precise problem and then copy in the first annotation you find. You get an error, so you iterate through the search results until you find the syntax that works. Eventually, this produces a working program, but what it's actually doing remains mysterious.

![a mysterious system]({{site.url}}/img/mysterious-system.png)

Trying to avoid this, I thought back to the concepts that I've seen experienced developers use as a guide. Spring has a lot of documentation, but it's not easy to find the essential concepts amongst the details. When you just want to produce an MVP, you don't want to be overburdened with expert-level details. You need just the core concepts, enough to understand the consequences of the choices you're making. So here's what I've learned in my time writing Spring Boot programs.

## Inversion of Control ("IoC") container

This is the core concept of Spring, and builds on the [Dependency Injection pattern](https://martinfowler.com/articles/injection.html) - for constructing objects by explicitly passing dependencies to them. Although sometimes used to extract things that don't need to be widely available, this is generally a great pattern to use in your code. Each object declares the objects it needs, ideally in its constructor. You go object by object, constructing dependencies first and dependent objects later. This initializes the program in a clear, robust and flexible way, with a sequence of object creations defining a clear object graph.

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

Other annotations such as `@Controller`, `@Service` and `@Repository` will do the same as `@Component`, but they also are used for different functions too. They represent "stereotypes", which we will come back to. For now, we just need to know that,  generically, to put objects in the IoC container, we should use `@Component`.

## AutoConfiguration and Starters

There is another layer of abstraction that comes with Spring Boot - classpath scanning. With Spring Boot, you don't need to define all the beans you want to use in your application. Instead, you import some "spring-boot-starter"s that contain the functionality you need. These 'starters' also typically include dependencies that you would otherwise have to add manually.  

When you add `@SpringBootApplication` to your main class in the root module, this enables "AutoConfiguration" (via `@EnableAutoConfiguration`, which is included in the `@SpringBootApplication` annotation). With this mechanism, Spring libraries use rules to trigger the addition of relevant beans to the IoC container, based on what Spring finds scanning the classpath. [This video](https://www.youtube.com/watch?v=Sw7I70vjN0E) describes this in detail. Amongst the beans that Spring is looking for on the classpath are the various libraries that make up "spring-boot-starter"s. 

In certain cases, these libraries will also change their behaviour depending on the dependencies you have available. For this, they typically use the `@Conditional` annotation on the relevant class. For each starter, you will have to look up the specifics of what they are doing, but [this article](https://dzone.com/articles/how-springboot-autoconfiguration-magic-works) gives a good intro to their mechanics. It will tell you where to start looking into the details of how individual rules governing AutoConfiguration are specified.

## Stereotypes

There are 3 common stereotypes that people use to specify specific types of "beans" (objects in the Spring container, managed by Spring):

#### 1 - `@Service`

The service layer in a Spring application is the layer in a web application that does not do request handling, and does not deal with calls to the database. It covers the domain logic in between. This identification makes sense, but it's a little vague. It's for this reason that, although you might want to use this annotation to communicate intent, it doesn't get processed any differently than a regular `@Component`.

#### 2 - `@Controller`

`@controller` identifies a class containing methods to handle HTTP requests. There are various annotations you can add to the class and its methods to determine HTTP request routing. Those annotations associate a method in the controller class with a particular HTTP path and verb. In the end, you will end up registering a set of routes into an HTTP server built into the framework. With SpringMVC, it's a regular blocking server that uses a thread per request. With Spring WebFlux, it's a faster, non-blocking, HTTP server. In this second case, the object returned will be "reactive" - that is to say, the object provides an asynchronous interface. This allows the web server to handle many requests using a single thread. Its also worth mentioning that there is a newer way of registering routes in WebFlux, with [Functional Endpoints](https://docs.spring.io/spring-framework/docs/current/reference/html/web-reactive.html#webflux-fn). This way is much clearer, and more similar to HTTP frameworks in other languages.

On the web topic, one more thing that's worth mentioning is [Spring Security](https://spring.io/guides/topicals/spring-security-architecture), as it adds pre- or post-processing steps to request processing. It applies cross-cutting concerns, so it affects the way all controllers process requests. It's another place you need to look at when debugging request processing. There are quite a few different classes involved in Spring securities flows, so it's worth getting familiar with the framework's design. Spring Security is an area I've seen people struggle a fair amount with in the past.

#### 3 - `@Repository`

One of the most magical annotations in common use. This is named after the [repository pattern](https://docs.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/infrastructure-persistence-layer-design). In actual fact, this using the [JPA interface](https://en.wikipedia.org/wiki/Jakarta_Persistence) for [ORM](https://wozniak.ca/blog/2014/08/03/1/)s, typically implemented with [Hibernate](https://hibernate.org/orm/). So that's a whole chunk of stuff you need to know about, the value of which has been hotly debated over many years. The `@Repository` itself, instead of being a class, is just an interface - from which the Spring Data framework will generate all the code for talking to the database.

A `@Repository` also expects that the entity type you specify for the Repository must be a class with the `@Entity` annotation and various other annotations to make it suitable for use as an entity in the ORM framework. In theory, the interface exposed by the Repository should be a domain model, so you have to be very careful that the requirements for persistence annotations do not compromise the design of the domain model. Often they do - this is [a fundamental flaw of the ActiveRecord pattern](https://softwareengineering.stackexchange.com/questions/119352/does-the-activerecord-pattern-follow-encourage-the-solid-design-principlespersonal). My preference in this space is to use a non-ORM framework like [jOOQ](https://docs.spring.io/spring-boot/docs/2.1.13.RELEASE/reference/html/boot-features-sql.html#boot-features-jooq), which would avoid the use of all of these annotations and allow for clear separation of database operations from domain logic.

## SpringAOP annotations and `@Transactional`

So far, most of the annotations we've seen have been about configuring classes to work within a container (context) provided by the framework, or about wiring in dependencies. But we can also insert framework functionality in between our method calls. These work like [the classical model of Aspect-Oriented Programming](https://abstractowl.github.io/2014/07/09/intro-to-aop.html) ("AOP"). Using the [`@transactional` annotation](https://dzone.com/articles/how-does-spring-transactional) as a specific example, it uses a dynamic proxy to establish a database transaction before the contents of the method are executed. After the method returns, the proxy commits the transaction, or rolls back if an exception is thrown. A former colleague wrote [a nice blog post](https://opencredo.com/blogs/dynamic-proxies-java/) that goes into the details of the workings of dynamic proxies. You may also want to look into cglib, which is an alternative to jdk dynamic proxies.

# App Structure

By now, we have enough to understand the overall structure of a Spring app. If we draw out the components of a typical app, it might look something like this:

![spring app structure]({{site.url}}/img/spring-app-structure.png)

This view shows that all the code we write in a (simple) Spring Boot app is heavily dependent on the context that Spring provides. For a simple app, very little actual code is needed! It also shows one more thing we cannot forget to mention - [Spring Initializr](https://start.spring.io/) can be used to generate the entire skeleton of an app. It's the best way to start your Spring projects.

# Package Structure

Because the Spring framework provides so many standard features and cross-cutting concerns, it seems to be a common practice to structure by stereotype, i.e. putting web controllers, repositories, data models, etc together. This practice is convenient for demo applications as it emphasizes the different parts of the framework in play. But there is nothing in Spring Boot that requires you to do this and [it is generally not the best approach](https://dzone.com/articles/package-by-layer-for-spring-projects-is-obsolete). You can also read a [more detailed take on why this is](https://phauer.com/2020/package-by-feature/). Remember that the use of packages is still relevant in Spring - Spring components should be some subset of your public classes, but there is a benefit of using encapsulated, package-local classes in your program design. This form of encapsulation is something that I think there should be more of in Java projects being developed with Spring, as it allows for better separation of different components within a single service.

# Summary

As we have seen, there's plenty of different uses of annotations in Spring, corresponding to the various projects. Here we have looked at how the annotations define the overall architecture and have highlighted at the high level how Spring invokes its subprojects to do additional processing of beans based on the type of annotation applied. You will still make mistakes and will still need to consult the docs, but these basic concepts will allow you to fit what you find into your understanding of the system. Going deeper, the dedicated practitioner faces a bit more work to understand the specific affordances enabled by each Spring subproject, and to really understand the implementation by digging into the code.
