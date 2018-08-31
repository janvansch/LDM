// =============================================
//  Create DB Documnent from Lead Data Received
// =============================================
var userBody = (userData) => {
  console.log("===> Create Lead DB Document from: ", userData);
  var docBody = {
    firstName: userData[0].firstName,
    surname: leadData[1].surname,
    initials: leadData[1].initials,
    phone: leadData[1].phone,
    cell: leadData[1].cell,
    roleCode: userData[0].roleCode,
    practiseCode: userData[0].practiseCode,
    skill: {
      accreditation: leadData[7].accreditation,
      experience: leadData[1].experience,
    },

    
    eMail: leadData[2].eMail,
    agentApproval: "Yes",
    currentInsurer: "çurr ins",
    previousInsurer: "prev ins",
    lineOfBusiness: "line of Buss.",
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
      comment3: "comment 3",
      comment4: "comment 4",
    },
    status: "Open",
    //completedAt: 0
    //body.completedAt = new Date().getTime();
  };
  console.log("===> Lead body: ", docBody);
  return docBody;
}

module.exports = {userBody};
