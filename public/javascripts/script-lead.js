"use strict";
// ===========================================
//  Click Event Orchestration for UI controls
// ===========================================
//
// -------------------------------
//  Lead accept click event setup
// -------------------------------
document.getElementById("lead-accept").onclick = function() {
  var accept = document.getElementsByClassName("accept-yes");
  for (var i = 0; i < accept.length; i++) {
    accept[i].disabled = false;
  }
  var reject = document.getElementById("rejectReason");
  reject.value = null;
  reject.disabled = true;
  //document.getElementById("view-lead-ref-no").value = "";
}
// -------------------------------
//  Lead reject click event setup
// -------------------------------
document.getElementById("lead-reject").onclick = function() {
  var accept = document.getElementsByClassName("accept-yes");
  for (var i = 0; i < accept.length; i++) {
    accept[i].disabled = true;
  }
  document.getElementById("rejectReason").disabled = false;
}
// ------------------------------
//  No contact click event setup
// ------------------------------
document.getElementById('noContact').onclick = function() {
  var elements = document.getElementsByClassName("accept-yes");
  // access properties using "this" keyword
  if ( this.checked ) {
    for (var i = 0; i < elements.length; i++) {
      elements[i].disabled = true;
    }
    document.getElementById("noContact").disabled = false;
    document.getElementById("lead-accept").disabled = true;
    document.getElementById("lead-reject").disabled = true;
  }
  else {
    for (var i = 0; i < elements.length; i++) {
      elements[i].disabled = false;
    }
    document.getElementById("lead-accept").disabled = false;
    document.getElementById("lead-reject").disabled = false;
  }
};
// -------------------------------
//  Lead viable click event setup
// -------------------------------
document.getElementById("viable").onclick = function() {
  var reason = document.getElementById("not-viable-reason");
  reason.value = null;
  reason.disabled = true;
  var accept = document.getElementsByClassName("accept-yes");
  for (var i = 0; i < accept.length; i++) {
    accept[i].disabled = false;
  }
  document.getElementById("lead-accept").disabled = false;
  document.getElementById("lead-reject").disabled = false;
}
// -------------------------------
//  Lead not viable click event setup
// -------------------------------
document.getElementById("not-viable").onclick = function() {
  document.getElementById("not-viable-reason").disabled = false;
  var accept = document.getElementsByClassName("accept-yes");
  for (var i = 0; i < accept.length; i++) {
    accept[i].disabled = true;
  }
  document.getElementById("viable").disabled = false;
  document.getElementById("lead-accept").disabled = true;
  document.getElementById("lead-reject").disabled = true;
}
// ----------------------------------
//  Quote accepted click event setup
// ----------------------------------
document.getElementById("quoteAccepted").onclick = function() {
  document.getElementById("eventDate").disabled = false;
  var reason = document.getElementById("declineReason");
  reason.value = null;
  reason.disabled = true;
}
// -------------------------------
//  Lead declined click event setup
// -------------------------------
document.getElementById("quoteDeclined").onclick = function() {
  document.getElementById("eventDate").disabled = false;
  document.getElementById("declineReason").disabled = false;
}
// ----------------------------------
//  Quote expired click event setup
// ----------------------------------
document.getElementById("quoteExpired").onclick = function() {
  document.getElementById("eventDate").disabled = false;
  var reason = document.getElementById("declineReason");
  reason.value = null;
  reason.disabled = true;
}
// ------------------------
//  Pend click event setup
// ------------------------
document.getElementById('pend').onclick = function() {
  // access properties using "this" keyword
  if ( this.checked ) {
    document.getElementById("pendDate").disabled = false;
  }
  else {
    document.getElementById("pendDate").disabled = true;
    document.getElementById("pendDate").value = null;
  }
};

// What about:
// - When contact date enterred the viable becomes active
// - When viable Yes is clicked the quoting section becomes available
// - When accepted is clicked the date and policy section becomes available
// - When decline is clicked the date and and decline reason becomes available
// - When expired is clicked the date becomes available

// ========================
//  Add Lead Orchestration
// ========================
//
// --------------------
//  Open Add Lead Form
// --------------------
function addLead() {
  console.log("---> Add lead started");
  //
  // open modal window
  //
  modal.style.display = "block";
  // Setup add lead form
  document.getElementById("lead-view").style.display = 'block';
  document.getElementById("assign-prompt").style.display = 'block';
  document.getElementById("yesForm").style.display = 'none';
  // Set buttons display state
  document.getElementById("updateLeadButtons").style.display = 'none';
  document.getElementById("practiceLeadButtons").style.display = 'none';
  document.getElementById("adviserLeadButtons").style.display = 'none';
};

