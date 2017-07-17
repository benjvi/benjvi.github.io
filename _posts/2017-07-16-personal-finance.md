---
layout: post
title: "Managing personal finances like a developer with SQL"
categories: [technology]
image: ibelonghere.png
---


There are quite a few services around that purport to help you manage your personal finances. They require access to your bank credentials and scrape information. Then, transactions can get automatically categorised and visualised so you can see trends in your spending.

There are two problems with this:
 - Exposing bank information to third parties is an uncomfortable experience at best and giving access to them tends to be in violation of the bank's ToS (in the UK at least)
 - In practical terms, many services are unreliable because of their unsanctioned status
 - In many cases categorisation is not particularly good or suited to personal needs (for sufficient flexibility it would be good to have a Query Language)
 
 <!--more-->

Since my bank exposes up to a years worth of transaction data as csv, I realised that SQL could most likely do everything I needed! Theres no fancy auto-categorisation, but since the majority of my expenses are fairly predictable this isnt a problem. 

The first step is to setup the database and categories (I am using sqlite for simplicity). So:

Create a table in a database to match the format of the csv. This is likely to be different between banks. In my case I will also have to reformat the date string values before import so they can be recognised as a date for SQL queries:

`python format-date.py transactions.csv`

Start the shell: 

`sqlite3 -init transactions.db`

`create table transactions (date string, type string, description string, amount integer, balance integer, name string, account string);`

Import the data:

`.separator ","`

`import formatted-transactions.csv transactions`

### Basic Metrics 

Now we have all the data in a structured format, we have to decide what to do with it. Mostly I'm interesting in looking at spending by specific categories, but there is one overall aggregation I'm interested in:

#### How much did I save last month and how does that compare to previous months?

`select date(date, 'start of month'),SUM(amount) from transactions GROUP BY date(date, 'start of month');`

#### What was my average/min/max balance in the previous month?

I should probably also make sure I have enough liquidity, so here we are:

`select avg(balance),min(balance),max(balance) from transactions where date > date('now', 'start of month', '-2 month') and date < date('now', 'start of month', '-1 month');` 

Note - I use start of month so I can get consistent results for this query. It does mean that the result for the current month is not complete/comparable. Since I don't like to spend a lot of time dealing with finances this isn't too much a problem - just means I should start to check the results around the start of every month.

### Categories

To get interesting results beyond this, we have to break down the transactions by category. Different categories will be appropriate for different people, but in my case this would look something like ( coffee / breakfast / lunch / tfl / groceries / amazon / going out / travel ).

Fortunately, most of these things are somewhat easy to categorise. First, lets add an additional column for categories (it becomes unwieldy to identify categories with extended WHERE clauses every time):

`alter table transactions add column category string;`

Now lets categorise our transactions:

`UPDATE transactions SET category='coffee' WHERE ( amount >-4 AND ( description LIKE "%GAIL%" OR description LIKE "%CARAVAN%" OR description LIKE "%COFFEE%" OR description LIKE "%NERO%" ));`

`UPDATE transactions SET category='breakfast' WHERE ( amount <=-4 AND ( description LIKE "%GAIL%" OR description LIKE "%CARAVAN%" OR description LIKE "%COFFEE%" OR description LIKE "%NERO%" ));`

I look for transaction descriptions that match various coffeeshops I go to. Since I frequently purchase breakfast in the same places I break this out for breakfast and coffee-only. Frustratingly there is no time in the transaction information but this suits my purposes well enough.

For other categories the categorization is less easy. Going out and travel, where transactions are particularly heterogeneous, are especially tricky. A nice trick I've used is adding generic catchalls at the enf of the categorization process which only apply to uncategorized transactions - e.g. those containing descriptions like *bar*, *pub*, etc, will all get categorized under "going out". But in some cases, we still need rules targeting individual transactions. 

### Understanding With Queries

Firstly I want to get some understanding of how recent spending breaks down: 

#### Amount spent per ( week | month ) by category 

Last Week:

`SELECT category,SUM(amount) FROM transactions where date >= date('now', 'weekday 0', '-14 days') and date < date('now', 'weekday 0', '-7 days') GROUP BY category;`

Last Month:

`SELECT category,SUM(amount) FROM transactions where date >= date('now', 'start of month', '-2 month') and date < date('now', 'start of month', '-1 month') GROUP BY category;`

#### Proportion of total spend in the last ( week | month ) by category

Last Week:

`SELECT category,100*SUM(amount)/(SELECT SUM(amount) FROM transactions WHERE amount<0 AND date >= date('now', 'weekday 0', '-14 days') and date < date('now', 'weekday 0', '-7 days')) FROM transactions where date >= date('now', 'weekday 0', '-14 days') and date < date('now', 'weekday 0', '-7 days') GROUP BY category;`

Last Month:

`SELECT category,100*SUM(amount)/(SELECT SUM(amount) FROM transactions WHERE amount<0 AND date > date('now', 'start of month', '-2 month') and date < date('now', 'start of month', '-1 month')) FROM transactions where date > date('now', 'start of month', '-2 month') and date < date('now', 'start of month', '-1 month') GROUP BY category;`

