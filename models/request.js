var mongoose = require('mongoose');

module.exports = mongoose.model('Request', {
	id: String,
	url: String,
	secs: String,
	date_time: String,
	user_agent: String
});
