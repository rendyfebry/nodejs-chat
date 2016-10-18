var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;

var messageSchema = mongoose.Schema({
	user_id    : String,
	message    : String,
	username   : String,
	date       : { type: Date, default: Date.now }
});

// ======== Method

module.exports = mongoose.model('Message', messageSchema);