var Request = require('./models/request');
var bson = require('./bson');

exports.addAnalytic = function(url, secs, agent, callback){
	var request = new Request();

	request.url = url;
	request.secs = secs;
	request.date_time = (new Date()).toString();
	request.user_agent = agent;

	request.save(function(err){
		if (err)
		{
			console.log('Cannot save the request ' + err);
			throw err;
		}

		console.log('Inserting a request');
		callback();
	});
};

exports.getAnalytics = function(callback){
	console.log('Fetching the analytics');
	Request.find(function(err, requests){
		if (err){
			console.log(err);
			return;
		}
		console.log('Fetching the analytics... done');
		callback(requests);
	});
};

exports.removeAll = function(callback){
	Request.remove(function(err){
		if (err) 
		{
			console.log(err);
			return;
		}

		callback();
	});
};

exports.exportCollection = function(callback) {
	var aItems = [];
	Request.find(function(err, items){
	  for(var i in items) {
		var docStr = bson.toJsonString(items[i]);
		aItems.push(docStr);
      }

	  callback(aItems);
	});	
};
