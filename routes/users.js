const _ = require('lodash');
const express = require('express');
const router = express.Router();

const {mongoose} = require('../db/mongoose');
const {Lead} = require('../models/lead');
const {User} = require('../models/user');
const {authenticate} = require('../middleware/authenticate');

/* GET users listing. */

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// module.exports = router;

//----------------------------------------
//	Add User
//----------------------------------------
router.post('/add', async (req, res) => {
  console.log(">>> Router - Add User request received: ", req.url, req.body);
  try {
    const body = _.pick(req.body, [
      'firstName',
      'surname',
	    'phone',
	    'cell',
      'email',
	    'roleCode',
	    'practiceCode',
	    'services',
      'password'
    ]);
    console.log(">>> body _.picked: ", body);
    const user = new User(body);
    await user.save();
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  }
  catch (e) {
    res.status(400).send(e);
  }
});

// router.post('/add', async (req, res) => {
//   try {
//     var leadData = req.body.lead;
//     // LeadData is an object because Express.js 4
//     // converts the request string automatically
//     console.log("===> add Lead path found: ", leadData);
//     var body = leadBody(leadData);
//     body.createdAt = new Date().getTime();
//     console.log("===> Lead body: ", body);
//     const lead = new Lead(body);
//     await lead.save();
//     var message = "Lead allocated to practise";
//     sendSMS(message);
//     res.status(200).send("ok");
//   }
//   catch (e) {
//     console.log("===> ERROR: ", e.errors);
//     var errData = JSON.stringify(e);
//     res.status(400).send(errData);
//   }
// });




//----------------------------------------
//	Authenticate a user
//----------------------------------------
router.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});
// ----------------------------------------
//  Get all users
// ----------------------------------------
router.get('/list', (req, res) => {
  User.find(
    { //_creator: req.user._id
    },
    {
      password : 0,
      tokens : 0
    // status : 1,
    // firstName : 1,
    // surname : 1,
    // phone : 1,
    // cell : 1,
    // roleCode : 1,
    // practiceCode : 1,
    // eMail : 1
    }
  ).then((users) => {
    res.send(users);
  }, (e) => {
    res.status(400).send(e);
  });
});

//----------------------------------------
//	Delete User?
//----------------------------------------
router.delete('/users/me/token', authenticate, async (req, res) => {
  try {
    await req.user.removeToken(req.token);
    res.status(200).send();
  }
  catch (e) {
    res.status(400).send();
  }
});
//----------------------------------------
//	User Login
//----------------------------------------
router.post('/login', async (req, res) => {
	console.log(">>> Router - login request received: ", req.body, req.url);
  try {
    const body = _.pick(req.body, ['email', 'password']);
    console.log(">>> Body: ", body);
    const user = await User.findByCredentials(body.email, body.password);
    console.log("===> User: ", user);
    const token = await user.generateAuthToken();
    console.log("===> token: ", token);
    //res.header('x-auth', token).send(user);
    res.header('x-auth', token).send(_.pick(user, ['_id', 'roleCode', 'practiceCode', 'email']));
  }
  catch (e) {
    res.status(400).send();
  }
});

module.exports = router;
