---
layout: post
title: "Terraform Provider Development: My Approach To Resource Modelling"
categories: [technology]
image: ibelonghere.png
---

One of the nice things about terraform, and one of the reasons that it has been so successful is in how easy it is to plug  new (cloud) APIs into. Terraform offers scaffolding you can easily build upon to create new Providers and new Resources (also Data Sources). For a new resource, you just need to create:
 - a resource schema definition
 - a set of CRUD methods that wrap API methods for the relevant resources 
 - translations of the API resource representations into the defined schema
 
 On the provider level, you need to define little more than the set of resources that the provider can manage, and how to construct the API client that will be used to interact with the backend. 

There are a bunch of useful resources on how to get started with provider development, foremost upon them the [HashiCorp Guide](https://www.terraform.io/guides/writing-custom-terraform-providers.html) and [Terraform Contributing Guide](https://github.com/hashicorp/terraform/blob/master/.github/CONTRIBUTING.md). [This article](http://container-solutions.com/write-terraform-provider-part-1/) is also nice, covering some of the same material just in a different way. With the mechanics already covered, here we will illustrate some of the choices you will need to make in translating your API definitions into terraform resources, and give some guidance for how to make these decisions.

# Defining Your Resources

# Schema

The first step I usually take when defining a new resource is to transcribe the fields from he API docs into a  Terraform resource. The name of each terraform attribute should generally be the same as the name of the object in the API (the convention in terraform is to use camel-casing, which also typical in JSON). Since the types that the terraform schema supports is more constrained than general datatypes in Go, we need to do some simple mapping:
  - Ints, Strings and Booleans map directly to the terraform types `TypeInt`, `TypeString`, `TypeBool`
  - For some simple types like `Float`'s and `Time`'s it makes sense to serialise them as `TypeString`. However for most simple structs, you should used terraform's way of defining nested objects (see below)
  - Go itself doesn't have much support for enums, however, if the data is of this nature this would be handled by using the `validation.StringInSlice` function from the XXX package as the `ValidateFunc` of the attribute
  - Another validation function I make use of frequently is `validation.IntInRage`
  - Other more complex types can be specified, but need a bit more discussion (see XXX) 

In the terraform schema, we do not just have to define a data structure, but also who should specify it and whether a value in mandatory. If the API is reasonably 'RESTful', modelling this can also be a fairly mechanical process of applying simple rules:

- Required attributes for PUT/POST should be the `Required` fields on the terraform resource
- Do similarly for `Optional` fields. Sometimes an API has additional methods to further configure an already created resource, but these should also be here. Terraform should flatten the configuration process into a single Create action
- An attribute returned in the result of any create/update/read call which is `Optional` or read-only is marked as `Computed`. Normally, all values would be present but there are some values like passwords and private keys that only get returned once on creation or update
- Any attribute that can be specified on 'Create' but is not accepted by an 'Update' call (either PUT/PATCH/etc) should be marked with `ForceNew`
- If any optional value has a simple default value I prefer to specify this value as `Default`. This means a terraform user will be able to see the value that will be given as part of their plan. If the default is unknown or indeterminate, then fall back to specifying 'Computed'. In some cases, it is not clear which is more appropriate (or the use of `DefaultFunc`). These we will come back to later. 
 

To what extent should be terraform resource definition match my api resources?
To what extent should terraform do validation of my resources?

## Simple Values

- Simple values can be difficult to tell the difference between empty and unset but terraform does make a distinction.
- Dealing with optional values
Which type coercions to check? 
When do I need to check if attributes are present?

## Set Values and Nested Resources

- Dealing with one-to-one and one-to-many relations

# On the unreasonable efficiency of terraform acceptance tests

How the tests work:
- config
- import

If you are setting required fields, its rarely worth checking the attribute in the state
If you are computing items, it may be worth checking in the state that they are computed as expected. If you don't care what they get computed as, it doesn't matter.
It is worth checking that the resource is actually created in the API
It might be worth checking on nested or optional objects if the attribute is set correctly at the API. Probably not worthwhile for all attributes.


# Addendum

# Limitations of HCL and Terraform Config Language

# Lifecycle

# Managing Resource IDs

# Create or Import



