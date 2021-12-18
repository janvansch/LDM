"use strict";

// ======================================
//  Practice View Click Event Controller
// ======================================

// -------------------------
//  Assign lead click event
// -------------------------
if (document.getElementById("assignLead")) {
  document.getElementById("assignLead").addEventListener("click", function() {
    displaySkilledAdvisers();
  });
}

// -----------------------------------------------------------
//  Postal codes serviced by practice maintenace click events
// -----------------------------------------------------------
var linkRef = document.getElementById('add-pcode');
if (linkRef) {
  linkRef.addEventListener("click", () => addPostalCode());
}

var linkRef = document.getElementById('update-pcode');
if (linkRef) {
  linkRef.addEventListener("click", () => amendPostalCodeList('update'));
}

var linkRef = document.getElementById('remove-pcode');
if (linkRef) {
  linkRef.addEventListener("click", () => amendPostalCodeList('remove'));
}

// ----------------------------------
//  Practice maintenace click events
// ----------------------------------
var linkRef = document.getElementById('formAddPractice');
if (linkRef) {
  linkRef.addEventListener("click", () => submitPractice('add'));
}

var linkRef = document.getElementById('formUpdatePractice');
if (linkRef) {
  linkRef.addEventListener("click", () => submitPractice('update'));
}

var linkRef = document.getElementById('formDeletePractice');
if (linkRef) {
  linkRef.addEventListener("click", () => deletePractice());
}

// ===========================================================================
//  Practice View Controller - Leads Functionality (leads route and model)
// ===========================================================================

// ------------------
//  Close leads view
// ------------------
function leadsViewOff() {
  //
  // Clear filter selections
  //
  document.getElementById("lead-assign-ref-filter").value = "";
  document.getElementById("lead-assign-language-filter").value = "";
  document.getElementById("lead-assign-postal-filter").value = "";
  document.getElementById("lead-assign-suburb-filter").value = "";
  document.getElementById("lead-assign-service-filter").value = "";
  //
  // Close list view
  //
  viewOff('panelLeadList');
  //
  // Close panel section and display menu
  //
  openMenu();
};

// -------------------------------------------------------------------------------
//  Display practise leads in "allocated" status to enable assignment to advisers
// -------------------------------------------------------------------------------
function allocatedLeadsView() {
  console.log("*** Practice Allocated Leads Display Started");
  //
  // Other panels off
  //
  viewOff('panelAdvList');
  viewOff('panelViewLead');
  //
  // Switch panel-view on
  //
  openPanel();
  //
  // Set panel title
  //
  panelTitle( "Allocated Leads");
  //
  // Switch Leads List Panel on
  //
  viewOn('panelLeadList');
  //
  // Get User Practice Code
  //
  //var userId = sessionStorage.getItem('userId');
  //var userRole = sessionStorage.getItem('userRole');
  var userPracticeCode = sessionStorage.getItem('userPracticeId');
  //
  // Set selection criteria
  //
  var criteria = {
    allocatedPractice : userPracticeCode,
    currentStatus: "allocated"
  };
  console.log("​---> Request filter: ", criteria)
  //
  // Create Leads Data request
  //
  var request = JSON.stringify(criteria);
  var method = "GET";
  var route = "/leads/list/";
  var contentType = "application/json";
  //
  //  Request lead data from server
  //
  xhrRequest(method, route, contentType, request, (err, res) => {
    if (!err) {
      var data = JSON.parse(res.responseText);
      console.log("===> Allocated leads returned: ", data);
      if (data.length !== 0) {
        //
        // load report layout definition
        //
        var layoutId = '1';
        var title = 'Allocated Leads for practice: ' + userPracticeCode;
        //
        // Display Leads List
        //
        displayData(data, title, layoutId);
        //
        // Add row select handlers to enable editing of rows
        //
        addRowHandlers(layoutId);
      }
      else {
        document.getElementById("tPos1").innerHTML = "None found";
      }
    }
    else {
      alert("Allocated Leads request error");
    }
  });
}

