"use strict";

// ============================================================================
//  Click Event Orchestration for Lead UI controls
// ============================================================================
//
// the preferred way: element.addEventListener('click', myFunctionReference , false);
//
// --------------------------------
//  Information popup open & close
// --------------------------------
if (document.getElementById("infoIcon")) {
  document.getElementById("infoIcon").addEventListener("click", function() {
    viewOn("infoPopup");
  });
  document.getElementById("infoClose").addEventListener("click", function() {
    viewOff("infoPopup");
  });
}
// -------------------------------
//  Lead UI button events control
// -------------------------------
if (document.getElementById("btn-add-lead")) {
  document.getElementById("btn-add-lead").addEventListener("click", function() {
    addLeadCtrl();
  });
}
if (document.getElementById("btn-clear-form")) {
  document.getElementById("btn-clear-form").addEventListener("click", function() {
    resetForm('lead-form');
  });
}
if (document.getElementById("updateLead")) {
  document.getElementById("updateLead").addEventListener("click", function() {
    updateLead();
  });
}
// -------------------------------
//  Lead accept click event setup
// -------------------------------
if (document.getElementById("lead-accept")) {
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
}
// -------------------------------
//  Lead reject click event setup
// -------------------------------
if (document.getElementById("lead-reject")) {
  document.getElementById("lead-reject").onclick = function() {
    var accept = document.getElementsByClassName("accept-yes");
    for (var i = 0; i < accept.length; i++) {
      accept[i].disabled = true;
    }
    document.getElementById("rejectReason").disabled = false;
  }
}
// ------------------------------
//  No contact click event setup
// ------------------------------
if (document.getElementById('noContact')) {
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
}
// -------------------------------
//  Lead viable click event setup
// -------------------------------
if (document.getElementById("viable")) {
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
}
// -------------------------------
//  Lead not viable click event setup
// -------------------------------
if (document.getElementById("not-viable")) {
  document.getElementById("not-viable").onclick = function() {
    document.getElementById("not-viable-reason").disabled = false;
    var accept = document.getElementsByClassName("accept-yes");
    for (var i = 0; i < accept.length; i++) {
      accept[i].disabled = true;
    }
    document.getElementById("viable").disabled = false;
    document.getElementById("not-viable").disabled = false;
    document.getElementById("lead-accept").disabled = true;
    document.getElementById("lead-reject").disabled = true;
  }
}
// ----------------------------------
//  Quote accepted click event setup
// ----------------------------------
if (document.getElementById("quoteAccepted")) {
  document.getElementById("quoteAccepted").onclick = function() {
    document.getElementById("eventDate").disabled = false;
    var reason = document.getElementById("declineReason");
    reason.value = null;
    reason.disabled = true;
  }
}
// -------------------------------
//  Lead declined click event setup
// -------------------------------
if (document.getElementById("quoteDeclined")) {
  document.getElementById("quoteDeclined").onclick = function() {
    document.getElementById("eventDate").disabled = false;
    document.getElementById("declineReason").disabled = false;
  }
}
// ----------------------------------
//  Quote expired click event setup
// ----------------------------------
if (document.getElementById("quoteExpired")) {
  document.getElementById("quoteExpired").onclick = function() {
    document.getElementById("eventDate").disabled = false;
    var reason = document.getElementById("declineReason");
    reason.value = null;
    reason.disabled = true;
  }
}
// ------------------------
//  Pend click event setup
// ------------------------
if (document.getElementById('pend')) {
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
}

// What about:
// - When contact date enterred the viable becomes active
// - When viable Yes is clicked the quoting section becomes available
// - When accepted is clicked the date and policy section becomes available
// - When decline is clicked the date and and decline reason becomes available
// - When expired is clicked the date becomes available

// ============================================================================
//  Leads Display Orchestration
// ============================================================================

