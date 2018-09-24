//=============================================
require('../config/config');
//=============================================

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    // user: 'youremail@gmail.com',
    user: process.env.EMAIL_USR,
    pass: process.env.EMAIL_PWD
  }
});

module.exports = {transporter};

//
// Usage
//
/*
var mailOptions = {
  from: 'youremail@gmail.com',
  to: 'myfriend@yahoo.com',
	// to: 'myfriend@yahoo.com, myotherfriend@yahoo.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
	// html: '<h1>Welcome</h1><p>That was easy!</p>'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
}); 
*/