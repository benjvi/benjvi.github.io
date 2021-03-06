---
layout: post
title: HTTP - Essential Knowledge for Developers
categories: [technology] 
---

### Request and Response

The HTTP paradigm conceives of two actors: a client and a server. The client sends a request to the server, of a particular type, and with certain parameters. In reply the server returns a response message. The response message includes a status code in the header - giving information about the requested information, and will also include a body which is the content at the requested URI. Lets look at the process in more detail.

<!--more-->

### Before The Request: finding the server to connect to (DNS)

The user goes to his browser and enters something like: "<a href="http://en.wikipedia.org/HTTP">en.wikipedia.org/HTTP</a>". The first step is that the website name needs to be translated into a specific IP address we can address. This process is <em>DNS resolution</em>. It is not necessary to go into all the details here but we do need to know one or two things: 
<ol>
	<li>The first time we connect to a website the URL is forwarded first to a DNS server (a recursive name caching server) which would typically be hosted by the ISP. This nameserver forwards the request to the root nameserver, which contains information about the Top Level Domains' nameservers. which then forwards it on the the nameserver responsible for the sub-domain which is given in the website address. This then returns the IP address to the client.</li>
	<li>DNS zones are the areas that are managed - a zone is a continguous area of the namespace that has a nameserver responsible for it. Technically, a zone is comprised of DNS resource entries . There are different types of entries in each zone:
		<ul>
			<li>SOA - the start of authority which holds key zone parameters</li>
			<li>A - the IPv4 address of a host</li>
			<li>AAAA - the IPv6 address of a host</li>
			<li>CNAME - the canonical name of an alias</li>
			<li>MX - mail exchanger for the domain</li>
			<li>NS - the name server for the domain or delegated subdomain</li>
		</ul>
        </li>
	<li>Local nameserver - the client needs to know which server to connects to in order to access the DNS resolution service (although it may be self-hosted, it rarely is). This piece of information is typically configured by DHCP</li>
</ol>

### Setting up the connection

Before any requests or responses can be made, a TCP connection needs to be set up. TCP is the lower level on the network stack - which handles data transfer across the networks by splitting the data up into packets and ameliorating problems such as packet loss or duplication.

### Making the request

Now we have the connection to the target server via TCP. So, we can send our first HTTP request. This request takes the format:

<pre><code>GET /index.html HTTP/1.1
Host: www.mit.edu
User-Agent: HTTPTool/1.0
</code></pre>

There are some important parameters in here. First up is the request method - here it is the GET method, but on other common occasions we will need to use POST. There are more methods, but their use is a little bit rarer (and not supported by HTML standards!). Next, we specify the resource path (note we don't need to specify the full URL as we already have a TCP/IP connection set up to the remote server. Lastly on the first line, we must specify the version of the protocol used. 

Here, we also send the name of the host to connect to. This can be useful in situations where multiple hosts are sharing the same IP address. We also send the user-agent, which is used to identify the requestor (eg type of browser) so that the server can send the appropriate type of resource back.

### First Response

In return, the server will send an HTTP response. This contains the status - whether the content was found or not, or whether it moved, etc. As well, the response will contain the content we requested (if it is indeed there!). This content will usually be the html form containing the main body of the page. A typical HTTP response looks like this:
<pre><code>
HTTP/1.0 200 OK
Date: Fri, 31 Dec 1999 23:59:59 GMT
Content-Type: text/html
Content-Length: 1354

&lt;html&gt;
&lt;body&gt;
&lt;h1&gt;Web Page Title!&lt;/h1&gt;
(more file contents)
  .
  .
  .
&lt;/body&gt;
&lt;/html&gt;
</code></pre>

Based on this, we need to perform additional GET requests to retrieve the additional resources referenced on the page such as images, javascript, css, and so on. 

However, what exactly will be done depends on the HTTP code that is returned. This can be broken down in broad terms:
<ul>
	<li>2XX - Success!</li>
	<li>3XX - Redirection</li>
	<li>4XX - Error on the client side</li>
	<li>5XX - Error on the server side</li>
</ul>
More specifically, we are likely to see and/or use these codes - which are a very small subset of the complete set:
<ul>
<li>200 - Success with resources returned</li>
<li>201 - Resource successfully added (after POSTing a resource)</li>
<li>301 - Permanent  redirect (note for SEO purposes its better to use this than temporary 302 code)</li>
<li>304 - Page hasn't been updated (used for HTTP caching)</li>
<li>401 - Unauthorized. client did not provide the required authentication</li>
<li>404 - page not found (but client will be allowed to request again)</li>
<li>500 - Internal Server Error (generic error code)</li>
<li>503 - Site Unavailable (used to indicate downtime, and the site will be back soon)</li>
 </ul>

<h3>Performance considerations for secondary HTTP request/responses</h3>

There are two main ways we achieve this - by persistance, and by pipelining (parallelism). Persistence is simple, the tcp connection we used is not closed after the first request/response cycle, we keep it open and reuse it for the additional request/responses. This way we save the network round trips that are necessary to set up the connection. Pipelining means that when we have a number of resources we want to fetch, we can send the GET requests in parallel - then the server can start to process them at the same time. Again, we reduce the amount of time we spend waiting for data to travel across the network.

<h3>Why developers need to know about HTTP</h3>

HTTP is the interface that users will use to access the application - it is this that defines the entry points into web application. It determines when data can be sent, in what types, and which methods are available for users. So we talk about three crucial constraints on the system:
<ul>
<li>The URL structure which allows users to reason about the structure of the application (the resources available) [actually this constraint really comes from the definition of URLs]</li>
<li>The range of methods by which the client may query the system, and how they may send parameters that carry state</li>
<li>Which values we can return in response to the client requests and how the client is likely to respond to each</li>
</ul>	

It is notable that many web applications have ignored some of those constraints - specifically many sites do not provide URLs for their resources. Their URLs are linked to actions instead to to individual resources or queries. It is also noticeable that these are the most irritating types of sites to use - as they don't make use of the common sets of affordances that users are used to (such as bookmarking, forward/back navigation, etc).

<h3>Representational State Transfer (REST)</h3>

The crucial point here is that the messages sent as part of the HTTP request or response should correspond to the current or intended state, respectively. This builds upon the notion - inherent in the URL - that each address uniquely identifies a particular resource. It is designed to the constraints  of client-server, cached, layered systems. It is designed to  transfer state in a number of controlled types - the data types that we saw in the HTTP requests earlier. These are the "representation" in REST, and the point of this is to maintain encapsulation of the working details of the objects that are held on the server. Also note that REST should be stateless - all the details necessary for a request should be included in the request so that each request is independent from preceding/subsequent requests. Each request should carry a complete representation of state.
