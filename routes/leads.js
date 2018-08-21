const _ = require('lodash');
const express = require('express');
const router = express.Router();

const {mongoose} = require('../db/mongoose');
const {Lead} = require('../models/lead');
const {User} = require('../models/user');
const {authenticate} = require('../middleware/authenticate');
const {leadBody} = require('../utils/leadBody');
const {sendSMS} = require('../utils/SMS');

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// app.get('/leads', authenticate, (req, res) => {
router.get('/list', (req, res) => {
  Lead.find(
    { //_creator: req.user._id
    },
    {"status" : 1,
    "firstName" : 1,
    "surname" : 1,
    "langPref" : 1,
    "contactNum" : 1,
    "altNumber" : 1,
    "cellNumber" : 1,
    "eMail" : 1,
    "contactLocation.postal" : 1,
    "contactLocation.suburb" : 1,
    "service" : 1,
    "comments.comment1" : 1,
    "comments.comment2" : 1
  }).then((leads) => {
    res.send(leads);
  }, (e) => {
    res.status(400).send(e);
  });
});
//----------------------------------------
//	Add Lead
//----------------------------------------
router.post('/add', async (req, res) => {
  try {
    var leadData = req.body.lead;
    // LeadData is an object because Express.js 4
    // converts the request string automatically
    console.log("===> add Lead path found: ", leadData);
    var body = leadBody(leadData);
    body.createdAt = new Date().getTime();
    console.log("===> Lead body: ", body);
    const lead = new Lead(body);
    await lead.save();
    var message = "Lead allocated to practise";
    sendSMS(message);
    res.status(200).send("ok");
  }
  catch (e) {
    console.log("===> ERROR: ", e.errors);
    var errData = JSON.stringify(e);
    res.status(400).send(errData);
  }
});
//----------------------------------------
//	Allocate Lead to Adviser
//----------------------------------------
router.post('/allocateAdviser', (req, res) => {
    console.log("===> Message: ", req.body);
  try {

    // allocate();

    var message = req.body;
    console.log("===> Message: ", message.message);
    sendSMS(message.message);
    res.status(200).send("ok");
  }
  catch (e) {
    console.log("===> ERROR: ", e.errors);
    var errData = JSON.stringify(e);
    res.status(400).send(errData);
  }
});

//----------------------------------------
//	Update Lead
//----------------------------------------
router.post('/Update', async (req, res) => {
  try {
    const body = _.pick(req.body, [
      'firstname',
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

module.exports = router;
