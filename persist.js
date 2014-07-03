var mongodb = require('mongodb');
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

  console.log('Database connected!');
});

exports.addAnalytic = function(url, secs, callback){
	  var collection = db.collection('time_spent');

	  var doc = { 'url': url, 'secs': secs, 'date_time': (new Date()).toString() };

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
