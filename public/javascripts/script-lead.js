"use strict";

// ===========================================================================
//  Leads View - Add Lead & Display Lead Panels
// ===========================================================================

// -----------------------------
//  Display Add Lead Panel
// -----------------------------
function addLead() {
  //
  // Switch Add Lead display on
  //
  document.getElementById('panelAddLead').style.display = 'block';
  //
  // Switch Leads List display off
  //
  document.getElementById('panelViewLead').style.display = 'none';
}

// ------------------------------
//  Display Lead Selection Panel
// ------------------------------
function selectLead() {
  //
  // Switch Lead View display on
  //
  document.getElementById('panelViewLead').style.display = 'block';
  //
  // Switch Adviser display off
  //
  document.getElementById('panelAddLead').style.display = 'none';
}

// ----------------------------------------------------------------------
//  Lead Display Switches for Contact Form and Service Required Selector
// ----------------------------------------------------------------------
function leadOk() {
  if (document.getElementById('trfYes').checked) {
    // switch Yes on
    document.getElementById('yesForm').style.display = 'block';
    //document.getElementById('approval-msg').style.display = 'block';
    // switch No off
    document.getElementById('noForm').style.display = 'none';
  }
  else if (document.getElementById('trfNo').checked) {
    // switch No on
    document.getElementById('noForm').style.display = 'block';
    // switch Yes off
    document.getElementById('yesForm').style.display = 'none';
    //document.getElementById('approval-msg').style.display = 'block';
    // switch other off as well
    // document.getElementById('ifPersonal').style.display = 'none';
    // document.getElementById('ifCommercial').style.display = 'none';
    // document.getElementById('ifSasria').style.display = 'none';
    // document.getElementById('ifAgriculture').style.display = 'none';
    // document.getElementById('ifSpecialist').style.display = 'none';
    // document.getElementById('ServiceComment').style.display = 'none';
  // need to clear previous selections as well
  //  document.getElementById("myForm").reset();
  //  document.getElementById('ifPersonal').reset();
  //  document.getElementById('ifCommercial').reset();
  //  document.getElementById('ifSasria').reset();
  //  document.getElementById('ifAgriculture').reset();
  //  document.getElementById('ifSpecialist').reset();
  }
}

// --------------------------------------
//  Display Switches for Lead Cover Form
// --------------------------------------
function line() {
  if (document.getElementById('pInsLine').checked) {
    // switch on
    document.getElementById('ifPersonal').style.display = 'block';
    console.log("*** Personal Insurance Selected ***");
    // switch rest off
    document.getElementById('ifCommercial').style.display = 'none';
    document.getElementById('ifSasria').style.display = 'none';
    document.getElementById('ifAgriculture').style.display = 'none';
    document.getElementById('ifSpecialist').style.display = 'none';
  }
  else if(document.getElementById('cInsLine').checked) {
    document.getElementById('ifCommercial').style.display = 'block';
    console.log("*** Commercial Insurance Selected ***");
    document.getElementById('ifPersonal').style.display = 'none';
    document.getElementById('ifSasria').style.display = 'none';
    document.getElementById('ifAgriculture').style.display = 'none';
    document.getElementById('ifSpecialist').style.display = 'none';
  }
  else if(document.getElementById('sInsLine').checked) {
    document.getElementById('ifSasria').style.display = 'block';
    console.log("*** SASRIA Insurance Selected ***");
    document.getElementById('ifPersonal').style.display = 'none';
    document.getElementById('ifCommercial').style.display = 'none';
    document.getElementById('ifAgriculture').style.display = 'none';
    document.getElementById('ifSpecialist').style.display = 'none';
  }
  else if(document.getElementById('aInsLine').checked) {
    document.getElementById('ifAgriculture').style.display = 'block';
    console.log("*** Agriculture Insurance Selected ***");
    document.getElementById('ifPersonal').style.display = 'none';
    document.getElementById('ifCommercial').style.display = 'none';
    document.getElementById('ifSasria').style.display = 'none';
    document.getElementById('ifSpecialist').style.display = 'none';
  }
  else if(document.getElementById('xInsLine').checked) {
    document.getElementById('ifSpecialist').style.display = 'block';
    console.log("*** Specialist Insurance Selected ***");
    document.getElementById('ifPersonal').style.display = 'none';
    document.getElementById('ifCommercial').style.display = 'none';
    document.getElementById('ifSasria').style.display = 'none';
    document.getElementById('ifAgriculture').style.display = 'none';
  }
  document.getElementById('ServiceComment').style.display = 'block';
}

