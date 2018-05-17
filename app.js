const createError = require('http-errors');
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
//const config = require('./config/database');

//DATABASE
mongoose.connect('mongodb://localhost/myTime');
let db = mongoose.connection;

// Check connection
db.once('open', function () {
  console.log('Connected to MongoDB');
});

// Check for DB errors
db.on('error', function (err) {
  console.log(err);
});


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

//Bring in models
let Events = require('./models/events');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}));
// parse application/json
app.use(bodyParser.json());

app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    var namespace = param.split('.'),
      root = namespace.shift(),
      formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

// Passport Config
//require('./config/passport')(passport);
// Passport Middleware
//app.use(passport.initialize());
//app.use(passport.session());

// error handler
/*
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
*/
app.get('/start', function (req, res) {
  Events.find({}, function (err, events) {
    console.log(events);
    res.send(200, events);
  });
});

//Add submit post route
app.post('/events', function (req, res) {
  let event = new Events();
  event.id = req.body.id;
  event.title = req.body.title;
  event.description = req.body.description;
  event.hours = req.body.hours;
  event.start = req.body.start;
  event.end = req.body.end;

  event.save(function (err) {
    if (err) {
      console.log(err);
      return;
    } else {
      res.redirect('/');
    }
  });
});

app.delete('/deleteEvents/:id', function (req, res) {
  let query = {
    id: req.params.id
  }

  Events.remove(query, function (err) {
    if (err) {
      console.log(err);
    }
    res.send();
  });
});

app.get('/', function (req, res) {
  Events.find({}, function (err, events) {
    res.render('main');
  });
});


module.exports = app;

app.listen(8080, function () {
  console.log("we are listening on port 8080");
})