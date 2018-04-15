const express = require('express');
const app = express();
const helmet = require('helmet');
const dotenv = require('dotenv').config(); // https://www.npmjs.com/package/dotenv
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const path = require('path');
const check = require('check-types'); //https://www.npmjs.com/package/check-types#some-examples
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookie = require('cookie');
const bodyParser = require('body-parser');
const userAgent = require('user-agent'); // https://www.npmjs.com/package/user-agent
// A simple CLI tool for ensuring that a given script runs continuously (i.e. forever). https://www.npmjs.com/package/forever
const mongoose = require('mongoose');
const index = require('./routes/index');
const authentication = require('./routes/authentication');
const login = require('./routes/login');
const logout = require('./routes/logout');
const search = require('./routes/search');
const tempSearch = require('./routes/tempSearch');
const validate = require('./routes/validateSession');
const device = require('./javascripts/device');
const places = require('./routes/places');
const testing = require('./routes/test'); //testing purposes

// Init Models
//require('./models');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Image directory
app.use(express.static(__dirname + '/images'));
app.use(express.static(__dirname + '/images/profile_images'));

const sessionOptions = {
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true
}

app.use(helmet());
app.disable('etag');
app.set('trust proxy', true);

app.use(session(sessionOptions));

app.use('/', index);
app.use('/authentication', authentication);
app.use('/login', login);
app.use('/logout', logout);
app.use('/search', search);
app.use('/tempsearch', tempSearch);
app.use('/places', places);
app.use('/validate', validate);
app.use('/test', testing);

places.createClient(process.env.GOOGLE_MAPS_API).then(function(message){
  console.log(message)
}).catch(function(errorMessage){
  console.log(errorMessage)
})

mongoose.Promise = global.Promise

mongoose.connect(process.env.MONGODB_HOST_URI)

let db = mongoose.connection

db.on('error', function(){
  console.error.bind(console, 'connection error: ')

})

db.once('open', function(){

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found at all - ' + tempSearch);
    err.status = 404;
    next(err);
  });

  
  // error handler
  app.use(function(err, req, res, next) {

    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
  
  // Listening on port when user makes request
  app.listen(process.env.PORT, function(){

    console.log('Listening on port ' + process.env.PORT);
  
  })

})

/*
db.connect(db.MODE_PRODUCTION).then(function(){

  app.use(helmet());
  app.disable('etag');
  app.set('trust proxy', true);

  const pool = db.getPool();
  const sessionStore = new MySQLStore({}, pool);

  const sess = {
    secret: process.env.SECRET,
    name: process.env.SESSION_NAME,
    proxy:true,
    secure: true,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
  }

  app.use(session(sess))
  
  places.createClient(process.env.GOOGLE_MAPS_API).then(function(message){
    console.log(message)
  }).catch(function(errorMessage){
    console.log(errorMessage)
  })

  // validates session

  app.use(function (req, res, next) {
  //req.sessionOptions.maxAge = req.session.maxAge || req.sessionOptions.maxAge
  let experiationDate
  req.session.cookie.maxAge = 86400000;
  console.log(req.session);
  next()
})


app.use('/', index);
app.use('/authentication', authentication);
app.use('/login', login);
app.use('/logout', logout);
app.use('/search', search);
app.use('/tempsearch', tempSearch);
app.use('/places', places);
app.use('/validate', validate);
app.use('/test', testing);

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found at all - ' + tempSearch);
    err.status = 404;
    next(err);
  });

  
  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

  // Listening on port when user makes request
  app.listen(process.env.PORT, function(){
     console.log('Listening on port ' + process.env.PORT);
  });

  pool.on('connection', function (connection) {
    console.log('Connection %d ', connection.threadId);
  });

  pool.on('acquire', function (connection) {
    console.log('Connection %d acquired', connection.threadId);
  });

  pool.on('release', function (connection) {
    console.log('Connection %d released', connection.threadId);
  });

}).catch(function(err){


})
*/
module.exports = app;
