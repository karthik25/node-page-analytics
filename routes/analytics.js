var db = require('../persist');
var config = require('../config');
var uaparser = require('ua-parser');
var chalk = require('chalk');
var _ = require('underscore');

exports.record = function(req, res){
  var seconds = req.body.seconds;
  var url = req.body.url;
  var agent = req.headers['user-agent'];
  var ua = uaparser.parse(agent);
  console.log('Url: ' + url + '; duration = ' + seconds + '; Agent = ' + agent + '; Parsed agent = ' + ua);
  
  var excluded = false;
  config.analytics.excludes.forEach(function(item){
	if (item === url && !excluded)
	{
		excluded = true;
	}
  });

  if (excluded)
  {
	console.log('url is excluded');
	res.json({ result: false });
	res.end();
	return;
  }
  
  db.addAnalytic(url, seconds, agent, function(){
	console.log('callback called');
	res.json({ result: true });
  });  
};

exports.usages = function(req, res){
	db.getAnalytics(function(items){
		items.forEach(function(item){
			item.description = getTimeSpent(item.secs);
			item.simple_date = getDateStr(item.date_time);
		});
		res.render('pageAnalytics/usages', { title: 'Express :: Usage Stats',items: items });
	});
};

/*
 * Return format

 		var data = {
			xAxis: ['07/01/2014', '07/02/2014'],
			yAxis: [ { name: 'Chrome/32.0', data: [ 12.0 ] }, { name: 'Chrome/31.0', data: [ 32.0 ] } ]
		};

 *
 */
exports.getavgtime = function(req, res){
	var reqUrl = req.body.url;

	console.log(chalk.magenta("Request for avg time chart data ", chalk.underline(reqUrl)));

	if (reqUrl == null)
	{
		reqUrl = '/';
	}

	console.log("Get chart data for: " + reqUrl);
	db.getAnalytics(function(items){
		var urlItems = _.filter(items, function(item){ return item.url === reqUrl });

		_.each(urlItems, function(item) { 
			item.simple_user_agent = uaparser.parse(item.user_agent).ua.toString(); 
			item.simple_date = getDateStr(item.date_time); 
		});
		var groups = _.groupBy(urlItems, 'simple_date');

		var data = {
			xAxis: [],
			yAxis: [ { name: reqUrl, data: [] } ]
		};

		_.each(groups, function(group){
			data.xAxis.push(_.first(group).simple_date);
			var total = _.reduce(group, function(memo, item){ return memo + parseInt(item.secs); }, 0);
		    var avg = Math.round(total / group.length);
			data.yAxis[0].data.push(avg);
		});
	
		var dataLength = data.xAxis.length;
		if (dataLength > 10)
		{
			var start = 0;
			var end = dataLength-10;

			data.xAxis.splice(start, end);
			data.yAxis[0].data.splice(start, end);
		}

		res.json(data);
	});
};

exports.getrequestct = function(req, res){
	db.getAnalytics(function(items){
		var groupedWitCt = getItems(items, 5);
		var total = _.reduce(groupedWitCt, function(memo, num){ return memo + parseInt(num.count); }, 0);
		var pdata = [];
		_.each(groupedWitCt, function(item){
			var entry = [];
			entry.push(item.page);
			entry.push(Math.round((item.count / total) * 100));
			pdata.push(entry);
		});
		res.json({ total: total, pages: groupedWitCt, piedata: pdata });
	});
};

exports.getrequests = function(req, res) {
	var reqUrl = req.body.url;

	db.getAnalytics(function(items){
		items.forEach(function(item){
			item.simple_date = getDateStr(item.date_time);
		});

		var itemsForUrl = _.filter(items, function(entry) {
			return entry.url === reqUrl;
		});

		var groups = _.groupBy(itemsForUrl, 'simple_date');

		var data = {
			xAxis: [],
			yAxis: []
		};

		_.each(groups, function(gp){
			data.xAxis.push(_.first(gp).simple_date);
			data.yAxis.push(gp.length);
		});

		var dataLength = data.xAxis.length;
		if (dataLength > 10)
		{
			var start = 0;
			var end = dataLength-10;

			data.xAxis.splice(start, end);
			data.yAxis.splice(start, end);
		}

		res.json(data);
	});
};

exports.getbrowsershares = function(req, res){
	db.getAnalytics(function(items){
		_.each(items, function(item) { 
			item.simple_user_agent = uaparser.parse(item.user_agent).ua.toString(); 
		});
		var groups = _.groupBy(items, 'simple_user_agent');

		var data = [];

		_.each(groups, function(gp){
			var entry = [];
			entry.push(_.first(gp).simple_user_agent);
			entry.push(Math.round((gp.length / items.length) * 100));

			data.push(entry);
		});

		res.json(data);
	});
};

exports.removeAll = function(req, res){
	db.removeAll(function(){
		res.json({ result: true });
	});
};

function getTimeSpent(sec) {
    if (sec < 60) {
        return sec + " seconds";
    }

    var mins = Math.floor(sec / 60);
    var secs = sec % 60;
    return mins + " minutes " + secs + " seconds";
}

function getDateStr(fullDate){
	var d = new Date(fullDate);
	var curr_date = d.getDate();
	var curr_month = d.getMonth() + 1; //Months are zero based
	var curr_year = d.getFullYear();
	return curr_month + '/' + curr_date + '/' + curr_year;
}

function getItems(entries, count){
    var allPages = [];
    var ugps = _.countBy(entries, 'url');
    for (property in ugps) {
        allPages.push({ page: property, count: ugps[property]});
    }
    
    var sgps = _.sortBy(allPages, function(item){
       return item.count * -1;   
    });

    var ct = sgps.length <= count ? sgps.length : sgps.length - count;    
    var rPages = _.initial(sgps, ct);   
    return rPages;
}
