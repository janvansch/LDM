"use strict";
// ===========================================================================
//  Practice View
// ===========================================================================
//
    
// -----------------------------------
//  Display leads for attribute value
// -----------------------------------
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

// ------------------------
//  Display practise leads
// ------------------------
function listLeads(userPracCode) {
    //
    // Switch Leads display on
    //
    document.getElementById('panelLeadList').style.display = 'block';
    //
    // Switch Adviser display off
    //
    document.getElementById('panelAdvList').style.display = 'none';
    //
    // Create Leads Data request
    //
    //var request = "P001";
    var request = userPracCode;
    var method = "GET";
    var route = "/leads/list/" + request;
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
  // ---------------------------
  //  Display practice advisers
  // ---------------------------
  function listAdvisers(userPracCode) {
    //
    // Switch leads Display on
    //
    document.getElementById('panelAdvList').style.display = 'block';
    //
    // Switch Practise Maintenance Display off
    //
    document.getElementById('panelLeadList').style.display = 'none';
    //
    // Create adviser data request
    //
  
    // var practice = {
    //   practiceCode : 'P001'
    // };
    // var request = JSON.stringify(practice);
    //var method = "POST";
  
    //var request = "P001";
    var request = userPracCode;
    var method = "GET";
    var route = "/users/advisers/" + request;
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