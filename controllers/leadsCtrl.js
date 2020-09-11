// ==================
//  Leads Controller
// ==================
//const {mongoose} = require('../db/mongoose');
const _ = require('lodash');
const {Lead} = require('../models/lead');

// -----------------------------------
//  Get leads for search key
// -----------------------------------
var LeadSearch = async (req, res) => {
  console.log("*** Get Leads for Query Started ***");

  console.log("---> Request: ", req.body);
  //
  // Extract parameters and create query for find request
  // Query allows for partial case insentive parameters
  //
  var query = {};
  var p = 0;
  var param = ["reference","surname","firstName","entityName","entity.entRefNum","assignedAdviser","allocatedPractice"];

  for(var key in req.body){ //could also be req.query and req.params
    req.body[key] !== "" ? query[param[p]] = {$regex: req.body[key], $options: 'i' }: null;
    p++;
  }
  console.log("---> Query: ", query);
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

    console.log("*** Data Returned ***");
    //
    // Create data set for client
    //
    var listData = [];
    for (var i = 0, j = leads.length; i < j; i++) {
      //console.log(">>> counter: ", i);
      //console.log("--->>> processing lead: ", leads[i].reference);
      //
      // Extract service lines
      //
      var lines = "";
      for (var x = 0, y = leads[i].services.length; x < y; x++) {
        //console.log(">>> lines count: ", x, " of ", y);
        lines = lines + leads[i].services[x].line + " ";
        //console.log(">>> lines: ", lines);
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
          state : (leads[i].stateHistory.length === 0) ? (" - ") : (leads[i].stateHistory[leads[i].stateHistory.length-1].state),
          firstName : leads[i].firstName,
          surname : leads[i].surname,
          langPref : leads[i].langPref,
          contactNum : leads[i].contactNum,
          // altNumber : leads[i].altNumber,
          //cellNumber : leads[i].cellNumber,
          // eMail : leads[i].eMail,
          enityType : leads[i].entity.entType,
          entityRefNum : leads[i].entity.entRefNum,
          entityName : leads[i].entityName,
          postal : leads[i].contactLocation.postal,
          suburb : leads[i].contactLocation.suburb,
          service : lines,
          lineOfBusiness: leads[i].lineOfBusiness,
          //comment1 : leads[i].comments.comment1,
          //comment2 : leads[i].comments.comment2,
          servicerType : leads[i].servicerType,
          assignedAdviser : leads[i].assignedAdviser
        }
      );
      //console.log(">>> Data List row: ", listData[i]);
    }
    //console.log(">>> Data list: ", listData);
    console.log("*** Data List Created ***");
    res.send(listData);
    // res.send(leads);
    console.log("*** Data List Sent ***");
  }
  catch (e) {
    console.log("*** Data Extract Failed ***");
    res.status(400).send(e);
  }
};

