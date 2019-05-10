const {sendSMS} = require('../utils/SMS');

var allocate = function (lead) {
  console.log("===> ALLOCATE Lead Called - lead info: ", lead);

  // allocate()

  //var message = "Lead allocated";
  //console.log("===> SMS message: ", message);
  //sendSMS(message);
  var result = "ok";
  return result;
}

module.exports = {allocate};
  