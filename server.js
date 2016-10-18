// ============= REQUIRE
var express     = require('express');
var app         = express();
var http        = require('http').Server(app);
var io          = require('socket.io')(http);

var mongoose    = require('mongoose');
var passport    = require('passport');
var flash       = require('connect-flash');
var cookieParser= require('cookie-parser');
var bodyParser  = require('body-parser');
var path        = require('path');

var User        = require('./app/models/user');
var Message     = require('./app/models/message');
var port        = 3000;

var expresssession = require('express-session');
var sessionMiddleware = expresssession({
	name   : "COOKIE_NAME",
	secret : "COOKIE_SECRET",
	store  : new (require("connect-mongo")(expresssession))({
		url: "mongodb://127.0.0.1/chatsession"
	})
});

// =============== DATABASE

mongoose.connect('mongodb://127.0.0.1/pixelchat');

// =============== Setup

app.use(bodyParser());
app.use(cookieParser());
app.use(flash());
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
require('./app/passport.js')(passport);
require('./app/routes.js')(app, passport);


// =============== IO

io.use(function(socket, next) {
	sessionMiddleware(socket.request, {}, next);
});
io.on('connection', function(socket) {
	console.log(' a user connected');

	socket.on('disconnect', function() {
		console.log('user disconnected');
	});

	socket.on('newMessage', function(message) {
		var userId = socket.request.session.passport.user;

		User.findById(userId, function(err, user) {
			var userName = user.local.name;
			var userEmail = user.local.email;

			var data = {
				id: userId,
				username: user.local.name,
				message: message
			};

			var newMessage = new Message();
			newMessage.user_id  = data.id;
			newMessage.message  = data.message;
			newMessage.username = data.username;

			newMessage.save(function(err){
				if(err) throw err;
			});

			io.emit('newMessage', data);
		});

	});
});


// =============== RUN

http.listen(port, function() {
	console.log('Listening on : '+port);
});