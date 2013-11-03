---
layout: post
title: "meterHUB went to open source!"
description: "meterHUB starts with completely new site and begins to open source all source code"
category: 
tags: []
---
{% include JB/setup %}
# Opensource and new site

Today I have two great occasions. First, after more than two years when meterHUB initial site was launched, I have released a new one which looks much better, is built on Bootstrap, built only on static files and served from Amazon S3. Wow a lot of changes!

Second, I have started to open source meterHUB source code to make able everyone to contribute.

So, what's new...

## A completely new site
Previously the meterHUB site was published using [Joomla!](http://www.joomla.org/) with MySQL (BTW, you can still access old site on [http://old.meterhub.com/](http://old.meterhub.com/)). I like Joomla
but whole meterHUB backend uses Java and I used Joomla only as a container, for my UI applications which in anyway are HTML+Javascript or in other words completely client side
applications. So, why to run additional instances of PHP+MySQL if in any way I don't use server side rendering? Here come idea of static files and I've started to use
[Jekyll](https://github.com/mojombo/jekyll) to generate my site. So, now every page which you see in this site is static and with help of [AngularJS](http://angularjs.org/) it became fast and interactive.

Also I have changed charts engine. Previously I have used [HighCharts](http://www.highcharts.com/), now I have moved to [d3](http://d3js.org/) engine as it is more customizable what I really like.

## Opensource

Another good news is I'm starting to open source meterHUB. Now you can access all site source code on [GitHub](https://github.com/gediminasgu/meterhub.com). Later, when
backend applications will be ready to be open sourced I'm going to open source it too! So, if you like meterHUB but would like to have new features or change something
please let me know, fork and contribute!