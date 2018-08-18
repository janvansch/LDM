'use strict';

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fs = require('fs');

const indexRouter = require('./routes/index');
const leadsRouter = require('./routes/leads');
const usersRouter = require('./routes/users');

//var {mongoose} = require('./db/mongoose');
//var {Todo} = require('./models/todo');
//var {User} = require('./models/user');
//var {authenticate} = require('./middleware/authenticate');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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

//===============================
//  Routes
//===============================
app.use('/', indexRouter);
app.use('/leads', leadsRouter);
app.use('/users', usersRouter);

//========================================
//  catch 404 and forward to error handler
//========================================
app.use(function(req, res, next) {
  console.log(">>> Error - No route found: ", req.body, req.url);
  next(createError(404));
});
//========================================
//  error handler
//========================================
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

module.exports = app;