// ------------------------------------------------------
//  Determine services required by the lead being viewed
// ------------------------------------------------------
function leadServices() {
  console.log("*** Determine Skills Started ***");
  //
  // Read services requested from lead modal form
  //
  let formData = document.getElementById("lead-form");
  let linesCheckboxName = "prodLine";
  let insLine = getCheckedValues(formData, linesCheckboxName);
  if (Object.keys(insLine).length === 0 && insLine.constructor === Object) {
    //
    // Error - no insurance line found
    //
    alert("ERROR: No insurance Line found");
    return ("Err");
  }
  else {
    //
    // For each insurance line found extract the selected types from modal form
    //
    let lines = insLine[linesCheckboxName];
    let leadServices = [];
    lines.forEach((element) => {
      let checkboxName = element;
      let selection = getCheckedValues(formData, checkboxName);
      if (Object.keys(selection).length === 0 && selection.constructor === Object) {
        //
        // Error - no insurance line found
        //
        alert("ERROR: No insurance Type found");
        return ("Err");
      }
      else {
        let serviceItem = {
          line : element,
          types : selection[element]
        };
        leadServices.push(serviceItem);
      }
    });
    console.log("===> Lead Services: ", leadServices);
    return (leadServices);
  }
};

// -------------------------------------
//  Link selected adviser to the lead
// -------------------------------------
function linkAdviser(userId) {
  console.log("===> Assign Selected Adviser Started");
  //
  // Get lead Id
  //
  let leadId = sessionStorage.getItem('reference');
  //
  // Format Request
  //
  console.log(`---> Request properties - lead ID: ${leadId}, User Id: ${userId}`);
  var req = {reference: leadId, assignedAdviser: userId};
  var method = "POST";
  var route = "/leads/linkAdviser";
  var contentType = "application/json";
  var request = JSON.stringify(req);
  //
  //  Send Allocate Request
  //
  xhrRequest(method, route, contentType, request, (err, res) => {
    if (!err) {
      var resBody = res.responseText;
      //console.log(`>>> Result returned: Header = ${resHeader}, Body = ${resBody}`);
      console.log(`>>> Result returned: Body = ${resBody}`);
      console.log("*** SUCCESS: Adviser Assignment Completed ***");
      //
      // Clear form
      //
      //document.getElementById("lead-form").reset();
      resetForm('lead-form');
      //
      // Close form and modal
      //
      document.getElementById("lead-view").style.display = 'none';
      document.getElementById("lead-progress").style.display = 'none';
      document.getElementById("updateLeadButtons").style.display = 'none';
      document.getElementById("practiceLeadButtons").style.display = 'none';
      document.getElementById("adviserLeadButtons").style.display = 'none';

      viewOff('v-pl-types');
      viewOff('v-cl-types');
      viewOff('v-al-types');
      viewOff('v-sl-types');
      viewOff('v-xl-types');

      modal.style.display = 'none';
      //
      // Clear modal Header
      //
      document.getElementById("modal-header-text").innerHTML =
        `Detail for lead: new,
        Status:  - ,
        Transfer: - ,
        Servicer: - ,
        Practice: - `;
      //
      // Update lead list
      //
      allocatedLeadsView();
    }
    else {
      var prompt = "Adviser assignment failed";
      document.getElementById("errMsg").innerHTML = prompt;
    }
  });
}

// ===========================================================================
//  Practice View Controller - Adviser Functionality (user route & model)
// ===========================================================================
//
// --------------------
//  Close adviser view
// --------------------
function AdvViewOff() {
  //
  // Clear filter selections
  //
  //document.getElementById("prac-lead-ref-filter").value = "";
  //document.getElementById("prac-lead-status-filter").value = "";
  //document.getElementById("prac-lead-adviser-filter").value = "";
  //
  // Close list view
  //
  viewOff('panelAdvList');
  //
  // Close panel section and display menu
  //
  openMenu();
};

