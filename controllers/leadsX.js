// ==================
//  Leads Controller
// ==================
//const {mongoose} = require('../db/mongoose');
const _ = require('lodash');
const {Lead} = require('../models/lead');

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

module.exports = {LeadUpdate};

/*
  const res = await Person.updateOne({ name: 'Jean-Luc Picard' }, { ship: 'USS Enterprise' });
res.n; // Number of documents matched
res.nModified; // Number of documents modified
*/

// Use method on individual documents, e.g. if you want to manipulate
// the individual document like adding tokens etc.
// Use the statics approach if you want query the whole collection.