// ---------------------------------------
//  Display lead selection criteria panel
// ---------------------------------------
function openLeadsView(title) {
  //
  // Switch panel-view on for Agent
  //
  openPanel();
  //
  // Set panel title
  //
  panelTitle( title + " Leads View");
  //
  // Switch Leads List Panel on
  //
  viewOn('panelViewLead');
  // The leads selection criteria is now displayed
  // Restore comment
  document.getElementById("tPos").innerHTML = 'Enter lead selection criteria and click "Find"';
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
// In future use pageing functionality?
//
function listLeads() {
  console.log("*** List Leads ***");
  //
  // User Information
  //
  var userId = sessionStorage.getItem('userId');
  var userRole = sessionStorage.getItem('userRole');
  var userPracticeId = sessionStorage.getItem('userPracticeId');

  // var str = document.getElementById("user").innerHTML;
  // var start = str.indexOf('(') + 1;
  // if (str.indexOf(':') !== -1){
  //   var end = str.indexOf(':') - 1;
  // }
  // else {
  //   var end = str.length - 1;
  // }
  // var role = str.substring(start, end);
  // console.log("​---> User Role: ", role);

  //
  // Set selection criteria, list column layout and list header based on role
  //
  switch (userRole) {
    case 'adviser':
      var criteria = {
        // selected by user
        refNo : document.getElementById('view-lead-ref-no').value,
        contactSurname : document.getElementById('view-lead-con-surname').value,
        contactFirstName : document.getElementById('view-lead-con-name').value,
        entityName : document.getElementById('view-lead-org-name').value,
        entityRefNum : document.getElementById('view-lead-ref-id').value,
        // set defaults
        assignedAdviser : userId,
        allocatedPractice : ""
      };
      var layoutId = '4';
      var title = "Adviser Leads View";
      break; //-----------------------------------------------------
    case 'agent':
      var criteria = {
        // selected by user
        refNo : document.getElementById('view-lead-ref-no').value,
        contactSurname : document.getElementById('view-lead-con-surname').value,
        contactFirstName : document.getElementById('view-lead-con-name').value,
        entityName : document.getElementById('view-lead-org-name').value,
        entityRefNum : document.getElementById('view-lead-ref-id').value,
        // set defaults
        assignedAdviser : "",
        allocatedPractice : ""
      };
      var layoutId = '5';
      var title = "Agent Leads View";
      break; //-----------------------------------------------------
      case 'practice':
        var criteria = {
          // selected by user
          refNo : document.getElementById('view-lead-ref-no').value,
          contactSurname : document.getElementById('view-lead-con-surname').value,
          contactFirstName : document.getElementById('view-lead-con-name').value,
          entityName : document.getElementById('view-lead-org-name').value,
          entityRefNum : document.getElementById('view-lead-ref-id').value,
          // set defaults
          assignedAdviser : "",
          allocatedPractice : userPracticeId
        };
        var layoutId = '6';
        var title = "Practice Leads View";
        break; //-----------------------------------------------------
    default:
    var layoutId = '5';
    var title = "List of Leads";
    console.log("*** ERROR: Default, role not found", userRole)
  }
  //
  // Create data request
  //
  var request = JSON.stringify(criteria);
  //var request = criteria.refNo;
	console.log("​---> Request filter: ", request)
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
        // Display Leads List
        //
        console.log("---> Title: ", title);
        console.log("---> Layout: ", layoutId);
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
      alert("Lead request error");
    }
  });
};

