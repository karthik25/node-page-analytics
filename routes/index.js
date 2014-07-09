var db = require('../persist');
var config = require('../config');
var uaparser = require('ua-parser');
var _ = require('underscore');

/* GET home page. */
exports.index = function(req, res){
  res.render('index', { title: 'Express :: Index' });
};

exports.about = function(req, res){
  res.render('about', { title: 'Express :: About' });
};

exports.contact = function(req, res){
  res.render('contact', { title: 'Express :: Contact' });
};

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
		});
		res.render('usages', { title: 'Express :: Usage Stats',items: items });
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
	var reqUrl = req.query.cUrl;

	if (reqUrl == null)
	{
		reqUrl = '/about';
	}

	console.log("Get chart data for: " + reqUrl);
	db.getAnalytics(function(items){
		var urlItems = _.filter(items, function(item){ return item.url === reqUrl });

		_.each(urlItems, function(item) { item.simple_user_agent = uaparser.parse(item.user_agent).ua.toString(); item.simple_date = getDateStr(item.date_time); });
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

		res.json(data);
	});
};

exports.getrequestct = function(req, res){
	res.json({ total: 345 });
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