// ----------------------
//  Close Add Lead Panel
// ----------------------
function closeAddLead() {
  //
  // Switch menu-view on
  //
  openMenu();
  //
  // Switch Add Lead display off
  //
  viewOff('panelAddLead');
  //
  // Set panel title to default
  //
  panelTitle("Panel Name");
  //
  // Clear previous input
  //
  resetform('addLeadForm');
  //
  // Set start defaults
  //
  viewOff('approval-prompt');
  viewOff('leadAction');
  viewOff('lead-progress');
  viewOff('yesForm');
  viewOff('noForm');
  viewOff('a-pl-types');
  viewOff('a-cl-types');
  viewOff('a-al-types');
  viewOff('a-sl-types');
  viewOff('a-xl-types');
};

// ---------------------------------------------------
//  Set view for selected servicer - Agent or Adviser
// ---------------------------------------------------
function assignFork() {
  //  If Adviser is selected display approval confirmation message
  if (document.getElementById('assign-adviser').checked) {
    // switch on
    document.getElementById('approval-prompt').style.display = 'block';
    // switch off
    document.getElementById('lead-progress').style.display = 'none';
    document.getElementById('addLeadButtons').style.display = 'none';
    document.getElementById("leadErr").innerHTML = "";
  }
  //  If Agent is selected display buttons to create a lead
  else if (document.getElementById('assign-agent').checked) {
    // switch off
    document.getElementById('approval-prompt').style.display = 'none';
    document.getElementById('noForm').style.display = 'none';
    document.getElementById('yesForm').style.display = 'none';
    document.getElementById("trfYes").checked = false;
    document.getElementById("leadErr").innerHTML = "";
    // switch on
    document.getElementById('addLeadButtons').style.display = 'block';
  }
};

// -------------------------------------------
//  Set view view for selected approval state
// -------------------------------------------
function leadOk() {
  if (document.getElementById('trfYes').checked) {
    // switch preferred contact times and location input on
    viewOn('yesForm');
    // switch buttons on
    viewOn('addLeadButtons');
    // switch no approval message off
    viewOff('noForm');
  }
  else if (document.getElementById('trfNo').checked) {
    // switch no approval message on
    viewOn('noForm');
    // switch Yes off
    viewOff('yesForm');
    // switch buttons off
    viewOff('addLeadButtons');
  }
};

// --------------------------
//  Create new lead document
// --------------------------
async function addLeadCtrl() {
  try {
    let result = await submitLead();
    console.log("---> Result", result);
    let prompt;
    if (result === "ok") {
      //
      // New lead created - note new lead has no progress data
      //
      prompt = "Lead created";
      document.getElementById("leadErr").innerHTML = prompt;
      //
      // Adviser selected - lead capture complete, reset lead add form
      //
      if (document.getElementById('assign-adviser').checked){
        document.getElementById("lead-form").reset();
        //document.getElementById("coverForm").reset();
      }
      //
      // Agent selected - lead created, record progress of fulfilment
      //
      else {
        document.getElementById('addLeadButtons').style.display = 'none';
        document.getElementById('lead-progress').style.display = 'block';
        document.getElementById('updateLeadButtons').style.display = 'block';

      }
    }
  }
  catch(err) {
    //
    // lead creation failed
    //
    document.getElementById("leadErr").innerHTML = err;
    alert(err);
  }
};

// ------------------------------
//  Send new lead data to server
// ------------------------------
function submitLead() {
  console.log("*** Add Lead ***");
  return new Promise((resolve, reject) => {
    //
    // Extract new lead's data from DOM
    //
    var leadData = getLeadData("ADD");
    //
    // If data found send to server
    //
    if (leadData !== "error") {
      //
      // Set save request parameters
      //
      var dataString = JSON.stringify(leadData);
      console.log("---> Data String: ", dataString);
      var method = "POST";
      var route = "/leads/add";
      var contentType = "application/json";
      //
      //  Send Lead POST Request to server
      //
      xhrRequest(method, route, contentType, dataString, (err, result) => {
        if (!err) {
          console.log("*** Lead add - success ***");
          var resBody = result.responseText;
          console.log("---> Result response text: ", resBody);
          resolve("ok");
        }
        else {
          console.log("*** Lead add - submit error ***");
          reject("Lead submit error!");
        }
      });
    }
    else {
      console.log("*** Lead add - no data ***");
      reject("no-data");
    }
  });
};

// ==========================
//  Leads List Orchestration
// ==========================

// ------------------------------
//  Display Lead Selection Panel
// ------------------------------
function openLeadsView() {
  //
  // Switch panel-view on
  //
  openPanel();
  //
  // Set panel title
  //
  panelTitle("View Leads");
  //
  // Switch Leads List Panel on
  //
  viewOn('panelViewLead');
  // The leads selection criteria is now displayed
};

function closeViewLeads() {
  //
  // Clear filter selections
  //
  document.getElementById("view-lead-ref-no").value = "";
  document.getElementById("view-lead-con-surname").value = "";
  document.getElementById("view-lead-con-name").value = "";
  document.getElementById("view-lead-org-name").value = "";
  document.getElementById("view-lead-ref-id").value = "";
  //
  // Close panel section and display menu
  //
  openMenu();
};

