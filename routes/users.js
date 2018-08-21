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
  try {
    const body = _.pick(req.body, [
      'firstName',
      'surname',
	    'phone',
	    'cell',
	    'roleCode',
	    'practiseCode',
	    'email',
      'password'
    ]);
    const user = new User(body);
    await user.save();
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  }
  catch (e) {
    res.status(400).send(e);
  }
});
//----------------------------------------
//	Authenticate a user
//----------------------------------------
router.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
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
    res.header('x-auth', token).send(user);
  }
  catch (e) {
    res.status(400).send();
  }
});
//----------------------------------------
//	Delete User
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

module.exports = router;