// --------------------------------------------------------------
//  Extract & Display a subset of leads based on search criteria 
// --------------------------------------------------------------
function findLead() {
  //
  // Extract selection criteria data
  //
  var criteria = {
    refNo : document.getElementById('view-lead-ref-no').value,
    contactSurname : document.getElementById('view-lead-con-surname').value,
    contactFirstName : document.getElementById('view-lead-con-name').value,
    entityName : document.getElementById('view-lead-org-name').value,
    entityRefNum : document.getElementById('view-lead-ref-id').value
  };
  console.log(">>> Criteria values: ", 
    criteria.refNo, 
    criteria.contactSurname, 
    criteria.contactFirstName, 
    criteria.entityName, 
    criteria.entityRefNum
  );
  //
  // Create data request
  //
  var request = JSON.stringify(criteria);
  //var request = criteria.refNo;
	console.log("​findLead -> request", request)
  //var method = "GET";
  var method = "POST";
  //var route = "/leads/search/";
  var route = "/leads/search";
  var contentType = "application/json";
  //
  // Request data from server
  //
  xhrRequest(method, route, contentType, request, (err, res) => {
    if (!err) {
      var data = JSON.parse(res.responseText);
      if (data.length !== 0) {
        //
        // load report layout definition
        //
        var layoutId = '5';
        var prompt = 'Leads found';
        //
        // Display Leads List
        //
        displayData(data, prompt, layoutId);
        //
        // Add row select handlers to enable editing of rows
        //
        addRowHandlers(layoutId);
      }
      else {
        document.getElementById("tPos5").innerHTML = "None found";
      }
    }
    else {
      var prompt = "Lead request error";
      document.getElementById("leadErr").innerHTML = prompt;
    }
  });
}
  
