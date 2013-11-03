---
layout: post
title: "meterHUB vs Pachube"
description: "or why I have started to write meterHUB instead of using Pachube"
category: 
tags: [pachube, aggregations]
---
{% include JB/setup %}

## The beginning

In 2010 I have started my home automation project, and I was looking where to store my meter data. Of course I took a look into a Pachube (now is called [Cosm](http://cosm.com)). I have started to use it but as the one with data analyst background I found missing one simple thing (at least it looked simple) - aggregations.

If I collect my gas meter data, I'm not really interesting of what consumption was on 2011-02-17 23:55:00. Should I? In place of that I'm more interested of what was a usage per day. For one day that's fine, I can sum all day values ( 1 values per 5 minutes = 288 values per day ), but what if I want to see my last 21 day usage like in chart below?

![Daily chart](/assets/img/posts/daily_chart.png)

To make that chart I will need to sum 288 * 21 = 6048 points for temperature and another 6048 points for gas. That could be fine on the desktop, but on phone which I use more and more for my data monitoring it could be hassle to download so much data to clientside and count it. And what to do if I need even more data like in this chart?

![Scatter chart](/assets/img/posts/scatter_chart.png)

It presents daily usage of gas (Y axis) comparing with outside temperature during 2011 (orange), 2012 (green) and 2013(red). To count that chart I will need to sum 315360 points.

To be continued...