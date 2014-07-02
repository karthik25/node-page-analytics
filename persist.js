var mongodb = require('mongodb');
var config = require('./config');

//Set up database stuff
var host = config.mongodb.server || 'localhost';
var port = config.mongodb.port || mongodb.Connection.DEFAULT_PORT;
var dbOptions = { };
var db = new mongodb.Db(config.mongodb.database, new mongodb.Server(host, port, dbOptions));

exports.addAnalytic = function(url, secs, callback){
	//Connect to mongodb database
	db.open(function(err, db) {
	  if (err) {
		throw err;
	  }

	  console.log('Database connected!');

	  var collection = db.collection('time_spent');

	  var doc = { 'url': url, 'secs': secs, 'date_time': (new Date()).toString() };

	  collection.insert(doc, function(){
		callback();
	  });
	});
};