// ----------------------------------
//  Display lead detail in modal box
// ----------------------------------
function displayLead(leadRef, viewID) {
  console.log("---> Lead selected (this): ", leadRef);
  //
  // open model window
  //
  modal.style.display = "block";
  document.getElementById("displayLead").style.display = 'block';
  document.getElementById("modal-header-text").innerHTML = "Detail for lead: " + leadRef;
  document.getElementById("updateLeadButtons").style.display = "none";
  document.getElementById("practiceLeadButtons").style.display = "none";
  document.getElementById("adviserLeadButtons").style.display = "none";
  if (viewID === "5") {
    document.getElementById("updateLeadButtons").style.display = "block";
  }
  if (viewID === "1") {
  document.getElementById("practiceLeadButtons").style.display = "block";
  }
  if (viewID === "4") {
  document.getElementById("adviserLeadButtons").style.display = "block";
  }
  //
  // Define lead data request
  //
  var request = JSON.stringify({reference : leadRef});
  var method = "POST";
  var route = "/leads/lead";
  var contentType = "application/json";
  //
  //  Request lead data from server
  //
  console.log(">>> Request: ", request);
  xhrRequest(method, route, contentType, request, (err, res) => {
    if (!err) {
      var lead = JSON.parse(res.responseText);
      console.log(">>> Lead data returned: ", lead);
      //
      // Fill display form with lead data
      //
      //
      // Set language option
      //
      if (lead[0].langPref === "English") {
        document.getElementById("eng").checked = true;
      }
      else {
        document.getElementById("afr").checked = true;
      }
      //
      // Set entity type
      //
      if (lead[0].entity.entType === "Person") {
        document.getElementById("person").checked = true;
      }
      else {
        document.getElementById("legal").checked = true;
      }
      //
      // Set previously insured
      //
      if (lead[0].previousInsured === "Yes") {
        document.getElementById("insYes").checked = true;
      }
      else {
        document.getElementById("insNo").checked = true;
      }
      document.getElementById("entityName").value = lead[0].entityName;
      document.getElementById("entityRefNum").value = lead[0].entity.entRefNum;
      document.getElementById("conFirstName").value = lead[0].firstName;
      document.getElementById("conSurname").value = lead[0].surname;
      //document.getElementById("u2").value = lead[0].initials;
      document.getElementById("conTelNum").value = lead[0].contactNum;
      document.getElementById("conAltNum").value = lead[0].altNumber;
      document.getElementById("conCellNum").value = lead[0].cellNumber;
      document.getElementById("conEMail").value = lead[0].eMail;
      document.getElementById("currInsurer").value = lead[0].currentInsurer;
      //document.getElementById("u6").value = lead[0].lineOfBusiness;
      document.getElementById("conPostCode").value = lead[0].contactLocation.postal;
      document.getElementById("conSuburb").value = lead[0].contactLocation.suburb;
      document.getElementById("conStreetNum").value = lead[0].contactLocation.streetNum;
      document.getElementById("conStreetName").value = lead[0].contactLocation.streetName;
      document.getElementById("conBuildName").value = lead[0].contactLocation.buildingName;
      document.getElementById("conBuildFloor").value = lead[0].contactLocation.floor;
      document.getElementById("conBuildRoom").value = lead[0].contactLocation.room;
      document.getElementById("conBoxPostCode").value = lead[0].postBox.postalCode;
      document.getElementById("conBoxNum").value = lead[0].postBox.boxNumber;
      //
      // Set contact days selected
      //
      for (var x = 0, z = lead[0].contactPref.contactDay.length; x < z; x++) {
        console.log(">>> Contact day: ", x, lead[0].contactPref.contactDay[x]);
        if (lead[0].contactPref.contactDay[x] === "Monday") {
          document.getElementById("monday").checked = true;
        }
        if (lead[0].contactPref.contactDay[x] === "Tuesday") {
          document.getElementById("tuesday").checked = true;
        }
        if (lead[0].contactPref.contactDay[x] === "Wednesday") {
          document.getElementById("wednesday").checked = true;
        }
        if (lead[0].contactPref.contactDay[x] === "Thursday") {
          document.getElementById("thursday").checked = true;
        }
        if (lead[0].contactPref.contactDay[x] === "Friday") {
          document.getElementById("friday").checked = true;
        }
        if (lead[0].contactPref.contactDay[x] === "Saturday") {
          document.getElementById("saturday").checked = true;
        }
      }
      document.getElementById("time").value = lead[0].contactPref.time;
      // Set before or after time indicator
      if (lead[0].contactPref.timeBA === "before") {
        document.getElementById("before").checked = true;
      }
      if (lead[0].contactPref.timeBA === "after") {
        document.getElementById("after").checked = true;
      }
      //
      // Display required cover detail
      //
      document.getElementById("v-ins-lines").style.display = 'block';
      var services = lead[0].services;
      showServices(services, 'v');
      //
      // Display comments
      //
      document.getElementById("contactComment").value = lead[0].comments.comment1;
      document.getElementById("serviceComment").value = lead[0].comments.comment2;
      document.getElementById("u6").value = lead[0].comments.comment3;
      document.getElementById("u6").value = lead[0].comments.comment4;
      
    }
    else {
      var prompt = "User detail request error";
      document.getElementById("userErr").innerHTML = prompt;
    }
  });
}

// ------------------------------
//  Send new lead data to server
// ------------------------------
function submitLead() {
  console.log("*** Add Lead ***");
  //
  // Extract new lead data from DOM
  //
  var leadData = getLeadData("ADD");
  //
  // If data found send to server
  //
  if (leadData !== "error") {
    var dataString = JSON.stringify(leadData);
    console.log("---> Data String: ", dataString);
    var method = "POST";
    var route = "/leads/add";
    var contentType = "application/json";
    //
    //  Send Lead POST Request
    //
    xhrRequest(method, route, contentType, dataString, (err, result) => {
      if (!err) {
        var resBody = result.responseText;
        document.getElementById("addLeadForm").reset();
        //document.getElementById("coverForm").reset();
      }
      else {
        var prompt = "Lead add submit error";
        document.getElementById("leadErr").innerHTML = prompt;
      }
    });
  }
  else {
    console.log("*** Lead add failed - no data ***");
  }
}

