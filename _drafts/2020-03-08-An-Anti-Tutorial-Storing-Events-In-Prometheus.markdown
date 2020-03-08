---
layout: post
title: "An Anti-Tutorial: Storing Events in Prometheus"
categories: [technology]
image: ibelonghere.png
---

In this post, we're going to start _designing_ a system to query bank and card transaction using the Prometheus Time series Database (TSDB). This will be based on a small project I previously creted with SQL [github.com/benjvi/personal-finance-machine](github.com/benjvi/personal-finance-machine) to do some basic analysis on the state of my personal finances. The project does some basic labelling of transactions, and uses those labels to make some aggregations on incomings and outgoings over time.

I strongly believe that, in order to understand a technology, you have to understand what you _shouldn't_ do with it, as well as what you _can_. This understanding is particularly important when moving from a SQL database to a more specialized form of data storage, as is the case here.

While Prometheus is a TSDB, _this_ is not the use case that Prometheus was designed to solve. It is designed specifically to enable querying & alerting on _system metrics_. While it's possible for technologies to work well outside their original use-case, it will not be surprising that, along the way, we run into some prob lems, At what point do we decide that we chose the wrong tool for the job?

# Data Ingestion

Lets suppose we have one bank account and two separate credit cards. Prometheus has a pull-based ingestion model, so we would like to specifiy 3 endpoint in the _scrape config_ for it to connect to:

![scraping](/img/prometheus-scraping.png)

Prometheus would then scrape each API for data every 60 seconds (by default).

However, two problems immediately arise:
1. We need to authentication with any banking API to request data
1. Prometheus requires endpoints to expose data as metrics, with a specific format

Combined, these problems mean that we need a separate component to serve as an adapter.

# Daemon or Batch Job

The most seamless process for ingestion data would seem to be to write a daemon process that Prometheus connects to. Behind the scenes, this continually polls the banking APIs looking for new transactions.

![Adapter Daemon](img/adapter-daemon.png)

With our default Prometheus config, this means we will always be able to query for any transaction data more than 2 minutes old.

_However_, using a program to connect to a banking API - if one is even available - will be difficult. Moreover, such a highly automated process is not necessary for analysis of personal finances. It's perfectly adequate to manually export data and then run a batch job to load it into Prometheus. 

To get data from batch jobs, Prometheus requires us to use the PushGateway:

![Push Gateway](img/push-gateway.png)

# Data Model

Normally transaction exports come in a tabular format, with each entry something like this:

![Transaction Export Format](img/transaction-exports-format)

In Prometheus, data models are not tabular (relational), so we have to do some work to translate them. Let's take the fields one-by-one, starting from the left:

## Date / Time

This field cannot be used in Prometheus. Prometheus cannot be used to import historical time-series, instead it continually scrapes the current data on each node and associates it to the scrape time. The choice to exclude this functionality in Prometheus was made to optimize for metrics at the expense of generic time-series use-cases.

## TX Type | Category

Entries may come with a 'TX Type' which distinguish regular card transactions from cash withdrawals, and from Direct Debits, etc. Since there are a small number of possible values, this is a good fit for a label. Every combination of label values on a metric causes a separate time-series to be created in Prometheus, which is why it is recommended to select only a small number of labels. 

One complication here is that this field (/label) may not be present across all our data sources, while we would like to be able to query all our data using the same expressions. We can do this, at the cost of (TODO: link) [adding some complexity to our query] (Robust Perception Blog Post).

## Description

This field is rather different from the previous two. Most transactions have a different description. At a minimum, it tends to contain a vendor name, but this may contain all sorts of information: location, date, forex fees, etc. For this reasons its a field that's useful in more niche or ad-hoc queries, but is not really a good fit for a Prometheus label. This attribute is what people refer to as _high cardinality_. With a *relatively* small amount of data we will run into limits, due to the overhead of creating additional time series.

## Amount | Balance 

Now we get to the meat of the matter. Transactions, ultimately, are all about the amount. But this is where we really run into trouble. Prometheus primarily expects data to be expressable as a _counter_ or a _gauge_. A counter is an amount that always increases over time, like a count of HTTP requests received. A gauge is a single number representing the state of a system, which may increase or decrease over time. An example would be the amount of memory in use. 

Transactions, as a type of event data, do not fall into either category. Prometheus does give us some additional data types we can use to model this time of data: _histograms_ and _summary_ types. Both present a count of events, but uses an extra dimension to count data within buckets or quartiles, respectively. In our case, this would allow us to count the number of small transactions vs larger transactions. This may give interesting results, but its wasn't the type of query I was intending to do. To query against transaction categories, we would have to pre-compute the categories on each sources and scrape aggregations made on those categories. 

We do have one broad aggregation in our data already. The account balance is the sum of transactions, and is a great example of a gauge. Balance describes the state of your account or card balance, which rises and falls over time as transactions are made.

# Fin

And this is where I call it a day. We noticed already that there will be problems with the ingestion, getting the timestamps we desire, there will be problems doing keyword-search on our fields, and now we see that the event-centric nature of the data is not a fit for Prometheus. Even without looking at the queries, its dear that we didn't choose the right tool to solve this problem. At what point would you have decided this wasn't the right tool? What would you have used instead?
