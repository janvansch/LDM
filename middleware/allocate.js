const {Lead} = require('../models/lead');
const {sendSMS} = require('../utils/SMS');
const { result } = require('lodash');

var allocate = function (lead) {
  console.log("===> ALLOCATE Lead Called - lead info: ", lead);
  var result = leadAllocate(lead.reference);
  if (result === "Ok") {
    //var message = "Lead allocated";
    //console.log("===> SMS message: ", message);
    //sendSMS(message);
    var result = "ok";
    return result;
  }
  else {
    var result = "no";
    return result;
  }
}

//----------------------------------------
//	Allocate Lead
//----------------------------------------
async function leadAllocate(reference) {
  console.log(">>> Update Lead Request body and url: ", reference);
  try {
    //
    // Define Update set
    //
    var updateData = {
      'allocatedPractice' : "P-Test",
      'currentStatus' : "allocated",
      'who' : "system"
    };
    var pushData = {
      'statusHistory' : {'status' : 'allocated'},
    }

    // Update key
    const query = { reference: reference };
    // Update data
    const data =  {$set: updateData, $push: pushData};
    // Update options
    const options = { upsert: false, new: true };
    // Execute update - Model.method(query, data, options)
    await Lead.findOneAndUpdate(query, data, options);
    // Return success status
    result = "Ok";
    return result;
  }
  catch (e) {
    result = "Error";
    return result;
  }
};

module.exports = {allocate};