// -------------------------------------------------------
//  Extract leads based on search criteria & display list
// -------------------------------------------------------
//
// In future this pageing functionality?
//
function listLeads() {
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
      console.log("---> Leads list: ", data);
      if (data.length !== 0) {
        //
        // load report layout definition
        //
        var layoutId = '5';
        var prompt = 'Lead Agent View'; // can see all to answer queries
        //
        // Display Leads List
        //
        console.log("---> Leads list: ", data);
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
};

// ================================
//  Lead Display and Orchestration
// ================================

// ---------------------------------------------
//  Display selected lead's detail in modal box
// ---------------------------------------------
function displayLead(leadRef, viewID) {
  console.log("---> Lead selected (this): ", leadRef);
  //
  // open modal window
  //
  modal.style.display = "block";
  //
  // Setup UI
  //
  // Clear and disable lead progress form input elements
  var fields = document.getElementById("leadProgressForm").getElementsByTagName('input');
  for (var i = 0, len = fields.length; i < len; ++i) {
    fields[i].disabled = true;
    //fields[i].value = null;
    //fields[i].checked = false;
  }
  // Enable lead acceptance or rejection options
  document.getElementById("lead-accept").disabled = false;
  document.getElementById("lead-reject").disabled = false;
  // Show required lead detail
  document.getElementById("lead-view").style.display = 'block';
  // show contact times and location
  document.getElementById("yesForm").style.display = 'block';
  // Show lead progress form
  document.getElementById('lead-progress').style.display = 'block';
  // Don't show
  document.getElementById("assign-prompt").style.display = 'none';
  document.getElementById("updateLeadButtons").style.display = "none";
  document.getElementById("practiceLeadButtons").style.display = "none";
  document.getElementById("adviserLeadButtons").style.display = "none";
  document.getElementById("lead-progress-buttons").style.display = "none";
  // Show required button group
  if (viewID === "1") {
  document.getElementById("practiceLeadButtons").style.display = "block";
  }
  if (viewID === "4") {
  document.getElementById("adviserLeadButtons").style.display = "block";
  }
  if (viewID === "5") {
    document.getElementById("updateLeadButtons").style.display = "block";
  }
  //
  // Set lead data request parameters
  //
  var request = JSON.stringify({reference : leadRef});
  var method = "POST";
  var route = "/leads/lead";
  var contentType = "application/json";
  //
  //  Submit lead data request
  //
  console.log(">>> Request: ", request);
  xhrRequest(method, route, contentType, request, (err, res) => {
    if (!err) {
      var lead = JSON.parse(res.responseText);
      console.log("---> Data returned for selected lead: ", lead);
      //
      // Load lead data into UI display form
      //
      // Insert leads reference dataumber
      //
      // Lead Reference number
      document.getElementById("modal-header-text").innerHTML = "Detail for lead: " + leadRef + " Practice: " + "XYZ " + "Adviser: " + "123";
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
      // Set entity type option in lead form
      //
      if (lead[0].entity.entType === "Person") {
        document.getElementById("person").checked = true;
      }
      else {
        document.getElementById("legal").checked = true;
      }
      //
      // Set previously insured option in lead form
      //
      if (lead[0].previousInsured === "Yes") {
        document.getElementById("insYes").checked = true;
      }
      else {
        document.getElementById("insNo").checked = true;
      }
      //
      // Load text fields of leads form with selected lead's data
      //
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
      // Set selected contact days in lead form
      //
      for (var x = 0, z = lead[0].contactPref.contactDay.length; x < z; x++) {
        //console.log(">>> Contact day: ", x, lead[0].contactPref.contactDay[x]);
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
      //
      // Load lead form with contact time data of selected lead
      //
      document.getElementById("time").value = lead[0].contactPref.time;
      //
      // Set before or after time option in lead form
      //
      if (lead[0].contactPref.timeBA === "before") {
        document.getElementById("before").checked = true;
      }
      if (lead[0].contactPref.timeBA === "after") {
        document.getElementById("after").checked = true;
      }
      //
      // Load lead form with the services data of the selected lead
      //
      var services = lead[0].services;
      console.log("---> Service of selected lead: ", services);
      setServicesView(services, 'v');
      //
      // Load lead form with comment data of selected lead
      //
      document.getElementById("contactComment").value = lead[0].comments.comment1;
      document.getElementById("serviceComment").value = lead[0].comments.comment2;
      //document.getElementById("u6").value = lead[0].comments.comment3;
      //document.getElementById("u6").value = lead[0].comments.comment4;
    }
    else {
      var prompt = "User detail request error";
      document.getElementById("userErr").innerHTML = prompt;
    }
  });
};

// ---------------------------------
//  Send lead update data to server
// ---------------------------------
function updateLead() {
  console.log("*** Update Lead ***");
  //
  // Extract lead update data from DOM
  //
  var leadData = getLeadData("UPDATE");
  //
  // Data extract stopped because of incomplete progress data
  //
  if (typeof leadData === 'string') {
    alert(leadData);
  }
  //
  // Data extracted successfully
  //
  if (leadData !== "error") {
    //
    // Convert data object to JSON data string
    //
    var dataString = JSON.stringify(leadData);
    console.log("---> Update Data String: ", dataString);
    //
    // Set AJAX update request parameters
    //
    var method = "POST";
    var route = "/leads/update";
    var contentType = "application/json";
    //
    //  Submit lead update request to
    //
    console.log("===> Ready to update Lead: ", method, route, contentType, dataString);
    // xhrRequest(method, route, contentType, dataString, (err, result) => {
    //   if (!err) {
    //     //
    //     // Clear form
    //     //
    //     document.getElementById("lead-form").reset();
    //     //
    //     // Close form and modal
    //     //
    //     document.getElementById("lead-view").style.display = 'none';
    //     document.getElementById("lead-progress").style.display = 'none';
    //     document.getElementById("lead-action-buttons").style.display = 'none';
    //     document.getElementById('v-ins-lines').style.display = 'none';
    //     document.getElementById('v-pl-types').style.display = 'none';
    //     document.getElementById('v-cl-types').style.display = 'none';
    //     document.getElementById('v-sl-types').style.display = 'none';
    //     document.getElementById('v-al-types').style.display = 'none';
    //     document.getElementById('v-xl-types').style.display = 'none';
    //     modal.style.display = "none";
    //     //
    //     // Update lead list
    //     //
    //     listLeads();
    //   }
    //   else {
    //     var prompt = "Lead update submit error";
    //     document.getElementById("leadErr").innerHTML = prompt;
    //   }
    // });
  }
  //
  // Data extract failed
  //
  else {
    console.log("*** Lead update failed - no data ***");
  }
};


// ==========================================
//  Lead Data Extract from DOM Orchestration
// ==========================================


// ---------------------------------------------
//  Extract lead data & return lead data object
// ---------------------------------------------
function getLeadData(action){
  console.log("*** Extract lead data from lead form ***");
  //
  //  If ADD extract data from -
  //    lead-form only
  //    set state
  //  If UPDATE extract data from -
  //    lead-form and leadProgressForm
  //    set state
  //
  console.log("---> Lead data extract action value: ", action);
  if (action === "ADD" || action === "UPDATE") {
    //
    // Extract lead data
    //
    console.log("*** Extract lead content data ***");
    var leadContentData = extractLeadContent("lead-form");
    console.log("===> Lead content returned: ", leadContentData);
    //
    // Set state if new lead
    //
    if (action === "ADD") {
      var leadStateData = {
        progress: 'none',
        status: 'open',
        error: ''
      }
      //
      // new lead has no progress data
      //
      var leadProgressData = {};
    }
    if (action === "UPDATE") {
      //
      // Determine lead state
      //
      console.log("*** Determine lead state ***");
      var leadStateData = determineLeadState("leadProgressForm")
      console.log("===> Lead state returned: ", leadStateData);
      // detemineLeadState returns an error as follows:
      //  leadStateData = {progress: '', status: '', error: 'error message text'};
      // then stop process
      if (leadStateData.error !== ""){
        console.log("---> Can't determine state, data incomplete?");
        var leadData = "Problem: " + leadStateData.error;
        return leadData;
      }
      else {
        //
        // Extract progress data
        //
        console.log("*** Extract lead progress data ***");
        var leadProgressData = extractLeadProgress("leadProgressForm");
        console.log("===> Lead progress returned: ", leadProgressData);
      }
    }
    //
    // Combine data into one lead object
    //
    console.log("---> Form data extracted: ", leadContentData);
    console.log("---> Progress data extracted: ", leadProgressData);
    console.log("---> State data extracted: ", leadStateData);
    var leadData = Object.assign(leadContentData, leadProgressData, leadStateData);
    console.log("---> Combined lead document data: ", leadData);
    return leadData;
  }
  else {
    //
    // Error - The action parameter does not contain a valid value
    //
    console.log("*** ERROR: Invalid parameter value ***");
    var leadData = "error";
    return leadData;
  }
}

// --------------------------------------------
//  Extract lead Content data from form in DOM
// --------------------------------------------
function extractLeadContent(formId){
  console.log("*** Started extracting lead content ***");
  console.log("---> Lead State Form: ", formId);
  //
  // Extract form data
  var formData = document.getElementById(formId);
  console.log("---> Form Content Data: ", formData);
  //
  // Define reuseable parameters
  //
  var radioName = "";
  var formElement = "";
  var inputType = "";
  //
  // extract servicer type, i.e. agent or adviser
  //
  radioName = "servicerType";
  var servType = getRadioCheckedValue(formData, radioName);
  console.log("---> Servicer Type: ", servType);
  //
  // extract language preference
  //
  radioName = "langPref";
  var contactLanguage = getRadioCheckedValue(formData, radioName);
  console.log("---> Language: ", contactLanguage);
  //
  // extract entity type
  //
  radioName = "entity";
  var entType = getRadioCheckedValue(formData, radioName);
  console.log("---> Entity Type: ", entType);
  //
  // extract previous insured status
  //
  radioName = "prevIns";
  var previousInsured = getRadioCheckedValue(formData, radioName);
  console.log("---> Previously Insured: ", previousInsured);
  //
  // extract text data from contact form
  //
  formElement = "input";
  inputType = "text";
  var textInfo = extractFormData(formData, formElement, inputType);
  //
  // Certain fields are required for an Adviser but not for an Agent
  //
  if (servType.servicerType === "agent") {
    textInfo.suburb = "n/a";
    textInfo.postalCode = "n/a";
  }
  console.log("---> Text Input: ", textInfo);
  //
  // extract email data from contact form
  //
  formElement = "input";
  inputType = "email";
  var contactEmail = extractFormData(formData, formElement, inputType);
  console.log("---> email: ", contactEmail);
  //
  // extract selected day checkbox values
  //
  var checkboxName = "contactDay";
  var contactDays = getCheckedValues(formData, checkboxName);
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
  var contactTime = extractFormData(formData, formElement, inputType);
  console.log("---> Contact Time: ", contactTime);
  //
  // extract before or after
  //
  radioName = "timeBA";
  var contactTimeBA = getRadioCheckedValue(formData, radioName);
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
  var contactComment = extractFormData(formData, formElement);
  console.log("---> Contact Comment: ", contactComment);

  //
  // extract postal codes
  //
  // formElement = "input";
  // inputType = "number";
  // var contactPostalCode = extractFormData(leadData, formElement, inputType);
  // console.log("---> Postal Codes: ", contactPostalCode);

  //
  // Extract cover required - insurance lines
  //
  var linesCheckboxName = "prodLine";
  console.log("---> Insurance Lines Checkbox Name: ", linesCheckboxName);
  var insLine = getCheckedValues(formData, linesCheckboxName);
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
    // For each insurance line selected extract the selected types
    //
    console.log("---> Insurance Line(s): ", insLine[linesCheckboxName]);
    var lines = insLine[linesCheckboxName];
    console.log("---> Lines Array: ", lines);
    var leadServices = [];
    lines.forEach((element) => {
      var checkboxName = element;
      console.log("---> The Element: ", element);
      var selection = getCheckedValues(formData, checkboxName);
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
  var coverComment = extractFormData(formData, formElement);
  console.log("---> Cover Comment: ", coverComment);
  //
  // Extract transfer approval for servicer "adviser" but not for "agent"
  //
  if (servType.servicerType === "agent") {
    //
    // For "agent" default transfer approval to "No"
    //
    var trfAppr = {};
    trfAppr = "No";
  }
  else {
    //
    // Extract value
    //
    if (document.getElementById('trfYes').checked) {
      var trfAppr = "yes";
    }
    else {
      var trfAppr = "no";
    }
  }
  console.log("---> Transfer Approval: ", trfAppr);

  //
  // Read reference number of lead to update from modal header
  //
  var header = document.getElementById("modal-header-text").innerHTML;
  var leadRef = header.substr(17, 10);
  console.log("Lead Reference: ", leadRef);

  //
  //  Create Lead data object
  //
  var leadData = {
    reference : leadRef,
    langPref: contactLanguage.langPref,
    entity: {
      entType: entType.entity,
      entRefNum: textInfo.entityRefNum
    },
    entityName: textInfo.entityName,
    title: textInfo.conTitle,
    firstName: textInfo.firstname,
    surname: textInfo.surname,
    contactNum: textInfo.contactNum,
    altNumber: textInfo.altNumber,
    cellNumber: textInfo.cellNumber,
    eMail: contactEmail.eMail,
    servicerType: servType.servicerType,
    trfApproval: trfAppr,
    currentInsurer: textInfo.currInsurer,
    previousInsured: previousInsured.prevIns,
    lineOfBusiness: "not in use",
    contactLocation: {
      postal: textInfo.postalCode,
      suburb: textInfo.suburb,
      streetNum: textInfo.streetNum,
      streetName: textInfo.streetName,
      buildingName: textInfo.buildingName,
      floor: textInfo.floor,
      room: textInfo.room
    },
    postBox: {
      postalCode: textInfo.boxPostalCode,
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
  return leadData;
};

// ---------------------------------------------
//  Extract lead progress data from form in DOM
// ---------------------------------------------
function extractLeadProgress(formId){
  console.log("*** Started extracting lead progress content ***");
  console.log("---> Lead progress form: ", formId);
  //
  // Extract form data
  //
  var formData = document.getElementById(formId);
  //
  // Define reuseable parameters
  //
  var radioName = "";
  var formElement = "";
  var inputType = "";
  //
  // Is acceptance state indicated? I.e. has processing started?
  //
  radioName = "leadAccept";
  var acceptance = getRadioCheckedValue(formData, radioName);
  if (acceptance.leadAccept === ""){
    console.log("---> No progress");
    // The lead data was updated but no progress was recorded.
    return {};
  }
  // what if made contact is indicated for example and the adviser forgot to indicate acceptance?
  // control this in the form, i.e. all progress fields are grey out until acceptance is indicated
  // What about agent if agent acceptance must be automatically set.
  //
  if (acceptance.leadAccept === "no"){
    console.log("---> Lead rejected");
    return {
      acceptance: acceptance.leadAccept
    };
  }
  //
  // Has contact mode with prospect, if not record and end
  //
  var noContact = document.getElementById('noContact').checked
  if (noContact === "yes") {
    console.log("---> No contact made, end");
    //
    // Create no contact progress object and return
    //
    var progressData = {
      accepted: acceptance,
      noContact: noContact
    }
    return progressData;
  }
  //
  // Extract text data from progress form
  //
  formElement = "input";
  inputType = "text";
  var progressText = extractFormData(formData, formElement, inputType);
  console.log("---> Text Input: ", progressText);
  //
  // Extract date data from progress form
  //
  formElement = "input";
  inputType = "date";
  var progressDates = extractFormData(formData, formElement, inputType);
  console.log("---> Date Input: ", progressDates);
  //
  // Get viability data
  //
  var radioName = "viability";
  var viableState = getRadioCheckedValue(formData, radioName);
  var viable = viableState.viability;
  console.log("---> Viable: ", viable);
  //
  // Quote state data
  //
  radioName = "acceptance";
  var quoteAcceptanceState = getRadioCheckedValue(formData, radioName);
  var quoteState = quoteAcceptanceState.acceptance;
  console.log("---> Quote state: ", quoteState);
  //
  // Policy premium frequency
  //
  radioName = "frequency";
  var frequencyState = getRadioCheckedValue(formData, radioName);
  var frequency = frequencyState.frequency;
  console.log("---> Premium frequency: ", frequency);
  //
  //  Create lead progress data object
  //
  var progressData = {
    accepted: acceptance.leadAccept,
    rejectReason: progressText.rejectReason,
    contactDate: progressDates.contactDate,
    viable: viable,
    notViableReason: progressText.notViableReason,
    quoteDate: progressDates.quoteDate,
    quoteNum: progressText.quoteNum,
    quoteState: quoteState,
    quoteStateDate: progressDates.eventDate,
    quoteDeclineReason: progressText.declineReason,
    pendDate: progressDates.pendDate,
    policyIssueDate: progressDates.issueDate,
    policyNumber: progressText.polNum,
    policyPremium: progressText.premium,
    policyPremiumFrequency: frequency
  }
  return progressData;
};

// --------------------------------------------------
//  Detemine lead's state from updated progress data
// --------------------------------------------------
function determineLeadState(formId){
  console.log("*** Started determining lead state ***");
  console.log("---> Lead State Form: ", formId);
  //
  // Extract form data
  var formData = document.getElementById(formId);
  //
  // Define reuse parameters
  //
  var formElement, inputType, radioName;
  //
  // Extract Text data from form
  //
  formElement = "input";
  inputType = "text";
  var progressText = extractFormData(formData, formElement, inputType);
  // quoteNum, declineReason, polNum, premium
  console.log("---> Progress Text Input: ", progressText);
  //
  // Extract Date data from form
  //
  formElement = "input";
  inputType = "date";
  var progressDates = extractFormData(formData, formElement, inputType);
  //
  console.log("---> Progress Date Input: ", progressDates);

  // ----------------------------------------------------------------------
  //  Apply state rules to determine lead state and return state as object
  // ----------------------------------------------------------------------
  console.log("*** Apply rules to determine state ***");
  //
  // State 7 - Policy Issued: polNum & issueDate; text, = enterred >> issued --> close
  //
  console.log("*** First Test: Policy Issued ***");
  if (progressDates.issueDate.length !== 0 && progressText.polNum.length !== 0) {
    console.log("---> State 7 - Policy Issued: ", progressDates.issueDate, " ", progressText.polNum);
    radioName = "frequency";
    var frequencyState = getRadioCheckedValue(formData, radioName);
    var frequency = frequencyState.acceptance;
    if (frequency !== "" && progressText.premium.length !== 0) {
      var leadState = {
        progress: 'issued',
        status: 'closed',
        error: ''
      };
      return leadState;
    }
    else {
      var leadState = {
        progress: '',
        status: '',
        error: 'Premium information is required'
      };
      return leadState;
    }
  }
  if (progressDates.issueDate.length !== 0 && progressText.polNum.length === 0) {
    var leadState = {
      progress: '',
      status: '',
      error: 'Policy Issue Date entered but no Policy Number'
    };
    return leadState;
  }
  if (progressDates.issueDate.length === 0 && progressText.polNum.length !== 0) {
    var leadState = {
      progress: '',
      status: '',
      error: 'Policy Number entered but not Policy Issue Date'
    };
    return leadState;
  }


  //
  // State 6 - Quote state: radio = accepted >> accepted --> status; declined >> declined --> close; expired >> expired --> close
  //
  console.log("*** Second Test: Quote state ***");
  radioName = "acceptance";
  var quoteState = getRadioCheckedValue(formData, radioName);
  var acceptance = quoteState.acceptance;
  if (acceptance === "accepted" || acceptance === "declined" || acceptance === "expired") {
    // Repeat prior tests
    if (progressDates.quoteDate.length === 0 && progressText.quoteNum.length === 0 ) {
      var leadState = {
        progress: '',
        status: '',
        error: 'No Quote Date and Quote Number entered'
      };
      return leadState;
    }
    if (progressDates.quoteDate.length !== 0 && progressText.quoteNum.length === 0 ) {
      var leadState = {
        progress: '',
        status: '',
        error: 'Quote Date entered but not Quote Number'
      };
      return leadState;
    }
    if (progressDates.quoteDate.length === 0 && progressText.quoteNum.length !== 0 ) {
      var leadState = {
        progress: '',
        status: '',
        error: 'Quote Number entered but not Quote Date'
      };
      return leadState;
    }
    //
    if (progressDates.eventDate.length === 0) {
      var leadState = {
        progress: '',
        status: '',
        error: 'Quote Event Date not entered'
      };
      return leadState;
    }
    else if (progressDates.eventDate.length !== 0){
      if (acceptance === "accepted") {
        console.log("---> State 6 - Quote state: ", acceptance);
        var leadState = {
          progress: 'accepted',
          status: 'assigned',
          error: ''
        };
        return leadState;
      }
      if (acceptance === "declined"){
        console.log("---> State 6 - Quote state: ", acceptance);
        if (progressText.declineReason.length !== 0) {
          var leadState = {
            progress: 'declined',
            status: 'closed',
            error: ''
          };
          return leadState;
        }
        else {
          var leadState = {
            progress: '',
            status: '',
            error: 'Select quote decline reason'
          };
          return leadState;
        }
      }
      if (acceptance === "expired"){
        console.log("---> State 6 - Quote state: ", acceptance);
        var leadState = {
          progress: 'expired',
          status: 'closed',
          error: ''
        };
        return leadState;
      }
    }
  }
  if (progressDates.eventDate.length !== 0 && acceptance === "" || acceptance === "" || acceptance === "") {
    var leadState = {
      progress: '',
      status: '',
      error: 'Quote Event Date entered but no Acceptance State selected'
    };
    return leadState;
  }

  //
  // State 5 - Quoted: quoteDate & quotNum; Date & Text, enterred >> quoted --> lead assigned
  //
  console.log("*** Third Test: Quoted ***");
  if (progressDates.quoteDate.length !== 0 && progressText.quoteNum.length !== 0 ) {
    console.log("---> State 5 - Quoted: ", progressDates.quoteDate, " ", progressText.quoteNum);
    var leadState = {
      progress: 'quoted',
      status: 'assigned',
      error: ''
    };
    return leadState;
  }
  if (progressDates.quoteDate.length !== 0 && progressText.quoteNum.length === 0 ) {
    var leadState = {
      progress: '',
      status: '',
      error: 'Quote Date entered but not Quote Number'
    };
    return leadState;
  }
  if (progressDates.quoteDate.length === 0 && progressText.quoteNum.length !== 0 ) {
    var leadState = {
      progress: '',
      status: '',
      error: 'Quote Number entered but not Quote Date'
    };
    return leadState;
  }

  //
  // State 4 - Viability of lead: Viability; radio, = yes >> viable --> lead assigned; = no >> not viable --> lead closed
  //
  console.log("*** Fourth Test: Viability ***");
  radioName = "viability";
  var viabilityState = getRadioCheckedValue(formData, radioName);
  var viability = viabilityState.viability;
  if (viability === "yes") {
    console.log("---> State 4 - Viability: ", viability);
    var leadState = {
      progress: 'viable',
      status: 'assigned',
      error: ''
    };
    return leadState;
  }
  else if (viability === "no"){
    console.log("---> State 4 - Viability: ", viability);
    if (progressText.notViableReason.length !== 0){
      var leadState = {
        progress: 'not viable',
        status: 'closed',
        error: ''
      };
      return leadState;
    }
    var leadState = {
      progress: '',
      status: '',
      error: 'Select reason why lead is not viable'
    };
    return leadState;
  }

  //
  // Step 3 - No contact made: noContact; checkbox, = checked >> no contact --> lead closed
  //
  console.log("*** Fifth Test: - No contact ***");
  var noContact = document.getElementById('noContact').checked
  if (noContact) {
    console.log("---> Step 3 - No contact made: ", noContact);
    var leadState = {
      progress: 'no contact',
      status: 'closed',
      error: ''
    };
    return leadState;
  }

  //
  // Step 2 - Made contact: contactedDate; date, = enterred >> contacted --> lead assigned
  //
  console.log("*** Sixth Test: Contact made ***");
  if (progressDates.contactDate.length !== 0) {
    console.log("---> Step 2 - Made contact on: ", progressDates.contactDate);
    var leadState = {
      progress: 'contacted',
      status: 'assigned',
      error: ''
    };
    return leadState;
  }

  //
  // Step 1 - Acceptance: lead-accept; radio, = yes >> accepted --> lead assigned; = no >> rejected --> lead allocated
  //
  console.log("*** Seventh Test: Acceptance ***");
  radioName = "leadAccept";
  var acceptance = getRadioCheckedValue(formData, radioName);
  console.log("---> Step 1 - Acceptance: ", acceptance.leadAccept);
  if (acceptance.leadAccept === "yes") {
    console.log("---> Step 1 - Acceptance = yes");
    var leadState = {
      progress: 'taken',
      status: 'assigned',
      error: ''
    };
    return leadState;
  }
  else if (acceptance.leadAccept === "no"){
    console.log("---> Step 1 - Acceptance = no");
    if (progressText.rejectReason.length !== 0){
      var leadState = {
        progress: 'rejected',
        status: 'allocated',
        error: ''
        // The practice must assigned the lead to another adviser
        // When the practice rejects lead status will be "open"
        // and the lead must be re-allocated to another practice
      };
      return leadState;
    }
    var leadState = {
      progress: '',
      status: '',
      error: 'Reason for rejection not selected'
    };
    return leadState;
  }
  // //
  // // No progress set default state ???????????????????????????????????????????????? remove?
  // //
  // //
  // // Determine lead's current state from module header
  // //
  // var currentStatus = document.getElementById('current-lead-status').value
  // var leadState = {
  //   progress: 'none',
  //   status: currentStatus,
  //   error: ''
  // }
  // return leadState;
};


// ===============================================================================================

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

  // --------------------------------------
//  Display Switches for Lead Cover Form
// --------------------------------------
// function line() {
//   if (document.getElementById('pInsLine').checked) {
//     // switch on
//     document.getElementById('ifPersonal').style.display = 'block';
//     console.log("*** Personal Insurance Selected ***");
//     // switch rest off
//     document.getElementById('ifCommercial').style.display = 'none';
//     document.getElementById('ifSasria').style.display = 'none';
//     document.getElementById('ifAgriculture').style.display = 'none';
//     document.getElementById('ifSpecialist').style.display = 'none';
//   }
//   else if(document.getElementById('cInsLine').checked) {
//     document.getElementById('ifCommercial').style.display = 'block';
//     console.log("*** Commercial Insurance Selected ***");
//     document.getElementById('ifPersonal').style.display = 'none';
//     document.getElementById('ifSasria').style.display = 'none';
//     document.getElementById('ifAgriculture').style.display = 'none';
//     document.getElementById('ifSpecialist').style.display = 'none';
//   }
//   else if(document.getElementById('sInsLine').checked) {
//     document.getElementById('ifSasria').style.display = 'block';
//     console.log("*** SASRIA Insurance Selected ***");
//     document.getElementById('ifPersonal').style.display = 'none';
//     document.getElementById('ifCommercial').style.display = 'none';
//     document.getElementById('ifAgriculture').style.display = 'none';
//     document.getElementById('ifSpecialist').style.display = 'none';
//   }
//   else if(document.getElementById('aInsLine').checked) {
//     document.getElementById('ifAgriculture').style.display = 'block';
//     console.log("*** Agriculture Insurance Selected ***");
//     document.getElementById('ifPersonal').style.display = 'none';
//     document.getElementById('ifCommercial').style.display = 'none';
//     document.getElementById('ifSasria').style.display = 'none';
//     document.getElementById('ifSpecialist').style.display = 'none';
//   }
//   else if(document.getElementById('xInsLine').checked) {
//     document.getElementById('ifSpecialist').style.display = 'block';
//     console.log("*** Specialist Insurance Selected ***");
//     document.getElementById('ifPersonal').style.display = 'none';
//     document.getElementById('ifCommercial').style.display = 'none';
//     document.getElementById('ifSasria').style.display = 'none';
//     document.getElementById('ifAgriculture').style.display = 'none';
//   }
//   document.getElementById('ServiceComment').style.display = 'block';
// }


// // ---------------------------------
// //  Send lead update data to server
// // ---------------------------------
// function updateLeadProgress() {
//   console.log("*** Update Lead Progress ***");
//   //
//   // Extract lead update data from DOM
//   //
//   var progressData = getProgressData();
//   if (progressData !== "error") {
//     updateLead();
//   }
//   else {
//     console.log("*** Progress update failed - no data ***");
//   }
// };