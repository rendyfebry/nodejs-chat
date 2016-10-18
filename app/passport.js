var LocalStrategy = require('passport-local').Strategy;
var User          = require('./models/user');

module.exports = function(passport) {
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

	// ======= Sign Up

	passport.use('local-signup', new LocalStrategy({
		usernameField      : 'email',
		passwordField      : 'password',
		passReqToCallback  : true
	}, function(req, email, password, done){
		process.nextTick(function(){
			User.findOne({ 'local.email' : email }, function(err, user){
				if(err) return done(err);

				if(user) {
					return done(null, false, req.flash('registerMsg', 'Email registered!'));
				} else {
					var newUser = new User();
					newUser.local.email = email;
					newUser.local.password = newUser.hashPassword(password);
					newUser.local.name = req.param('name');

					newUser.save(function(err){
						if(err) throw err;

						return done(null, newUser);
					});
				}
			});
		});
	}));

	// ============== Login

	passport.use('local-login', new LocalStrategy({
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true
	}, function(req, email, password, done) {
		User.findOne({ 'local.email' : email }, function(err, user) {
			if(err) return done(err);

			if(!user) {
				return done(null, false, req.flash('loginMsg', 'User Belum terdaftar'));
			}

			if(!user.checkPassword(password)) {
				return done(null, false, req.flash('loginMsg', 'Wrong password'));
			}
			
			return done(null, user);
		})
	}));
}