Exclude deposits here so we can normalise the sum in each category based on the sum of all outgoings in the period.

#### ( Absolute | Proportional ) Difference of last month compared to average of the last year by category

In this case, we will need to create a table with totals by categories to perform the necessary query:

`create table totals (category string, total number);`

`INSERT INTO totals SELECT category,SUM(amount) FROM transactions GROUP BY category;`

Now we can perform the queries by regular inner join on category:

Absolute difference:

`SELECT transactions.category,(total/12 - SUM(amount)) FROM transactions JOIN totals on totals.category = transactions.category where date >= date('now', 'start of month', '-2 month') and date < date('now', 'start of month', '-1 month') GROUP BY transactions.category;`
N.B. Larger spend this month is positive, and smaller is negative. This would be reversed for deposits.

By ratio:

`SELECT transactions.category,(SUM(amount)/(total/12)) FROM transactions JOIN totals on totals.category = transactions.category where date >= date('now', 'start of month', '-2 month') and date < date('now', 'start of month', '-1 month') GROUP BY transactions.category;`

#### Travel is quite different so we may also look at the aggregate figures for the last 2/3 months

Essentially the same query with larger time ranges, just with WHERE instead of GROUP BY (admittedly, using GROUP BY could also be interesting here). Also, have to remember to change the total divisor!

`SELECT (total/6 - SUM(amount)) FROM transactions JOIN totals on totals.category = transactions.category where date >= date('now', 'start of month', '-3 month') and date < date('now', 'start of month', '-1 month') and transactions.category='travel';`

`SELECT (total/4 - SUM(amount)) FROM transactions JOIN totals on totals.category = transactions.category where date >= date('now', 'start of month', '-4 month') and date < date('now', 'start of month', '-1 month') and transactions.category='travel';`

`SELECT (SUM(amount)/(total/6)) FROM transactions JOIN totals on totals.category = transactions.category where date >= date('now', 'start of month', '-3 month') and date < date('now', 'start of month', '-1 month') and transactions.category='travel';`

`SELECT (SUM(amount)/(total/4)) FROM transactions JOIN totals on totals.category = transactions.category where date >= date('now', 'start of month', '-4 month') and date < date('now', 'start of month', '-1 month') and transactions.category='travel';`

### Deciding on Metrics

The results of these queries give some understanding of finances, but are not actionable by themselves. Based partially on this understanding, we can decide which of this spending needs managing and which doesn't. In my case, I want to reduce my TFL spend by cycling more, since I prefer food when I cook I want to limit what I spend in the breakfast and lunch categories. Since I'm getting better at steaming milk, I may also want to (slightly) reduce the frequency with which I buy coffee. 

#### Number of times & Average spend when I bought ( coffee | breakfast | lunch | tube fare ) in the last few weeks

`SELECT date(date, 'weekday 0'),COUNT(*),AVG(amount) FROM transactions WHERE category='coffee' GROUP BY date(date, 'weekday 0') ORDER BY date(date, 'weekday 0') DESC LIMIT 5;`

`SELECT date(date, 'weekday 0'),COUNT(*),AVG(amount) FROM transactions WHERE category='breakfast' GROUP BY date(date, 'weekday 0') ORDER BY date(date, 'weekday 0') DESC LIMIT 5;`

`SELECT date(date, 'weekday 0'),COUNT(*),AVG(amount) FROM transactions WHERE category='lunch' GROUP BY date(date, 'weekday 0') ORDER BY date(date, 'weekday 0') DESC LIMIT 5;`

`SELECT date(date, 'weekday 0'),COUNT(*),AVG(amount) FROM transactions WHERE category='tfl' GROUP BY date(date, 'weekday 0') ORDER BY date(date, 'weekday 0') DESC LIMIT 5;`

 Quite a lot of info in these queries - but looking at them I just want to see a downwards trend primarily in count, but perhaps also in amount. For TFL, multiple journeys within a single day is charged as a single transaction, so in this case the amount also tells me how often I'm using the service.

## Making It Better

I'm pretty happy with the results that I can get out of this. The main problem, as it always seems to be, is accurately labelling the data. It seems like the use of machine learning could be of some use to detect features in the descriptions that correlate with categories, but I expect even this would be very error prone. For services like Monzo and Mint which automatically categorise transactions into standard categories, they can build a better model based on the labelling work done by all their users. Because I'm using an idiosyncratic categorization system, I can't benefit from this. Instead, I am hoping more that I can somehow get time data associated with my transactions which could be used to make more accurate heuristics.

Also, I don't actually mind too much to eyeball sets of numeric values, but it does make things more intuitive to have some nice charts. A tool like sqlchart might be worth investigating.

P.S. I have added the code for this on github here in case someone finds it useful :) (unfortunately I can't add all the categorizing because the rules are pretty personal)
