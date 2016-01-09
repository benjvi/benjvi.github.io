Micro-Databases

Of all the many hard things, doing databases correctly is probably the hardest part of doing microservices correctly. The main questions we have to answer are:
- How many databases should we have?
- How can we scale out the database to handle load?
- How can we setup our database for resiliency/HA?

To make this more concrete, I will look at the small microservices system I have been working on. This is composed of an API gateway which, in response to user requests, pushes jobs onto a job queue. THere are separate worker services which consume the job queue and create or update database records as part of the job execution. These workers are the only service which may update the database.

However, read requests do nott go through the same workers, they are instead handled directly by the API gateway. This means there is a clear separation of logic for short-lived synchronous requests, and long-running asynchronous requests. THe cost of this is some duplication of data-access code across the two services. This should be acceptable, however, because the two services are part of the same bounded context; they are both pieces of a larger coherent system. (NB - this is not CQRS, these are using the same concepts for both queries and commands).
 
This does, however, induce some undesireable properties when it comes to microservices. We cannot bundle the database together with the service into a single deployable unit. When scaling, the number of database instances we may require does not only scale with the workers, but could (more likely, in this case) scale with the number of API gateway instances we have. 

Although this is not a system where high scalability is critical (the bottleneck is an upstream service and so even under high load, the majority of our time in spent in waiting for those remote calls to complete, rather than in database actions of cpu processing), we have used MongoDB for the persistence layer. Therefore, it is pretty easy to set this up as a replica set to make a basic HA setup, where (worst-case) the master migrates in case of instance failure and we cannot lose data unless all of the instances fail simultaneously (or close to simultaneously).

Microservices vs pods



References

techcrunch article - "I want stateful microservices"