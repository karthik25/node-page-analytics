var db = require('../persist');
var config = require('../config');

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
  console.log('Url: ' + url + '; duration = ' + seconds);
  
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
  
  db.addAnalytic(url, seconds, function(){
	console.log('callback called');
	res.json({ result: true });
  });  
};

exports.usages = function(req, res){
	db.getAnalytics(function(items){
		res.render('usages', { items: items });
	});
};
