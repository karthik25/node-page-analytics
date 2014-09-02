var Request = require('./models/request');

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
		if (err) console.log(err);
		console.log('Fetching the analytics... done');
		callback(requests);
	});
};

exports.removeAll = function(callback){

};

exports.exportCollection = function(callback) {

};
