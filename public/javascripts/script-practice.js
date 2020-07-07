"use strict";

// ===========================================================================
//  Practice View
// ===========================================================================
//
function leadsViewOff() {
  //
  // Clear filter selections
  //
  document.getElementById("prac-lead-ref-filter").value = "";
  document.getElementById("prac-lead-status-filter").value = "";
  document.getElementById("prac-lead-adviser-filter").value = "";
  //
  // Close list view
  //
  viewOff('panelLeadList');
  //
  // Close panel section and display menu
  //
  openMenu();
};
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
/*
// -----------------------------------------------------------------------------
//  Extract set of leads and display in a table using selected loayout template
// -----------------------------------------------------------------------------
function displayLeadsSet(attribute, value) {
  //
  // Switch Leads display on
  //
  document.getElementById('panelLeadList').style.display = 'block';
  //
  // Switch Adviser display off
  //
  document.getElementById('panelAdvList').style.display = 'none';
  //
  //  create request object
  //
  var reqObj = {
    attribute : attribute,
    value : value
  };
  console.log(">>> Request: ", dataString);
  //
  // Create Leads Data request
  //
  var request = JSON.stringify(reqObj);
  var method = "POST";
  var route = "/leads/leadSet/";
  var contentType = "application/json";
  //
  //  Request lead data from server
  //
  xhrRequest(method, route, contentType, request, (err, res) => {
    if (!err) {
      var data = JSON.parse(res.responseText);
      console.log(">>> lead Docs: ", data);
      //
      // load report layout definition
      //
      var layoutId = '1';
      var prompt = 'Leads for practice: ' + request;
      //
      // Display Leads List
      //
      displayData(data, prompt, layoutId);
      //
      // Add row select handlers to enable row selection
      //
      addRowHandlers(layoutId);
    }
    else {
      var prompt = "Lead request error";
      document.getElementById("leadErr").innerHTML = prompt;
    }
  });
}
*/
// ---------------------------------------------------------
//  Display practise leads to enable assignment to advisers
// ---------------------------------------------------------
function pracLeadsView() {
  console.log("*** Practice Leads Display Started");
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
  panelTitle( "*** Allocated Leads List ***");
  //
  // Switch Leads List Panel on
  //
  viewOn('panelLeadList');
  //
  // User Information
  //
  var userId = sessionStorage.getItem('userId');
  var userRole = sessionStorage.getItem('userRole');
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
        document.getElementById("tPos").innerHTML = "None found";
      }
    }
    else {
      alert("Allocated Leads request error");
    }
  });
}

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
  panelTitle( "*** Allocated Leads List ***");
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
  //  Request lead data from server
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
      var prompt = "Lead request error";
      document.getElementById("leadErr").innerHTML = prompt;
    }
  });
}

// --------------------------
//  Assign Adviser to Lead
// --------------------------
function assignAdviser() {
  console.log("===> Allocate Adviser Started");
  //
  // Format Request
  //
  var message = {message : "Adviser allocated"};
  var method = "POST";
  var route = "/leads/allocateAdviser";
  var contentType = "application/json";
  var request = JSON.stringify(message);
  //
  //  Send Allocate Request
  //
  xhrRequest(method, route, contentType, request, (err, res) => {
    if (!err) {
      var resBody = res.responseText;
      //console.log(`>>> Result returned: Header = ${resHeader}, Body = ${resBody}`);
      console.log(`>>> Result returned: Body = ${resBody}`);
      displayLeads();
    }
    else {
      var prompt = "Lead submit error";
      document.getElementById("leadErr").innerHTML = prompt;
    }
  });
}