// ---------------------------------------------
//  Display selected lead's detail in modal box
// ---------------------------------------------
function displayLead(leadRef, viewId) {
  console.log("---> Lead selected (this): ", leadRef, "View Id: ", viewId);
  //
  // Set lead reference in session storage
  //
  sessionStorage.setItem('reference', leadRef);
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
  // Don't show
  document.getElementById("assign-prompt").style.display = 'none';
  document.getElementById("addLeadButtons").style.display = "none";
  document.getElementById("updateLeadButtons").style.display = "none";
  document.getElementById("practiceLeadButtons").style.display = "none";
  document.getElementById("adviserLeadButtons").style.display = "none";
  document.getElementById("lead-progress-buttons").style.display = "none";
  //
  // Set view specific elements
  //
  if (viewId === "1") {
    // Don't show lead progress form
    // Show required button group
    document.getElementById("practiceLeadButtons").style.display = "block";
  }
  if (viewId === "4") {
    // Show lead progress form
    document.getElementById('lead-progress').style.display = 'block';
    // Show required button group
    document.getElementById("adviserLeadButtons").style.display = "block";

  }
  if (viewId === "5") {
    // Show lead progress form
    document.getElementById('lead-progress').style.display = 'block';
    // Show required button group
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
      //
      // Request successful load lead data into modal display
      //
      var lead = JSON.parse(res.responseText);
      console.log("*** SUCCESS: Data returned for selected lead ***");
      console.log("---> Data returned for selected lead: ", lead[0]);
      //
      // Extract data for modal header
      //
      var len = lead[0].statusHistory.length;
      var status = lead[0].statusHistory[len - 1].status;
      var servicerType = lead[0].servicerType;
      var trfApproval = lead[0].trfApproval;
      var practice = lead[0].allocatedPractice;
      var adviser = lead[0].assignedAdviser;
      //
      // Store non-form items for use by update
      //
      sessionStorage.setItem('reference', leadRef)
      sessionStorage.setItem('servicerType', servicerType);
      sessionStorage.setItem('trfApproval', trfApproval);
      sessionStorage.setItem('allocatedPractice', practice);
      sessionStorage.setItem('assignedAdviser', adviser);
      // Display stored values
      for(let i=0; i<sessionStorage.length; i++) {
        let key = sessionStorage.key(i);
        console.log(`${key}: ${sessionStorage.getItem(key)}`);
      }
      //
      // Set modal header
      //
      if (status === "open"){document.getElementById("modal-header-text").innerHTML =
          `Detail for lead: ${leadRef},
          Status: ${status},
          Transfer: ${trfApproval},
          Servicer: ${servicerType}`;
      }
      else if (status === "allocated") {document.getElementById("modal-header-text").innerHTML =
          `Detail for lead: ${leadRef},
          Status: ${status},
          Transfer: ${trfApproval},
          Servicer: ${servicerType},
          Practice: ${practice}`;
      }
      else if (status === "assigned") {document.getElementById("modal-header-text").innerHTML =
          `Detail for lead: ${leadRef},
          Status: ${status},
          Transfer: ${trfApproval},
          Servicer: ${servicerType}: ${adviser},
          Practice: ${practice}`;
      }
      else {document.getElementById("modal-header-text").innerHTML =
          `Detail for lead: ${leadRef},
          Status: ${status},
          Transfer: ${trfApproval},
          Servicer: ${servicerType}: ${adviser},
          Practice: ${practice}`;
    }
      //
      // Set state of radio & checkbox elements
      //
      // Set language radio buttons
      if (lead[0].langPref === "English") {
        document.getElementById("eng").checked = true;
      }
      else {
        document.getElementById("afr").checked = true;
      }
      // Set entity type radio buttons
      if (lead[0].entity.entType === "Person") {
        document.getElementById("person").checked = true;
      }
      else {
        document.getElementById("legal").checked = true;
      }
      // Set previously insured radio buttons
      if (lead[0].previousInsured === "Yes") {
        document.getElementById("insYes").checked = true;
      }
      else {
        document.getElementById("insNo").checked = true;
      }
      // Set contact days checkboxes
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
      // Set before or after radio buttons
      if (lead[0].contactPref.timeBA === "at") {
        document.getElementById("at").checked = true;
      }
      if (lead[0].contactPref.timeBA === "before") {
        document.getElementById("before").checked = true;
      }
      if (lead[0].contactPref.timeBA === "after") {
        document.getElementById("after").checked = true;
      }
      // Set service checkboxes for services requires
      var services = lead[0].services;
      setServicesView(services, 'v');
      //
      // fill text elements
      //
      document.getElementById("conTitle").value = lead[0].title;
      document.getElementById("conFirstName").value = lead[0].firstName;
      document.getElementById("conSurname").value = lead[0].surname;
      document.getElementById("conTelNum").value = lead[0].contactNum;
      document.getElementById("conAltNum").value = lead[0].altNumber;
      document.getElementById("conCellNum").value = lead[0].cellNumber;
      document.getElementById("conEMail").value = lead[0].eMail;
      document.getElementById("currInsurer").value = lead[0].currentInsurer;
      document.getElementById("entityRefNum").value = lead[0].entity.entRefNum;
      document.getElementById("entityName").value = lead[0].entityName;
      document.getElementById("business").value = lead[0].lineOfBusiness;
      document.getElementById("conPostCode").value = lead[0].contactLocation.postal;
      document.getElementById("conSuburb").value = lead[0].contactLocation.suburb;
      document.getElementById("conStreetNum").value = lead[0].contactLocation.streetNum;
      document.getElementById("conStreetName").value = lead[0].contactLocation.streetName;
      document.getElementById("conBuildName").value = lead[0].contactLocation.buildingName;
      document.getElementById("conBuildFloor").value = lead[0].contactLocation.floor;
      document.getElementById("conBuildRoom").value = lead[0].contactLocation.room;
      document.getElementById("conBoxPostCode").value = lead[0].postBox.postalCode;
      document.getElementById("conBoxNum").value = lead[0].postBox.boxNumber;
      document.getElementById("time").value = lead[0].contactPref.time;
      document.getElementById("contactComment").value = lead[0].comments.comment1;
      document.getElementById("serviceComment").value = lead[0].comments.comment2;
      //
      // Set progress radio & checkbox elements
      //
      // Set accepted radio buttons
      if (lead[0].accepted === "yes") {
        document.getElementById("lead-accept").checked = true;
        //
        // if accepted enable progress fields
        //
        var accept = document.getElementsByClassName("accept-yes");
        for (var i = 0; i < accept.length; i++) {
          accept[i].disabled = false;
        }
      }
      if (lead[0].accepted === "no") {
        document.getElementById("lead-rejected").checked = true;
      }
      // Set no contact checkbox
      if (lead[0].noContact === true) {
        document.getElementById("noContact").checked = true;
      }
      // Set viable radio buttons
      if (lead[0].viable === "yes") {
        document.getElementById("viable").checked = true;
      }
      if (lead[0].viable === "no") {
        document.getElementById("not-viable").checked = true;
      }
      // Set quote state radio buttons
      if (lead[0].quoteState === "accepted") {
        document.getElementById("quoteAccepted").checked = true;
      }
      if (lead[0].quoteState === "declined") {
        document.getElementById("quoteDeclined").checked = true;
      }
      if (lead[0].quoteState === "expired") {
        document.getElementById("quoteExpired").checked = true;
      }
      // Set pend checkbox
      console.log("---> Pend date: ", lead[0].pendDate);
      if (lead[0].pendDate !== undefined && lead[0].pendDate !== null && lead[0].pendDate !== "") {
        document.getElementById("pend").checked = true;
      }
      // Set premium frequency
      if (lead[0].policyPremiumFrequency === "annually") {
        document.getElementById("annually").checked = true;
      }
      if (lead[0].policyPremiumFrequency === "monthly") {
        document.getElementById("monthly").checked = true;
      }
      //
      // fill progress data field elements var leadRef = header.substr(17, 10);
      //
      document.getElementById("rejectReason").value = lead[0].rejectReason !== undefined ? lead[0].rejectReason : null;
      document.getElementById("contactDate").value = lead[0].contactDate !== undefined && lead[0].contactDate !== null ? lead[0].contactDate.substr(0, 10) : null;
      document.getElementById("not-viable-reason").value = lead[0].notViableReason !== undefined ? lead[0].notViableReason : null;
      document.getElementById("quoteDate").value = lead[0].quoteDate !== undefined && lead[0].quoteDate !== null ? lead[0].quoteDate.substr(0, 10) : null;
      document.getElementById("quoteNum").value = lead[0].quoteNumber !== undefined ? lead[0].quoteNumber : null;;
      document.getElementById("eventDate").value = lead[0].quoteStateDate !== undefined && lead[0].quoteStateDate !== null ? lead[0].quoteStateDate.substr(0, 10) : null;;
      document.getElementById("declineReason").value = lead[0].quoteDeclineReason !== undefined ? lead[0].quoteDeclineReason : null;
      document.getElementById("pendDate").value = lead[0].pendDate !== undefined ? lead[0].pendDate : null;
      document.getElementById("issueDate").value = lead[0].policyIssueDate !== undefined && lead[0].policyIssueDate !== null ? lead[0].policyIssueDate.substr(0, 10) : null;
      document.getElementById("polNum").value = lead[0].policyNumber !== undefined ? lead[0].policyNumber : null;
      document.getElementById("premium").value = lead[0].policyPremium !== undefined ? lead[0].policyPremium : null;
    }
    else {
      var prompt = "User detail request error";
      document.getElementById("userErr").innerHTML = prompt;
    }
  });
};

