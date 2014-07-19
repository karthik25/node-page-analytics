var mongodb = require('mongodb');
var chalk = require('chalk');
var config = require('./config');

//Set up database stuff
var host = config.mongodb.server || 'localhost';
var port = config.mongodb.port || mongodb.Connection.DEFAULT_PORT;
var dbOptions = { auto_reconnect: true };
var db = new mongodb.Db(config.mongodb.database, new mongodb.Server(host, port, dbOptions));
db.open(function(err, db) {
  if (err) {
	console.log('Error!!!');
	throw err;
  }

  console.log(chalk.green('Database connected!'));
});

exports.addAnalytic = function(url, secs, agent, callback){
	  var collection = db.collection('time_spent');

	  var doc = { 'url': url, 'secs': secs, 'date_time': (new Date()).toString(), 'user_agent': agent };

	  console.log('Retrieved the collection');

	  collection.insert(doc, function(){
		console.log('Inserted in to the collection');
		callback();
	  });
};

exports.getAnalytics = function(callback){
	var collection = db.collection('time_spent');

	collection.find().toArray(function(err, items){
		callback(items);
	});
};

exports.removeAll = function(callback){
	var collection = db.collection('time_spent');

	collection.remove({}, function(){
		callback();
	});
};
