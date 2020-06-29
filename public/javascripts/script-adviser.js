"use strict";
// ===========================================================================
//  Adviser View
// ===========================================================================
//
// ------------------------------
//  Display Lead Selection Panel
// ------------------------------
// function openAdvLeadsView(user) {
//   //
//   // Switch panel-view on
//   //
//   openPanel();
//   //
//   // Set panel title
//   //
//   panelTitle("View Adviser Leads");
//   //
//   // Switch Leads List Panel on
//   //
//   viewOn('panelViewLead');
//   // The leads selection criteria is now displayed
//   // Because this is for an adviser an additional hidden filter must be applied, the adviser's id
// };

// function closeViewLeads() {
//   //
//   // Clear filter selections
//   //
//   document.getElementById("view-lead-ref-no").value = "";
//   document.getElementById("view-lead-con-surname").value = "";
//   document.getElementById("view-lead-con-name").value = "";
//   document.getElementById("view-lead-org-name").value = "";
//   document.getElementById("view-lead-ref-id").value = "";
//   //
//   // Close panel section and display menu
//   //
//   openMenu();
// };


// // -----------------------
// //  Display adviser leads
// // -----------------------
// function listAdvLeads(user) {
//   console.log(">>> User Id: ", user);
//     //
//     // Switch Adviser Leads display on
//     //
//     document.getElementById('panelAdvLeads').style.display = 'block';
//     //
//     // Switch Adviser Clients display off
//     //
//     //document.getElementById('panelAdvClients').style.display = 'none';
//     //
//     // Create Leads Data request
//     //
//     var request = user;
//     var method = "GET";
//     var route = "/leads/list/" + request;
//     var contentType = "application/json";
//     //
//     //  Request lead data from server
//     //
//     xhrRequest(method, route, contentType, request, (err, res) => {
//       if (!err) {
//         var data = JSON.parse(res.responseText);
//         console.log(">>> lead Docs: ", data);
//         //
//         // load report layout definition
//         //
//         var layoutId = '4';
//         var prompt = 'Lead for Adviser: ' + request;
//         //
//         // Display Leads List
//         //
//         displayData(data, prompt, layoutId);
//         //
//         // Add row select handlers to enable editing of rows
//         //
//         addRowHandlers(layoutId);
//       }
//       else {
//         var prompt = "Lead request error";
//         document.getElementById("leadErr").innerHTML = prompt;
//       }
//     });
//   }