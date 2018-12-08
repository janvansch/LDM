"use strict";
// ===========================================================================
//  Adviser View
// ===========================================================================
//
// ------------------------
//  Display adviser leads
// ------------------------
function listAdvLeads() {
    //
    // Switch leads Display on
    //
    document.getElementById('panelAdvLeads').style.display = 'block';
    // //
    // // Switch Practise Maintenance Display off
    // //
    // document.getElementById('panelAdvMaint').style.display = 'none';
    //
    // Create Leads Data request
    //
    var request = "XXXX";
    var method = "GET";
    var route = "/leads/list";
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
        var prompt = 'Lead data for: ' + request;
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