# Node Page Analytics

```text
Notice: This app is currently under development and so is not fully tested.
```

We all have seen/used/created a lot of applications/plugins etc etc. that tracks the number of requests for a web 
applications on a per page level. But this is just a different take on the same approach. Here, apart from keeping 
track of a request from a user, I also attempt to keep track of how much time was spent on every page using web 
workers, so as to be non-intrusive (sort of - for now there is a display in every page indicating the time spent).

As is evident from the project this app is based on Node.JS/ExpressJS. I am trying to make it as simple as possible
to extract the section that is responsible for page analytics and plug it in to your application! Once I figure out
more about Node.JS I may convert this in to plugin (if possible) or something else!

## Getting Started

* Clone (or download) the repository
* Download and install MongoDB, verify the settings in config.js
* Run `npm install`
* Start the server w/ `node app`
* Browse to http://localhost:3000 for the application & to http://localhost:3000/page-analytics/usages for page analytics

## What's Available?

Page analytcs itself is a single page app with number of tabs. In the first tab you get to see a line chart for the average 
time spent by users on the home page and also a pie chart depicting the top 5 pages by number of requests. Then there is a tab
that list all the requests so far a paged list along with a 3D bar chart for number of requests for a page, starting with the
home page as the default. Users can click on the table to switch pages or use the dropdown on top of the chart. Then the next 
tab is similar to the 2nd tab but is for average time spent. Finally, there is a settings tab where you will get to export all the
information (in dev) and also to clear all the information recorded so far

## Credits

* NodeJS
* ExpressJS
* Highcharts
* Datatables
* Bootstrap

You're all set! Dive in to the codebase and have fun!!