// ---------------------------
//  Display practice advisers
// ---------------------------
function listAdvisers() {
  console.log("*** Start Adviser List Display ***");
  //
  // Other panels off
  //
  viewOff('panelLeadList');
  viewOff('panelViewLead');
  //
  // Switch panel-view on
  //
  openPanel();
  //
  // Set panel title
  //
  panelTitle( "Practice Advisers");
  //
  // Switch Leads List Panel on
  //
  viewOn('panelAdvList');
  //
  // User Information
  //
  var userId = sessionStorage.getItem('userId');
  var userRole = sessionStorage.getItem('userRole');
  var userPracticeCode = sessionStorage.getItem('userPracticeId');

  var request = userPracticeCode;
  var method = "GET";
  var route = "/users/advisers/";
  var contentType = "application/json";
  //
  //  Request adviser user data from server
  //
  xhrRequest(method, route, contentType, request, (err, res) => {
    if (!err) {
      var data = JSON.parse(res.responseText);
      console.log(">>> lead Docs: ", data);
      //
      // load report layout definition
      //
      var layoutId = '3';
      var prompt = 'Advisers of practice: ' + request;
      //
      // Display Adviser List
      //
      displayData(data, prompt, layoutId);
      //
      // Add row select handlers to enable editing of rows
      //
      addRowHandlers(layoutId);
    }
    else {
      var prompt = "Adviser request error";
      document.getElementById("leadErr").innerHTML = prompt;
    }
  });
};

// ---------------------------------------------------------------------------------
//  Get list of advisers in the practice that are qualified in the required service
// ---------------------------------------------------------------------------------
function displaySkilledAdvisers() {
  console.log("*** Find Skills Advisers Started ***");
  //
  // First determine requires services
  //
  let reqServices = leadServices();
  if (reqServices !== "Err"){
    //
    // Now find practice advisers qualified to provide the service
    //
    let practiceId = sessionStorage.getItem('userPracticeId');
    let criteria = {practice : practiceId, services : reqServices}
    let request = JSON.stringify(criteria);
    let method = "GET";
    let route = "/users/skilled/";
    let contentType = "application/json";
    console.log("---> Adviser selection criteria: ", request);
    //
    //  Request data from server
    //
    xhrRequest(method, route, contentType, request, (err, res) => {
      if (!err) {
        let list = JSON.parse(res.responseText);
        console.log("===> Adviser list: ", list);
        //
        // load list layout definition
        //
        let layoutId = '7';
        let prompt = "Qualified Advisers List";
        //
        // Display list of qualified advisers
        //
        viewOn('skilled-adv');
        displayData(list, prompt, layoutId);
        //
        // Add row select handlers to enable editing of rows
        //
        addRowHandlers(layoutId);
      }
      else {
        let prompt = "Skilled Advisers Request Failed";
        document.getElementById("leadErr").innerHTML = prompt;
        console.log("===> Process Stopped: Find Skills Advisers - data request failed!");
      }
    });
  }
  else {
    console.log("===> Process Stopped: Find Skills Advisers - No service data found!");
  }
};



    //
    // Update adviser stats
    //

    //
    // Assign selected adviser to lead server - request to update lead
    //

    // Lead.assignedAdviser = selectedAdviser;
    // Lead.currentStatus = "assigned";
    // Lead.statusHistory = update;     value.push("none selected");

    // Close modal

    // display list (retain filter?)




/*
Adviser Rating System Concept
Rules:
 - The adviser starts with 10 point
 - For every lead assigned to the adviser that is viable but is not converted -1 point
 - For every lead converted +5 points
 - Can accumalate a maximum of 20 points
 - Everbody on and above 10 points stand an equal change of being selected
 - SLA non-compliance -1 point
 - Documentation non-compliance -2 points
*/