//----------------------------------------
//	Update Lead
//----------------------------------------
var LeadUpdate = async (req, res) => {
  console.log(">>> Update Lead Request body and url: ", req.body, req.url);
  try {
    // Extract required data from update request
    const body = _.pick(req.body, [
      'reference',
      'title',
      'firstName',
      'surname',
      'contactNum',
      'altNumber',
      'cellNumber',
      'eMail',
      'langPref',
      'currentInsurer',
      'previousInsured',
      'entity',
      'entityName',
      'lineOfBusiness',
      'contactLocation',
      'postBox',
      'contactPref',
      'services',
      'comments',
      'servicerType',
      'trfApproval',
      //'allocatedPractice',
      //'assignedAdviser',
      'accepted',
      'rejectReason',
      'contactDate',
      'noContact',
      'viable',
      'notViableReason',
      'quoteDate',
      'quoteNum',
      'quoteState',
      'quoteStateDate',
      'quoteDeclineReason',
      'pendDate',
      'policyIssueDate',
      'policyNumber',
      'policyPremium',
      'policyPremiumFrequency',
      'progress',
      'status',
      'who'
    ]);
    console.log("---> Update Data Received: ", body);
    //
    // Define Update set
    //
    var updateData = {
      //'reference' : body.reference,
      'langPref' : body.langPref,
      'entity.entType' : body.entity.entType,
      'entity.entRefNum' : body.entity.entRefNum,
      'entityName' : body.entityName,
      'lineOfBusiness': body.lineOfBusiness,
      'title': body.title,
      'firstName' : body.firstName,
      'surname' : body.surname,
      'contactNum' : body.contactNum,
      'altNumber' : body.altNumber,
      'cellNumber' : body.cellNumber,
      'eMail': body.eMail,
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
      'comments.comment1' : body.comments.comment1,
      'comments.comment2' : body.comments.comment2,
      //'comments.comment3' : body.comment3,
      //'comments.comment4.date' : body.c4Date,
      //'comments.comment4.body' : body.c4Body,
      'servicerType' : body.servicerType,
      'trfApproval' : body.trfApproval,
      //'allocatedPractice' : body.allocatedPractice,
      //'assignedAdviser' : body.assignedAdviser,
      currentStatus : body.status, // workaround to avoid selection on last element of status array
      currentState : body.progress, // workaround to avoid selection on last element of state array
      //'statusHistory.status' : body.statusHistory.status,
      //'stateHistory.state': body.stateHistory.state,
      'accepted' : body.accepted,
      'rejectReason' : body.rejectReason,
      'contactDate' : body.contactDate,
      'noContact' : body.noContact,
      'notViableReason' : body.notViableReason,
      'quoteDate' : body.quoteDate,
      'quoteNum' : body.quoteNum,
      'quoteState' : body.quoteState,
      'quoteStateDate' : body. quoteStateDate,
      'quoteDeclineReason' : body.quoteDeclineReason,
      'pendDate' : body.pendDate,
      'policyIssueDate' : body.policyIssueDate,
      'policyNumber' : body.policyNumber,
      'policyPremium' : body.policyPremium,
      'policyPremiumFrequency' : body.policyPremiumFrequency,
      'who' : body.who
    };
    var pushData = {
      'statusHistory' : {'status' : body.status},
      'stateHistory': {'state' : body.progress}
    }

    // Update key
    const query = { reference: body.reference };
    // Update data
    const data =  {$set: updateData, $push: pushData};
    // Update options
    const options = { upsert: false, new: true };
    // Execute update - Model.method(query, data, options)
    await Lead.findOneAndUpdate(query, data, options);
    // Return success status
    res.status(200).send("Ok");
  }
  catch (e) {
    console.log(">>> Lead update error: ", e);
    // Return error status
    res.status(400).send(e);
  }
};

// ----------------------------------------
//  Link adviser to lead and update status
// ----------------------------------------
var LinkAdviser = async (req, res) => {
  console.log(">>> Link adviser: ", req.body, req.url);
  try {
    // Extract required data from update request
    const body = _.pick(req.body, [
      'reference',
      'assignedAdviser',
      'who'
    ]);
    console.log("---> Link adviser data: ", body);
    //
    // Define Update set
    //
    var updateData = {
      'assignedAdviser' : body.assignedAdviser,
      'currentStatus' : "assigned", // workaround to avoid selection on last element of status array
      'who' : body.who
    };
    var pushData = {
      'statusHistory' : {'status' : "assigned"}
    }

    // Update key
    const query = { reference: body.reference };
    // Update data
    const data =  {$set: updateData, $push: pushData};
    // Update options
    const options = { upsert: false, new: true };
    // Execute update - Model.method(query, data, options)
    await Lead.findOneAndUpdate(query, data, options);
    // Return success status
    res.status(200).send("Ok");
  }
  catch (e) {
    console.log(">>> Link Adviser Error: ", e);
    // Return error status
    res.status(400).send(e);
  }
};

module.exports = {LeadUpdate, LeadSearch, LinkAdviser};

/*
  const res = await Person.updateOne({ name: 'Jean-Luc Picard' }, { ship: 'USS Enterprise' });
res.n; // Number of documents matched
res.nModified; // Number of documents modified
*/

// Use method on individual documents, e.g. if you want to manipulate
// the individual document like adding tokens etc.
// Use the statics approach if you want query the whole collection.