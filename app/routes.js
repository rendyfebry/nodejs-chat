var Message     = require('./models/message');

module.exports = function(app, passport) {
	app.get('/login', function(req, res) {
		res.render('login.ejs', { message: req.flash('loginMsg') });
	});

	app.post('/login',
		passport.authenticate('local-login', {
			successRedirect : '/',
			failureRedirect : '/login',
			failureFlash    : true
		}));

	app.get('/register', function(req, res) {
		res.render('register.ejs', { message: req.flash('registerMsg') });
	});

	app.post('/register', passport.authenticate('local-signup', {
		successRedirect : '/',
		failureRedirect : '/register',
		failureFlash    : true
	}));

	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/login');
	});

	app.get('/', isLoggedIn, function(req, res){
		Message.find({}, function(err, messages) {
			console.log(messages);
			res.render('index.ejs', { user: req.user, messages: messages });
		});
	});
}

function isLoggedIn(req, res, next) {
	if(req.user) return next();

	res.redirect('/login');
}
