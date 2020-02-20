---
layout: post
title: "Automating Deployments with environment-specific config and secrets"
categories: [technology]
image: ibelonghere.png
---

An interesting part of working as a consultant is that the challenges described to you by a client at the start of a project always turnout to be different to the challenges that you actually face during a project. One of the themes that always seems to pop up unexpectedly is continuous delivery. I see a lot of companies that think Continuous Delivery is not strategically important. Or, at least, it is not important enough or challenging enough to devote an intiative to improving. The reason perhaps being, if you have a simple setup with a single target environment, a simple `circle.yml` or `travis.yml` file which maybe calls a couple of custom build and deploy scripts, usually suffices to build and deploy into the target environment. So it really doesn't look difficult. 

However, in cases where releases need to be deployed into multiple environments, or deployed releases rely on multiple evolving dependencies, the logistics of continuous delivery becomes something that we see people start to struggle with. Managing these processes is not a simple thing and it is tempting for people to jump ship at this point. But there are achievable and standard way to overcome these problems. Jez Humble says that the inspiration to write the 'Continuous Delivery' book Our CTO, Nicki Watt, has talked on the similar topic of appropriately defining infrastructure components in the context of building infrastructure with terraform. The process of decomposing infrastructure definitions so that different infrastructure services are defined separately, also brings the need to orchestrate those services as they get applied to different environments. But this same problem occurs for any software that has a complex release and deployment process.

# Managing Environment-Specific Configuration

One problem that I have seen repeatedly is the problem of applying environment-specific configuration to be used by an application. Something like an `application.properties` file in Spring. If this configuration is not secret we may store it separately from the application in a separate folder or separate repo containing environment-specific information. We can then looking that information when it comes time to deploy to that environment. This is usually sufficient to allow starting to do automated deployments to multiple environments.

However, when we come to update the structure of the configuration we have a problem. We now have a one-to-many relationship between the application and its configuration for multiple environments. If the application adds a database, new configuration fields are now mandatory for the deployment of the new version to succeed. Those new fields should be generated and staged for deployment in every repo. We must enforce that whenever the new version of the application is deployed it is using a configuration with the new fields present.

If we could continue to check in configuration to the application repo this would work quite well. When the release process would pick up the updated application code it would also pick up the updated configuration. However, if the process of creating the database is to be automated, which it should be, this process will not work. We will need to pick up the database url and credentials from the terraform output and inject it into the application configuration. We don't want to have to do the deployment of all databases across all environments as soon as we produce a new application version.

Instead, we want the application deployment process to declare that it now depends on a database, and as part of the application deployment process we now want the database to be created in an environment if it doesn't exist. After that, we will take the generated database config and use that to deploy an updated application config. This could be as simple as plugging in values to a templated configuration file that gets deployed with the application, or it could involve pushing values to a config or secret server. 

A nice property of this solution is that we start to think about our config in a more segmented way. Configuration properties are not just static *sui genesis* key-value pairs, or nested maps thereof, they are metadata associated with various components and service that may evolve as those systems do. Locating application dependencies is different than setting configuration that turns on debug mode in a test environment, which is again different from discovering the endpoints an application may need to know about to call its collaborators.

# Hands-on : Escape

Since former colleague Bart Spaans wrote about how you can do things like this with the tool that he wrote, Escape, that is what I'm going to use to demonstrate how this can be done in practice. I'm going to assume our app is running in Kubernetes on GCP and, when we introduce it, the database is going to be provisioned as a CloudSQL using terraform. 

At time t=0, we have an infrastructure-related terraform config that constructs a kubernetes cluster on GCP, and we have a couple of kubernetes resource definitions that define a configmap and a deployment that mounts that configmap and runs the service. We also define a build process that publishes a Docker image that gets picked up by that (Kubernetes) Deployment.

At t=1, we introduced the database to persist some state from our application so we now need to add it to our deployment process. At this point, it may be tempting to add that to our existing terraform config but that is probably a bad idea. These things are likely to evolve independently. We can either decide to include the database creation as part of our deployment process, or we can tell the deployment that it should just consume an existing database, in which case we would need a separate release process to build the database. 

This setup decouples the deployment somewhat from our release process, in order to give more flexibility to deploy to different environments at different times. Still we make sure that in every case, application deployments also process dependencies correctly to ensure a functioning environment.

# Secrets

One thing I glossed over a little bit so far is credentials. In the model presented, the database component publishes its metadata as plain variables that can be accessed after creation by subsequent steps in the pipeline. This is not necessarily what we want. On the initial creation, the database credentials must be placed somewhere that deployed credentials can be picked up by the application. But is not necessary for the application deployment to have access to them, and we may not even want them to be in the application configuration file at runtime. Most secure would be to put them into a secret server and have the application access them only when necessary. 



References

Evolving Your Structure with Terraform - https://www.youtube.com/watch?v=wgzgVm7Sqlk

Continous Delivery - Jez Humble - Configuration Chapter

Deploying databases with Escape - https://www.ankyra.io/blog/combining-packages-into-platforms/


