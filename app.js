'use strict';

const createError = require('http-errors');
const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fs = require('fs');

const indexRouter = require('./routes/index');
const leadsRouter = require('./routes/leads');
const practicesRouter = require('./routes/practices');
const usersRouter = require('./routes/users');

const newLeadEvent = require('./middleware/emitter');
const {allocate} = require('./middleware/allocate');

//var {mongoose} = require('./db/mongoose');
//var {Todo} = require('./models/todo');
//var {User} = require('./models/user');
//var {authenticate} = require('./middleware/authenticate');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));
app.use(logger('dev'));

////==========================================================
//// Log Requests
////==========================================================
//app.use((req, res, next) => {
//  var now = new Date().toString();
//  var log = `${now}: ${req.method} ${req.url}`;
//
//  console.log(log);
//  fs.appendFile('server.log', log + '\n');
//  next();
//});

// ===============================
//  Routes
// ===============================
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
  console.log("===> lead info: ", lead);
  var x = allocate(lead);
});

// app.on('testEvent', function () {
//   return console.log('responded to testEvent');
// });

// app.get('/test', function (req, res) {
//   app.emit('testEvent');
//   return res.status(200).end();
// });

module.exports = app;
