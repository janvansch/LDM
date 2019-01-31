"use strict";

const _ = require('lodash');
const express = require('express');
const router = express.Router();

// const {mongoose} = require('../db/mongoose');
const {Lead} = require('../models/lead');
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
    console.log("===> Lead body: ", body);
    const lead = new Lead(body);
    await lead.save();
    //var message = "Lead allocated to practise";
    //sendSMS(message);
    res.status(200).send("ok");
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
/*
router.post('/lead', (req, res) => {
  console.log(">>> Request body and url: ", req.body, req.url);
  User.find(
    { reference : req.body.reference 
    },
    {
      _id : 0,
      //  who : 0,
      //  createdAt : 0,
      //  updatedAt : 0
    }
    ).then((lead) => {
      console.log(">>> Res - Lead data: ", user);
      res.send(lead);
    }, (e) => {
      res.status(400).send(e);
    });
});
*/

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

// -----------------------------------
//  Get leads for search key
// -----------------------------------
//router.get('/search/:key', async (req, res) => {
router.post('/search', async (req, res) => {
  //
  // Extract parameters and create query for find request
  // Query allows for partial case insentive parameters
  // 
  var query = {};
  var p = 0; 
  var param = ["reference", "surname", "firstName", "entityName", "entity.entRefNum"];
  for(var key in req.body){ //could also be req.query and req.params
    req.body[key] !== "" ? query[param[p]] = {$regex: req.body[key], $options: 'i' }: null;
    p++;
  }
  console.log("===> Search Query: ", query);
  //
  // Find Documents
  //
  try {
    const leads = await Lead.find(
      query,
      {
        _id : 0,
        who : 0,
        createdAt : 0,
        updatedAt : 0
      }
    ).sort({surname: 1});

    console.log(">>> Data Returned: ", leads);
    //
    // Create data set for client
    //
    var listData = [];
    for (var i = 0, j = leads.length; i < j; i++) {
      console.log(">>> counter: ", i);
      console.log("--->>> processing lead: ", leads[i].reference);
      //
      // Extract service lines
      //
      var lines = "";
      for (var x = 0, y = leads[i].services.length; x < y; x++) {
        console.log(">>> lines count: ", x, " of ", y);
        lines = lines + leads[i].services[x].line + " ";
        console.log(">>> lines: ", lines);
      }
      //
      // Create data set array
      //
      listData.push(
        {
          reference : leads[i].reference,
          status : (leads[i].statusHistory.length === 0) ? (" - ") : (leads[i].statusHistory[leads[i].statusHistory.length-1].status),
          //status : (typeof leads[i].statusHistory === 'undefined') ? (" - ") : (leads[i].statusHistory[leads[i].statusHistory.length-1].status),
          // status : leads[i].statusHistory[leads[i].statusHistory.length-1].status,
          firstName : leads[i].firstName,
          surname : leads[i].surname,
          // langPref : leads[i].langPref,
          contactNum : leads[i].contactNum,
          // altNumber : leads[i].altNumber,
          cellNumber : leads[i].cellNumber,
          // eMail : leads[i].eMail,
          enityType : leads[i].entity.entType,
          entityRefNum : leads[i].entity.entRefNum,
          entityName : leads[i].entityName,
          postal : leads[i].contactLocation.postal,
          suburb : leads[i].contactLocation.suburb,
          service : lines
          //comment1 : leads[i].comments.comment1,
          //comment2 : leads[i].comments.comment2,
          //assignedAdviser : leads[i].assignedAdviser
        }
      );
      console.log(">>> Data List row: ", listData[i]);
    }
    console.log(">>> Data list: ", listData);
    res.send(listData);
    // res.send(leads);
  }
  catch (e) {
    res.status(400).send(e);
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
router.get('/list/:practice', async (req, res) => {
  // extract GET parameters
  const practice = req.params.practice;
  console.log("---> GET parameter and url: ", practice, req.url);
  const query = {allocatedPractice: practice};
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
    res.status(400).send(e);
  }
});

// ----------------------------------
//  Get leads assigned to an adviser
// ----------------------------------
router.get('/list/:adviser', async (req, res) => {
  // extract GET parameters
  const adviser = req.params.practice;
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
router.post('/assignAdviser', (req, res) => {
  console.log("===> Message: ", req.body);
  try {

    // allocate();

    // var message = req.body;
    // console.log("===> Message: ", message.message);
    // sendSMS(message.message);
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
router.post('/update', async (req, res) => {
  console.log(">>> Request body and url: ", req.body, req.url);
  try {
    const body = _.pick(req.body, [
      'reference',
      'langPref',
      'entity',
      'entityName',
      'lineOfBusiness',
      //'title',
      'firstName',
      'surname',
      'contactNum',
      'altNumber',
      'cellNumber',
      'eMail',
      //'agentApproval',
      'currentInsurer',
      'previousInsured',
      'contactLocation',
      'postBox',
      'contactPref',
      'services',
      'comments',
      'allocatedPractice',
      'assignedAdviser',
      'statusHistory',
      // stateHistory,
      'outcome',
      'policyNumber',
      'who'
    ]);
    console.log("---> Update Data Received: ", body);
    await Lead.findOneAndUpdate(
      { reference: body.reference },
      {
        //'reference' : body.reference,
        'langPref' : body.langPref,
        'entity.entType' : body.entity.entType,
        'entity.entRefNum' : body.entity.entRefNum,
        'entityName' : body.entityName,
        'lineOfBusiness': body.lineOfBusiness,
        //title: ,
        'firstName' : body.firstName,
        'surname' : body.surname,
        'contactNum' : body.contactNum,
        'altNumber' : body.altNumber,
        'cellNumber' : body.cellNumber,
        'eMail': body.eMail,
        //agentApproval: ,
        'currentInsurer': body.currentInsurer,
        'previousInsured' : body.previousInsured,
        'contactLocation.postal' : body.contactLocation.postal,
        'contactLocation.suburb': body.contactLocation.suburb,
        'contactLocation.streetNum' : body.contactLocation.streetNum,
        'contactLocation.streetName' : body.contactLocation.streetName,
        'contactLocation.buildingName' : body.contactLocation.buildingName,
        'contactLocation.floor' : body.contactLocation.floor,
        'contactLocation.room' : body.contactLocation.room,
        'postBox.postalCode' : body.postBox.postalCode,
        'postBox.boxNumber' : body.postBox.boxNumber,
        'contactPref.contactDay' : body.contactPref.contactDay,
        'contactPref.time' : body.contactPref.time,
        'contactPref.timeBA' : body.contactPref.timeBA,
        'services' : body.services,
        //'services.line' : body.line,
        //'services.types' : body.types,
        'comments.comment1' : body.comments.comment1,
        'comments.comment2' : body.comments.comment2,
        //'comments.comment3' : body.comment3,
        //'comments.comment4.date' : body.c4Date,
        //'comments.comment4.body' : body.c4Body,
        //'allocatedPractice' : body.allocatedPractice,
        //'assignedAdviser' : body.adviser,
        //'statusHistory.status' : body.status,
        //'statusHistory.statusDate' : body.statusDate,
        // stateHistory.state: ,
        // stateHistory.stateDate: ,
        //'outcome' : body.outcome,
        //'policyNumber' : body.policyNumber,
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
    console.log(">>> Practice update error: ", e);
    res.status(400).send(e);
  }
});

module.exports = router;