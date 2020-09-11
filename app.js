'use strict';
/*
"Start by doing what's necessary, then do what is possible;
and suddenly you are doing the impossible." - Francis of Assasi
*/
// ==================================
// = Lead Distribution & Management =
// =    By J.M.A. van Schalkwyk     =
// =       Copyright © 2018         =
// ==================================
//
// External Node Modules (npm)
//
const createError = require('http-errors');
const express = require('express');
const helmet = require('helmet');
const favicon = require('serve-favicon');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
//
// Internal Module Exports
//
const indexRouter = require('./routes/index');
// import indexRouter from "../routes/index"
const leadsRouter = require('./routes/leads');
const practicesRouter = require('./routes/practices');
const usersRouter = require('./routes/users');

const newLeadEvent = require('./middleware/emitter');
const {allocate} = require('./middleware/allocate');
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
const {myCache} = require('./middleware/cache');
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
const {mongoose} = require('./db/mongoose');
//var {User} = require('./models/user');
//var {authenticate} = require('./middleware/authenticate');

// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
//  Investigate node-cache - set
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
var obj = { my: "Special", variable: 42 };
myCache.set( "myKey", obj, function( err, success ){
  if( !err && success ){
    console.log( "Node Cache Success: ", success );
    // true
    // ... do something ...

  }
  else {
    console.log( "Node Cache Error" );
  }
});

// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
//  Investigate node-cache - get
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
myCache.get( "myKey", function( err, value ){
  if( !err ){
    if(value == undefined){
      // key not found
    }
    else{
      console.log( "APP - Cached data: ", value );
      //{ my: "Special", variable: 42 }
      // ... do something ...
    }
  }
});

const app = express();

// -----------------
// View Engine Setup
// -----------------
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// ----------------------------
// app.use sets up a middleware
// ----------------------------

// -------------------------------------------------
//  Basic middleware that is required for every app
// -------------------------------------------------

// Helmet header security
app.use(helmet());

// Data parsers - creates req.body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Path static content
app.use(express.static(path.join(__dirname, 'public')));

// ------------------
//  Other middleware
// ------------------
app.use(cookieParser());
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));
app.use(logger('dev'));

// --------
//  Routes
// --------
app.use('/', indexRouter);
app.use('/leads', leadsRouter);
app.use('/practices', practicesRouter);
app.use('/users', usersRouter);

//========================================
//  catch 404 and forward to error handler
//========================================
app.use(function(req, res, next) {
  console.log(">>> Error - No route found: ", req.body, req.url);
  next(createError(404));
});

// ========================================
//  error handler
// ========================================
app.use(function(err, req, res, next) {
  //-------------------------------------------------
  //  set locals, only providing error in development
  //-------------------------------------------------
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  //-----------------------
  //  render the error page
  //-----------------------
  res.status(err.status || 500);
  res.render('error');
});

// ======================================================
//  When a new lead is created allocate it to a practice
// ======================================================
newLeadEvent.on('newLead', function (lead) {
  console.log("===> New Lead Event Emitted - lead info: ", lead);
  var x = allocate(lead);
});

app.on('listening', function () {
  // server ready to accept connections here
  console.log("===> Ready to start loading practice service list");
});

module.exports = app;
