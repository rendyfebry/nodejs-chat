var mongoose  = require('mongoose');
var bcrypt    = require('bcrypt-nodejs');
var Schema    = mongoose.Schema;

var userSchema = mongoose.Schema({
	local: {
		email     : String,
		password  : String,
		name      : String
	}
});

// ======== Method

userSchema.methods.hashPassword = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

userSchema.methods.checkPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password);
}

module.exports = mongoose.model('User', userSchema);