// ---------------------------------
//  Send lead update data to server
// ---------------------------------
function updateLead() {
  console.log("*** Update Lead ***");
  //
  // Extract lead update data from DOM
  //
  var leadData = getLeadData("UPDATE");
  if (leadData !== "error") {
    var dataString = JSON.stringify(leadData);
    console.log("---> Update Data String: ", dataString);
    var method = "POST";
    var route = "/leads/update";
    var contentType = "application/json";
    //
    //  Send Lead POST Request
    //
    xhrRequest(method, route, contentType, dataString, (err, result) => {
      if (!err) {
        //
        // Clear form
        //
        document.getElementById("formLead").reset();
        //
        // Close form and modal
        //
        document.getElementById("displayLead").style.display = 'none';
        document.getElementById('v-ins-lines').style.display = 'none';
        document.getElementById('v-pl-types').style.display = 'none';
        document.getElementById('v-cl-types').style.display = 'none';
        document.getElementById('v-sl-types').style.display = 'none';
        document.getElementById('v-al-types').style.display = 'none';
        document.getElementById('v-xl-types').style.display = 'none';
        modal.style.display = "none";
        //
        // Update practice list
        //
        selectLead();
      }
      else {
        var prompt = "Lead update submit error";
        document.getElementById("leadErr").innerHTML = prompt;
      }
    });
  }
  else {
    console.log("*** Lead update failed - no data ***");
  }
}

