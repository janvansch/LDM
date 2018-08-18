// =============================================
//  Create DB Documnent from Lead Data Received
// =============================================
var leadBody = (leadData) => {
  console.log("===> Create Lead DB Document from: ", leadData);
  var docBody = {
    langPref: leadData[0].langPref,
    title: "",
    firstName: leadData[1].firstname,
    surname: leadData[1].surname,
    initials: leadData[1].initials,
    contactNum: leadData[1].contactNum,
    altNumber: leadData[1].altNumber,
    cellNumber: leadData[1].cellNumber,
    eMail: leadData[2].eMail,
    agentApproval: "Yes",
    currentInsurer: "leadData[0].",
    previousInsurer: "leadData[0].",
    lineOfBusiness: "leadData[0].",
    contactLocation: {
      postal: leadData[7].postalCode,
      suburb: leadData[1].suburb,
      streetNum: leadData[1].streetNum,
      streetName: leadData[1].streetName,
      buildingName: leadData[1].buildingName,
      buildingName: leadData[1].buildingName,
      floor: leadData[1].floor,
      room: leadData[1].room
    },
    postBox: {
      postalCode: leadData[7].boxPostalCode,
      boxNumber: leadData[1].box
    },
    contactPref: {
      contactDay: leadData[3].contactDay,
      time: leadData[4].time,
      timeBA: leadData[5].timeBA
    },
    service: leadData[8].service,
    comments: {
      comment1: leadData[6].comment1,
      comment2: leadData[9].comment2,
      comment3: "leadData[0].",
      comment4: "leadData[0].",
    },
    status: "Open",
    completedAt: 0
  };
  console.log("===> Lead body: ", docBody);
  return docBody;
}

module.exports = {leadBody};