// ============================================================================
//  Add Lead Orchestration
// ============================================================================
//
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//  When a new lead is assigned to an agent is starts a two step process:
//    1. Capture detail and create the lead
//    2. Fulfill the request and update the lead document with the progress
//  At the end of step 1 when the "Create Lead" button is clicked the captured
//  content is used to create a new lead document in the DB and then in step 2
//  the fulfilment process is started. To enable the lead agent to record the
//  progress of the fulfilment process the progress form is displayed with the
//  detail of the lead. Step 2 ends when the "Update" button is clicked.
//
//  When moving from step 1 to step 2 the UI is updated, which could result in
//  certain data items required for the update not being available anymore. To
//  prevent this the items required for the update is stored locally:
//    sessionStorage.setItem('reference', resBody.reference); - returned by DB
//    sessionStorage.setItem('servicerType', "agent"); - selected
//    sessionStorage.setItem('trfApproval', "no"); - by default
//    sessionStorage.setItem('accepted', "yes"); - by default
//    sessionStorage.setItem('allocatedPractice', "Agents"); - by default
//    sessionStorage.setItem('assignedAdviser', adviser); - read
//
//  Note: this may all be because of the way I do the update,
//  need to investigate this
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// --------------------
//  Open Add Lead Form
// --------------------
function addLead() {
  console.log("---> Add lead started");
  //
  // Set modal Header
  //
  // document.getElementById("modal-header-text").innerHTML =
  //   `Detail for lead: XX-XXX-XXX,
  //   Status:  - ,
  //   Transfer: - ,
  //   Servicer: - ,
  //   Practice: - `;
  document.getElementById("modal-header-text").innerHTML =
    `Detail for lead: XX-XXX-XXX`;
  //
  // Clear lead form
  //
    resetForm('lead-form');
    document.getElementById("leadMsg").innerHTML = "";
  //
  // open modal window
  //
  modal.style.display = "block";
  // Setup form to capture new lead
  document.getElementById("lead-view").style.display = 'block';
  document.getElementById("assign-prompt").style.display = 'block';
  document.getElementById("approval-prompt").style.display = 'none';
  document.getElementById("noForm").style.display = 'none';
  document.getElementById("yesForm").style.display = 'none';
  // Set buttons display state
  document.getElementById("addLeadButtons").style.display = 'none';
  document.getElementById("updateLeadButtons").style.display = 'none';
  document.getElementById("practiceLeadButtons").style.display = 'none';
  document.getElementById("adviserLeadButtons").style.display = 'none';
};
// ---------------------------------------------
//  Create new lead document from data captured
// ---------------------------------------------
async function addLeadCtrl() {
  try {
    let result = await submitLead();
    console.log('---> Lead submit result', result);
    if (result === "ok") {
      //
      // New lead created - note new lead has no progress data
      //
      prompt('leadMsg', "Lead created");
      //
      // Adviser selected - lead capture complete, reset lead add form
      //
      if (checked('assign-adviser')) {
        viewOff('addLeadButtons');
        viewOff("approval-prompt");
        viewOff("noForm");
        viewOff('yesForm');
        viewOff('v-pl-types');
        viewOff('v-cl-types');
        viewOff('v-al-types');
        viewOff('v-sl-types');
        viewOff('v-xl-types');
        resetForm('lead-form');
      }
      //
      // Agent selected - lead created, record progress of fulfilment
      //
      else {
        //
        // Enhancement: the reference of lead created must be return so that it can be displayed
        //
        console.log("*** Agent assigned get fulfilment progress ***");
        viewOff('addLeadButtons');
        viewOn('lead-progress');
        viewOn('updateLeadButtons');
        // Set accepted option to true because agent selected to fulfill the lead
        document.getElementById("lead-accept").checked = true;
        // Set progress form to accepted state
        var accept = document.getElementsByClassName("accept-yes");
        for (var i = 0; i < accept.length; i++) {
          accept[i].disabled = false;
        }
      }
    }
  }
  catch(err) {
    //
    // lead creation failed
    //
    prompt('leadMsg', err);
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
      // Set add lead request parameters
      //
      var dataString = JSON.stringify(leadData);
      console.log("---> New Lead Data String: ", dataString);
      var method = "POST";
      var route = "/leads/add";
      var contentType = "application/json";
      //
      //  Send Lead POST Request to server with callback
      //
      console.log("*** Submitting data for new lead ***");
      xhrRequest(method, route, contentType, dataString, (err, result) => {
        if (!err) {
          console.log("*** SUCCESS: Lead created ***");
          var resBody = result.responseText;
          console.log("===> Result response text: ", resBody);
          resolve("ok");
          //
          // Store non-form items for the update of the new lead during step 2.
          //
          sessionStorage.setItem('reference', resBody);
          sessionStorage.setItem('servicerType', leadData.servicerType);
          sessionStorage.setItem('trfApproval', leadData.trfApproval);
          sessionStorage.setItem('accepted', leadData.accepted);
          sessionStorage.setItem('allocatedPractice', leadData.allocatedPractice);
          sessionStorage.setItem('assignedAdviser', leadData.assignedAdviser);
          // Display stored values
          for(let i=0; i<sessionStorage.length; i++) {
            let key = sessionStorage.key(i);
            console.log(`${key}: ${sessionStorage.getItem(key)}`);
          }
          document.getElementById("modal-header-text").innerHTML =
            `Detail for lead: ${resBody},
            Status: ${leadData.status},
            Transfer: ${leadData.trfApproval},
            Servicer: ${leadData.servicerType}: ${leadData.assignedAdviser},
            Practice: ${leadData.allocatedPractice}`;
        }
        else {
          console.log("*** ERROR: Lead not created ***");
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
    document.getElementById("leadMsg").innerHTML = "";
  }
  //  If Agent is selected display buttons to create a lead
  else if (document.getElementById('assign-agent').checked) {
    // switch off
    document.getElementById('approval-prompt').style.display = 'none';
    document.getElementById('noForm').style.display = 'none';
    document.getElementById('yesForm').style.display = 'none';
    document.getElementById("trfYes").checked = false;
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

// ============================================================================
//  Lead Update Orchestration
// ============================================================================

// ---------------------------------
//  Send lead update data to server
// ---------------------------------
function updateLead() {
  console.log("*** Update Lead Started ***");
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
  // Data extracted
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
    console.log("*** Update server commit Started ***");
    xhrRequest(method, route, contentType, dataString, (err, result) => {
      if (!err) {
        console.log("*** SUCCESS: Commit Completed ***");
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
        listLeads();
      }
      else {
        console.log("*** ERROR: Commit Failed ***");
        var prompt = "Lead update submit error";
        document.getElementById("leadMsg").innerHTML = prompt;
      }
    });
  }
  //
  // Data extract failed
  //
  else {
    console.log("*** ERROR: Lead update failed - no data ***");
  }
};

// ============================================================================
//  Extract Lead Data from DOM Orchestration
// ============================================================================

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
    // For ADD:
    //
    if (action === "ADD") {
      console.log("*** Set New Lead Control Content ***");
      //
      // For AGENT:
      //
      if (checked('assign-agent')) {
        leadContentData.servicerType = "agent";
        // For an Agent certain properties are set to default values
        leadContentData.contactLocation = {postal: "n/a", suburb: "n/a"};
        leadContentData.trfApproval = "no";
        //
        // Set new lead Status and Progress State
        //
        var leadStateData = {
          progress: 'taken',
          status: 'assigned',
          error: ''
        }
        //
        // Assign agent and set accepted indicator to yes, i.e. taken state
        //
        leadContentData.accepted = "yes";
        leadContentData.allocatedPractice = "Agents";
        leadContentData.assignedAdviser = sessionStorage.getItem('userId');
      }
      //
      // For ADVISER:
      //
      else if (checked('assign-adviser')) {
        leadContentData.servicerType = "adviser";
        //
        // if adviser is selected extract transfer approval state
        //
        if (document.getElementById('trfYes').checked) {
          leadContentData.trfApproval = "yes";
        }
        else {
          leadContentData.trfApproval = "no";
          // should actually never occur
        }
        //
        // Set new lead Status and Progress State
        //
        var leadStateData = {
          progress: 'none',
          status: 'open',
          error: ''
        }
      }
      else {
        console.log("*** ERROR: Could not determine servicer ***");
      }
      //
      // New lead has no reference id nor progress data
      //
      var leadRef = {};
      var leadProgressData = {};

      console.log("*** New Lead Control Content Set ***");
    }
    //
    // For UPDATE:
    //
    if (action === "UPDATE") {
      //
      // Get lead reference number from session storage
      //
      var leadRef = {reference : sessionStorage.getItem('reference')};
      console.log("---> Lead Reference: ", leadRef);
      //
      // Get servicerType from local session
      //
      leadContentData.servicerType = sessionStorage.getItem('servicerType')
      //
      // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      //  When adding a lead this is selected in the form and can be read from there, but
      //  when a lead is updated it is not an option. It is displayed in the modal header.
      //  When viewing a lead document this value will be retrieved from the DB with the
      //  rest of the lead's data from and stored locally as a key value pair:
      //          sessionStorage.setItem('servicerType', servicerType);
      //  If the lead being viewed is updated this key value pair will be retrieved from
      //  the local storage:
      //          servicerType = sessionStorage.getItem('servicerType')
      //  The value is required to create the updated lead document. If the value is not set
      //  the update will over write the value in the DB. This is because the data extract
      //  function is used by both the add lead and update lead functionality.
      //
      //  In future when other roles, practice & adviser, then this will have to be considered.
      // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      //
      //
      // Determine lead's new state
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
      else if (leadStateData.progress !== "none") {
        //
        // Extract progress data
        //
        console.log("*** Extract lead progress data ***");
        var leadProgressData = extractLeadProgress("leadProgressForm");
        console.log("===> Lead progress returned: ", leadProgressData);
      }
    }
    //
    // Combine data into a single lead object and return
    //
    console.log("---> Form data extracted: ", leadContentData);
    console.log("---> Progress data extracted: ", leadProgressData);
    console.log("---> State data extracted: ", leadStateData);
    var leadData = Object.assign(leadRef, leadContentData, leadProgressData, leadStateData);
    console.log("---> Combined lead document data: ", leadData);
    console.log("*** Lead Document Created ***");
    return leadData;
  }
  //
  // For ANY OTHER - Error
  //
  else {
    //
    // Error - The action parameter does not contain a valid value
    //
    console.log("*** ERROR: Invalid action parameter value ***");
    var leadData = "error";
    return leadData;
  }
}

// -----------------------------------------
//  Extract lead content data from DOM form
// -----------------------------------------
function extractLeadContent(formId){
  console.log("*** Started extracting lead content ***");
  console.log("---> Lead State Form: ", formId);
  //
  // Extract form data
  //
  var formData = document.getElementById(formId);
  console.log("---> Form Content Data: ", formData);
  //
  // Define reuseable parameters
  //
  var radioName = "";
  var formElement = "";
  var inputType = "";
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
    var value = "n/a";
    //var value = [];
    //value.push("n/a");
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
  //  Create Lead data object
  //
  var leadData = {
    //servicerType: servicerType, -- new leads only
    //trfApproval: trfApproval,  -- new leads only
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
    currentInsurer: textInfo.currInsurer,
    previousInsured: previousInsured.prevIns,
    lineOfBusiness: textInfo.business,
    services: leadServices,
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
    comments: {
      comment1: contactComment.comment1,
      comment2: coverComment.comment2
      //comment3: "",
      //comment4: ""
    }
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
    var rejectReason = document.getElementById('rejectReason').value
    return {
      acceptance: acceptance.leadAccept,
      rejectReason: rejectReason
    };
  }
  //
  // Has contact mode with prospect, if not record and end
  //
  var noContact = document.getElementById('noContact').checked
  if (noContact) {
    console.log("---> No contact made, end");
    //
    // Create no contact progress object and return
    //
    var progressData = {
      accepted: "yes",
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
    // rejectReason: only updated when accept=no, lead rejected nothing else is updated - handled above
    contactDate: progressDates.contactDate,
    noContact: noContact,
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
  // STATE 7 - Policy Issued
  //
  // Rule: polNum & issueDate; text & date, = enterred >> issued --> close
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
  // STATE 6 - Quote state
  //
  // Rule: acceptance; radio = accepted >> accepted --> assigned; declined >> declined --> close; expired >> expired --> close
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
  // STATE 5 - Quoted
  //
  // Rule: quoteDate & quotNum; Date & Text, enterred >> quoted --> lead assigned
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
  // STATE 4 - Viability of lead:
  //
  // Rule: viability; radio, = yes >> viable --> lead assigned; = no >> not viable --> lead closed
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
  // STATE 3 - No contact made
  //
  // Rule: noContact; checkbox, = checked >> no contact --> lead closed
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
  // STATE 2 - Made contact
  //
  // Rule: contactedDate; date, = enterred >> contacted --> lead assigned
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
  // STATE 1 - Acceptance
  //
  // Rule: lead-accept; radio, = yes >> accepted --> lead assigned; = no >> rejected --> lead allocated
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
  //
  // No progress set default state
  //
  //
  // Determine lead's current state from module header
  //
  //var currentStatus = document.getElementById('current-lead-status').value
  var leadState = {
    progress: 'none',
    status: '',
    error: ''
  }
  return leadState;
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