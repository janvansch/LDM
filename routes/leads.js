"use strict";

const _ = require('lodash');
const express = require('express');
const router = express.Router();

// const {mongoose} = require('../db/mongoose');
const {Lead} = require('../models/lead');
const {LeadUpdate, LeadSearch, LinkAdviser} = require('../controllers/leadsCtrl');
//const {User} = require('../models/user');
//const {authenticate} = require('../middleware/authenticate');
//const {leadBody} = require('../utils/leadBody');
const {sendSMS} = require('../utils/SMS');

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// ----------------------
//	Add a new lead to DB
// ----------------------
router.post('/add', async (req, res) => {
  try {
    //
    // LeadData is an object because Express.js 4
    // converts the request string automatically
    //
    // Extract POST Data
    var body = req.body;
    body.currentStatus = body.status, // workaround to avoid selection on last element of status array
    body.currentState = body.progress, // workaround to avoid selection on last element of state array
    body.statusHistory = [{'status' : body.status}];
    body.stateHistory = [{'state' : body.progress}];
    delete body.status;
    delete body.progress;
    delete body.error;
    console.log("---> Lead body: ", body);
    const lead = new Lead(body);
    let newLead = await lead.save();
    console.log("===> New Lead: ", newLead);
    //var message = "Lead allocated to practise";
    //sendSMS(message);
    console.log("---> New Lead Reference: ", newLead.reference);
    res.status(200).send(newLead.reference);
  }
  catch (e) {
    console.log("===> ERROR - Add Lead: ", e);
    //var errData = JSON.stringify(e);
    res.status(400).send(e);
  }
});

// ----------------------------------------
//  Get lead detail
// ----------------------------------------
router.post('/lead', async (req, res) => {
  try {
    const body = _.pick(req.body, ['reference']);
    const lead = await Lead.find(
      {
        reference : body.reference
      },
      {
        _id : 0
      },
    )
    res.status(200).send(lead);
  }
  catch (e) {
    console.log("===> ERROR: ", e.errors);
    var errData = JSON.stringify(e);
    res.status(400).send(errData);
  }
});

// --------------------------------------
//	Update lead with practice allocation
// --------------------------------------
router.post('/allocatePractice', async (req, res) => {
  try {
    // extract POST parameters
    const body = _.pick(req.body, [
      '_id',
      'allocatedPractice',
      'who'
    ]);
    await Lead.findOneAndUpdate(
      {
        _id: body._id
      },
      {
        'allocatedPractice' : body.allocatedPractice,
        'who' : body.who
      },
      {
        upsert: false,
        new: true
      }
    )
    res.status(200).send("Ok");
  }
  catch (e) {
    //console.log(">>> Lead practice allocation error: ", e);
    //res.status(400).send(e);
    console.log("===> ERROR: ", e.errors);
    var errData = JSON.stringify(e);
    res.status(400).send(errData);
  }
});

// -----------------------------------
//  Get leads allocated to a practice
// -----------------------------------
router.get('/list/:criteria', async (req, res) => {
  // extract GET parameters
  const criteria = req.params.criteria;
  console.log("---> GET parameter and url: ", criteria, req.url);
  const query = JSON.parse(criteria);
  // var query = {
  //   allocatedPractice : c.allocatedPractice,
  //   currentStatus : c.status
  // };
  console.log("---> Query: ", query);
  try {
    const leads = await Lead.find(
      query,
      {
        _id : 0,
        who : 0,
        createdAt : 0,
        updatedAt : 0
      }
    ).sort({leadNumber: 1});
    console.log(">>> Data Returned: ", leads);
    const listData = [];
    for (var i = 0, j = leads.length; i < j; i++) {
      //
      // Extract service lines
      //
      var lines = "";
      for (var x = 0, y = leads[i].services.length; x < y; x++) {
        lines = lines + leads[i].services[x].line + " ";
      }
      //
      // Create data set array
      //
      listData.push(
        {
          reference : leads[i].reference,
          status : leads[i].statusHistory[leads[i].statusHistory.length-1].status,
          firstName : leads[i].firstName,
          surname : leads[i].surname,
          langPref : leads[i].langPref,
          //contactNum : leads[i].contactNum,
          //altNumber : leads[i].altNumber,
          //cellNumber : leads[i].cellNumber,
          //eMail : leads[i].eMail,
          postal : leads[i].contactLocation.postal,
          suburb : leads[i].contactLocation.suburb,
          service : lines,
          comment1 : leads[i].comments.comment1,
          comment2 : leads[i].comments.comment2,
          assignedAdviser : leads[i].assignedAdviser
        }
      );
    }
    console.log(">>> Data list: ", listData);
    res.send(listData);
  }
  catch (e) {
    console.log(">>> ERROR: request failed");
    res.status(400).send(e);
  }
});

// ----------------------------------
//  Get leads assigned to an adviser
// ----------------------------------
router.get('/list/:adviser', async (req, res) => {
  // extract GET parameters
  const adviser = req.params.adviser;
  console.log("---> GET parameter and url: ", adviser, req.url);
  const query = {assignedAdviser: adviser};
  //const query = {};
  try {
    const leads = await Lead.find(
      query,
      {
        _id : 0,
        who : 0,
        createdAt : 0,
        updatedAt : 0
      }
    ).sort({leadNumber: 1});
    console.log(">>> Data Returned: ", leads);
    const listData = [];
    for (var i = 0, j = leads.length; i < j; i++) {
      var lines = "";
      for (var x = 0, y = leads[i].services.length; x < y; x++) {
        lines = lines + leads[i].services[x].line + " ";
      }
      listData.push(
        {
          reference : leads[i].reference,
          status : leads[i].statusHistory[leads[i].statusHistory.length-1].status,
          firstName : leads[i].firstName,
          surname : leads[i].surname,
          langPref : leads[i].langPref,
          //contactNum : leads[i].contactNum,
          //altNumber : leads[i].altNumber,
          //cellNumber : leads[i].cellNumber,
          //eMail : leads[i].eMail,
          postal : leads[i].contactLocation.postal,
          suburb : leads[i].contactLocation.suburb,
          service : lines,
          comment1 : leads[i].comments.comment1,
          comment2 : leads[i].comments.comment2
        }
      );
    }
    console.log(">>> Data list: ", listData);
    res.send(listData);
  }
  catch (e) {
    res.status(400).send(e);
  }
});

// -------------------------------------
//	Update lead with adviser assignment
// -------------------------------------
router.post('/linkAdviser', (req, res) => {
  console.log("---> Link Adviser: ", req.body);
  LinkAdviser(req, res);
});

//----------------------------------------
//	Update Lead
//----------------------------------------
//router.route("/update").post(LeadUpdate());
router.post('/update', async (req, res) => {
  LeadUpdate(req, res);
});

// -----------------------------------
//  Get leads for search key
// -----------------------------------
router.post('/search', (req, res) => {
  LeadSearch(req, res);
});

module.exports = router;