// ----------------------------
//  Extract lead data from DOM
// ----------------------------
function getLeadData(form){
  //
  //  Extract Lead Data from DOM
  //
  if (form === "ADD") {
    console.log("*** Extract add lead data ***");
    var leadData = document.getElementById("yesForm");
    //
    // Insurance line checkbox name for lead add
    //
    var linesCheckboxName = "addLine";
  }
  else if (form === "UPDATE") {
    console.log("*** Extract lead update data ***");
    var leadData = document.getElementById("formLead");
    //
    // Insurance line checkbox name for lead update
    //
    var linesCheckboxName = "viewLine";
    var header = document.getElementById("modal-header-text").innerHTML;
    var leadRef = header.substr(17, 10);
    console.log("Lead Reference: ", leadRef);
  }
  else {
    console.log("*** ERROR: Invalid parameter value ***");
    var leadData = "error";
    return leadData;
  }
  //console.log("---> Lead Data: ", leadData);
  var radioName = "";
  var formElement = "";
  var inputType = "";
  //
  // extract language preference
  //
  radioName = "langPref";
  var contactLanguage = getRadioCheckedValue(leadData, radioName);
  console.log("---> Language: ", contactLanguage);
  //
  // extract entity type
  //
  radioName = "entity";
  var entType = getRadioCheckedValue(leadData, radioName);
  console.log("---> Entity Type: ", entType);
  //
  // extract previous insured status
  //
  radioName = "prevIns";
  var previousInsured = getRadioCheckedValue(leadData, radioName);
  console.log("---> Previously Insured: ", previousInsured);
  //
  // extract text data from contact form
  //
  formElement = "input";
  inputType = "text";
  var textInfo = extractFormData(leadData, formElement, inputType);
  console.log("---> Text Input: ", textInfo);
  //
  // extract email data from contact form
  //
  formElement = "input";
  inputType = "email";
  var contactEmail = extractFormData(leadData, formElement, inputType);
  console.log("---> email: ", contactEmail);
  //
  // extract selected day checkbox values
  //
  var checkboxName = "contactDay";
  var contactDays = getCheckedValues(leadData, checkboxName);
  if (Object.keys(contactDays).length === 0 && contactDays.constructor === Object) {
    var name = "contactDay";
    var value = [];
    value.push("any");
    contactDays[name] = value;
  }
  console.log("---> Contact Days: ", contactDays);
  //
  // extract contact time
  //
  formElement = "input";
  inputType = "time";
  var contactTime = extractFormData(leadData, formElement, inputType);
  console.log("---> Contact Time: ", contactTime);
  //
  // extract before or after
  //
  radioName = "timeBA";
  var contactTimeBA = getRadioCheckedValue(leadData, radioName);
  if (Object.keys(contactTimeBA).length === 0 && contactTimeBA.constructor === Object) {
    var name = "timeBA";
    var value = [];
    value.push("n/a");
    contactTimeBA[name] = value;
  }
  console.log("---> Before/After Time: ", contactTimeBA);
  //
  // extract contact comment
  //
  var formElement = "textarea";
  var contactComment = extractFormData(leadData, formElement);
  console.log("---> Contact Comment: ", contactComment);
  // extract postal codes
  formElement = "input";
  inputType = "number";
  var contactPostalCode = extractFormData(leadData, formElement, inputType);
  console.log("---> Postal Codes: ", contactPostalCode);
  //
  // Extract lead service line data
  //
  console.log("---> Insurance Lines Checkbox Name: ", linesCheckboxName);
  var insLine = getCheckedValues(leadData, linesCheckboxName);
  console.log("---> Insurance Line(s): ", insLine[linesCheckboxName]);
  if (Object.keys(insLine).length === 0 && insLine.constructor === Object) {
    //
    // No insurance line was selected
    //
    var name = "line";
    var value = [];
    value.push("none selected");
    insLine[name] = value;
  }
  else {
    //
    // Extract lead services for each of the insurance lines selected
    //
    console.log("---> Insurance Line(s): ", insLine[linesCheckboxName]);
    var lines = insLine[linesCheckboxName];
    console.log("---> Lines Array: ", lines);
    var leadServices = [];
    lines.forEach((element) => {
      var checkboxName = element;
      console.log("---> The Element: ", element);
      var selection = getCheckedValues(leadData, checkboxName);
      console.log("---> The Types selected: ", selection);
      if (Object.keys(selection).length === 0 && selection.constructor === Object) {
        var value = [];
        value.push("none selected");
        selection[checkboxName] = value;
      }
      var serviceItem = {
        line : element,
        types : selection[element]
      };
      console.log("---> Insurance Line Cover Types: ", serviceItem);
      
      leadServices.push(serviceItem);
      console.log("---> Lead Services: ", leadServices);
    })
  }
  //
  // Extract cover comment
  //
  formElement = "textarea";
  var coverComment = extractFormData(leadData, formElement);
  console.log("---> Cover Comment: ", coverComment);
  //
  //  create Lead data object
  //
  var leadData = {
    reference : leadRef,
    langPref: contactLanguage.langPref,
    entity: {
      entType: entType.entity,
      entRefNum: textInfo.entityRefNum
    },
    entityName: textInfo.entityName,
    title: "",
    firstName: textInfo.firstname,
    surname: textInfo.surname,
    initials: textInfo.initials,
    contactNum: textInfo.contactNum,
    altNumber: textInfo.altNumber,
    cellNumber: textInfo.cellNumber,
    eMail: contactEmail.eMail,
    agentApproval: "Yes",
    currentInsurer: textInfo.currInsurer,
    previousInsured: previousInsured.prevIns,
    lineOfBusiness: "line of Buss.",
    contactLocation: {
      postal: contactPostalCode.postalCode,
      suburb: textInfo.suburb,
      streetNum: textInfo.streetNum,
      streetName: textInfo.streetName,
      buildingName: textInfo.buildingName,
      floor: textInfo.floor,
      room: textInfo.room
    },
    postBox: {
      postalCode: contactPostalCode.boxPostalCode,
      boxNumber: textInfo.box
    },
    contactPref: {
      contactDay: contactDays.contactDay,
      time: contactTime.time,
      timeBA: contactTimeBA.timeBA
    },
    //service: coverInfo.service,
    services: leadServices,
    comments: {
      comment1: contactComment.comment1,
      comment2: coverComment.comment2
      //comment3: "",
      //comment4: ""
    }
    //status: "Open"
  };
  console.log("---> Data extracted: ", leadData);
  return leadData;
}




  //   if (services[i].line === "PL") {
  //     //
  //     // Set insurance line selector tickbox for PL to selected
  //     //
  //     document.getElementById("p-line").checked = true;
  //     //
  //     // Display insurance type selector for PL
  //     //
  //     document.getElementById("pl-types").style.display = 'block';
  //     //
  //     // For the insurance types found set the selector tickbox to selected
  //     //
  //     for (var x = 0, z = services[i].types.length; x < z; x++) {
  //       console.log(">>> Services Detail: ", x, services[i].types[x]);
  //       if (services[i].types[x] === "Private Vehicle") {
  //         document.getElementById("pVehicle").checked = true;
  //         console.log(">>> Private Vehicle set: ", x, services[i].types[x]);
  //       }
  //       else if (services[i].types[x] === "Home Contents") {
  //         document.getElementById("pHomeContents").checked = true;
  //       }
  //       else if (services[i].types[x] === "SOS") {
  //         document.getElementById("pSOS").checked = true;
  //       }
  //       else if (services[i].types[x] === "Building") {
  //         document.getElementById("pBuilding").checked = true;
  //       }
  //       else if (services[i].types[x] === "Watercraft") {
  //         document.getElementById("pWatercraft").checked = true;
  //       }
  //       else if (services[i].types[x] === "All Risk") {
  //         document.getElementById("pAllRisk").checked = true;
  //       }
  //       else {
  //         console.log(">>> ERROR - Invalid type: ", services[i].types[x]);
  //       }
  //     }
  //   }
  //   if (services[i].line === "CL") {
  //     //
  //     // Set insurance line selector tickbox for CL to selected
  //     //
  //     document.getElementById("c-line").checked = true;
  //     //
  //     // Display insurance type selector for CL
  //     //
  //     document.getElementById("cl-types").style.display = 'block';
  //     //
  //     // For the insurance types found set the selector tickbox to selected
  //     //
  //     for (var x = 0, z = services[i].types.length; x < z; x++) {
  //       console.log(">>> Services Detail: ", x, services[i].types[x]);
  //       if (services[i].types[x] === "Commercial Vehicle") {
  //         document.getElementById("cVehicle").checked = true;
  //       }
  //       else if (services[i].types[x] === "Business") {
  //         document.getElementById("cBusiness").checked = true;
  //       }
  //       else if (services[i].types[x] === "Guesthouse") {
  //         document.getElementById("cGuesthouse").checked = true;
  //       }
  //       else if (services[i].types[x] === "Tourism,Leisure & Entertainment") {
  //         document.getElementById("cTourLeisEnter").checked = true;
  //       }
  //       else if (services[i].types[x] === "Small Business") {
  //         document.getElementById("cSmallBusiness").checked = true;
  //       }
  //       else if (services[i].types[x] === "Dental") {
  //         document.getElementById("cDental").checked = true;
  //       }
  //       else if (services[i].types[x] === "Medical") {
  //         document.getElementById("cMedical").checked = true;
  //       }
  //       else {
  //         console.log(">>> ERROR - Invalid type: ", services[i].types[x]);
  //       }
  //     }
  //   }
  //   if (services[i].line === "SL") {
  //     //
  //     // Set insurance line selector tickbox for SL to selected
  //     //
  //     document.getElementById("s-line").checked = true;
  //     //
  //     // Display insurance type selector for SL
  //     //
  //     document.getElementById("sl-types").style.display = 'block';
  //     //
  //     // For the insurance types found set the selector tickbox to selected
  //     //
  //     for (var x = 0, z = services[i].types.length; x < z; x++) {
  //       console.log(">>> Services Detail: ", x, services[i].types[x]);
  //       if (services[i].types[x] === "Vehicle") {
  //         document.getElementById("sVehicle").checked = true;
  //       }
  //       else if (services[i].types[x] === "Property") {
  //         document.getElementById("sProperty").checked = true;
  //       }
  //       else if (services[i].types[x] === "Asset") {
  //         document.getElementById("sAsset").checked = true;
  //       }
  //       else {
  //         console.log(">>> ERROR - Invalid type: ", services[i].types[x]);
  //       }
  //     }
  //   }
  //   if (services[i].line === "AL") {
  //     //
  //     // Set insurance line selector tickbox for AL to selected
  //     //
  //     document.getElementById("a-line").checked = true;
  //     //
  //     // Display insurance type selector for AL
  //     //
  //     document.getElementById("al-types").style.display = 'block';
  //     //
  //     // For the insurance types found set the selector tickbox to selected
  //     //
  //     for (var x = 0, z = services[i].types.length; x < z; x++) {
  //       console.log(">>> Services Detail: ", x, services[i].types[x]);
  //       if (services[i].types[x] === "Asset") {
  //         document.getElementById("aAsset").checked = true;
  //       }
  //       else if (services[i].types[x] === "Game") {
  //         document.getElementById("aGame").checked = true;
  //       }
  //       else if (services[i].types[x] === "Fire") {
  //         document.getElementById("aFire").checked = true;
  //       }
  //       else if (services[i].types[x] === "Crop") {
  //         document.getElementById("aCrop").checked = true;
  //       }
  //       else if (services[i].types[x] === "Dairy") {
  //         document.getElementById("aDairy").checked = true;
  //       }
  //       else {
  //         console.log(">>> ERROR - Invalid type: ", services[i].types[x]);
  //       }
  //     }
  //   }
  //   if (services[i].line === "XL") {
  //     //
  //     // Set insurance line selector tickbox for XL to selected
  //     //
  //     document.getElementById("x-line").checked = true;
  //     //
  //     // Display insurance type selector for AL
  //     //
  //     document.getElementById("xl-types").style.display = 'block';
  //     //
  //     // For the insurance types found set the selector tickbox to selected
  //     //
  //     for (var x = 0, z = services[i].types.length; x < z; x++) {
  //       console.log(">>> Services Detail: ", x, services[i].types[x]);
  //       if (services[i].types[x] === "Aviation") {
  //         document.getElementById("xAviation").checked = true;
  //       }
  //       else if (services[i].types[x] === "Bonds & Guarantees") {
  //         document.getElementById("xBondsGuarantees").checked = true;
  //       }
  //       else if (services[i].types[x] === "Cell Captive") {
  //         document.getElementById("xCellCapt").checked = true;
  //       }
  //       else if (services[i].types[x] === "Coporate Property") {
  //         document.getElementById("xCoporateProperty").checked = true;
  //       }
  //       else if (services[i].types[x] === "Crop") {
  //         document.getElementById("xCrop").checked = true;
  //       }
  //       else if (services[i].types[x] === "Engineering") {
  //         document.getElementById("xEngineering").checked = true;
  //       }
  //       else if (services[i].types[x] === "Heavy Haulage") {
  //         document.getElementById("xHeavyHaulage").checked = true;
  //       }
  //       else if (services[i].types[x] === "Hospitality Industry") {
  //         document.getElementById("xHospitalityInd").checked = true;
  //       }
  //       else if (services[i].types[x] === "Liability") {
  //         document.getElementById("xLiability").checked = true;
  //       }
  //       else if (services[i].types[x] === "Marine") {
  //         document.getElementById("xMarine").checked = true;
  //       }
  //       if (services[i].types[x] === "Private Client") {
  //         document.getElementById("xPrivateClient").checked = true;
  //       }
  //       else if (services[i].types[x] === "Seamless Prod") {
  //         document.getElementById("xSeamless Prod").checked = true;
  //       }
  //       else if (services[i].types[x] === "Specialist Real Estate") {
  //         document.getElementById("xSpecRealEst").checked = true;
  //       }
  //       else if (services[i].types[x] === "Structured Insurance") {
  //         document.getElementById("xStructuredInsurance").checked = true;
  //       }
  //       else if (services[i].types[x] === "Taxi & SEM") {
  //         document.getElementById("xTaxiSEM").checked = true;
  //       }
  //       else if (services[i].types[x] === "Travel") {
  //         document.getElementById("xTravel").checked = true;
  //       }
  //       else {
  //         console.log(">>> ERROR - Invalid type: ", services[i].types[x]);
  //       }
  //     }
  //   }
  // }
