"use strict";

// ============================================================================
//  Global modal controls (adapted from w3schools)
// ============================================================================

// ---------------------
//  Set modal reference
// ---------------------
var modal = document.getElementById('modalBox');

/*
  Get the button that opens the modal
  var btn = document.getElementById("myBtn");

  When the user clicks the button, open the modal
  btn.onclick = function() {
    modal.style.display = "block";
  }
*/

// -------------------------------------------------------------------------
//  Set reference to modal close X in the <span> element with "close" class
// -------------------------------------------------------------------------
var xButton = document.getElementsByClassName("close")[0];

// --------------------------------------------------------
//  Close the Modal when close (X) is clicked on the modal
// --------------------------------------------------------
xButton.onclick = function() {
  //
  // Clear modal content
  //
  clearModal();
  //
  // Close modal display
  //
  modal.style.display = "none";
};

// -------------------------------------------------------------------------
//  Close the Modal when a click event occurss outside of the modal content
// -------------------------------------------------------------------------
window.onclick = function(event) {
  if (event.target == modal) {
  //
  // Clear modal content
  //
  clearModal();
  //
  // Close modal display
  //
    modal.style.display = "none";
  }
};

// ------------------------------
//  Model content clear function
// ------------------------------
function clearModal() {
  //
  // User view - reset form and close view
  //
  if (document.getElementById('user-view')) {
    resetForm("user-form");
    viewOff("practice-user");
    viewOff("adviser-user");
    document.getElementById('user-view').style.display = 'none';
    document.getElementById('s-pl-types').style.display = 'none';
    document.getElementById('s-cl-types').style.display = 'none';
    document.getElementById('s-sl-types').style.display = 'none';
    document.getElementById('s-al-types').style.display = 'none';
    document.getElementById('s-xl-types').style.display = 'none';
  }
  //
  // Practice view - reset form and close view
  //
  if (document.getElementById("practice-view")) {
    resetForm("practice-form");
    document.getElementById("practice-view").style.display = 'none';
    //
    // clear postal code table
    //
    var table = document.getElementById("tablePCode");
    table.innerHTML = "<tr> </tr>";
  }
  //
  // Lead view - reset forms and close views
  //
  if (document.getElementById('lead-view')) {
    resetForm("lead-form");
    resetForm("leadProgressForm");
    document.getElementById('lead-view').style.display = 'none';
    document.getElementById('lead-progress').style.display = 'none';
    document.getElementById('v-pl-types').style.display = 'none';
    document.getElementById('v-cl-types').style.display = 'none';
    document.getElementById('v-sl-types').style.display = 'none';
    document.getElementById('v-al-types').style.display = 'none';
    document.getElementById('v-xl-types').style.display = 'none';
  }
};

// ==================================
//  Menu option click event handlers
//===================================
// ----------------
//  Profile Option
// ----------------
if (document.getElementById("profile")) {
  document.getElementById("profile").addEventListener("click", function() {
    profile(user);
  });
}

// -----------------------------
//  Admin Role (A) Menu Options
// -----------------------------
//  View Practices
if (document.getElementById("admin-practices")) {
  document.getElementById("admin-practices").addEventListener("click", function() {
    openPracticesView();
  });
}
//  View Users
if (document.getElementById("admin-users")) {
  document.getElementById("admin-users").addEventListener("click", function() {
    openUsersView();
  });
}

// --------------------------------
//  Practice Role (B) Menu Options
// --------------------------------
//  View Leads
if (document.getElementById("practice-leads")) {
  document.getElementById("practice-leads").addEventListener("click", function() {
    openLeadsView("Practice");
  });
}
//  Assign Leads
if (document.getElementById("allocated-leads")) {
  document.getElementById("allocated-leads").addEventListener("click", function() {
    allocatedLeadsView();
  });
}
//  View Advisers
if (document.getElementById("practice-advisers")) {
  document.getElementById("practice-advisers").addEventListener("click", function() {
    listAdvisers();
  });
}

// -------------------------------
//  Adviser Role (C) Menu Options
// -------------------------------
//  View Assigned Leads
if (document.getElementById("adviser-leads")) {
  document.getElementById("adviser-leads").addEventListener("click", function() {
    openLeadsView("Adviser");
  });
}
//  View Quotes
if (document.getElementById("adviser-quotes")) {
  document.getElementById("adviser-quotes").addEventListener("click", function() {
    openQuoteView("Adviser");
  });
}

// -------------------------------
//  Agent Role (D) Menu Options
// -------------------------------
//  Leads
if (document.getElementById("leads")) {
  document.getElementById("leads").addEventListener("click", function() {
    openLeadsView("");
  });
}

// ============================================================================
//  View Controls
// ============================================================================
// -------------------
//  Select start view
// -------------------
//window.onload = function() {
window.addEventListener("load", function() {
  if (document.getElementById("login-view")){
    console.log(`---> Error, incorrect view loaded`);
  }
  else {
    toggleView("nav");
    // =======================
    //  Setup Session Storage
    // =======================
    //
    //  Display old session values
    //
    for(let i=0; i<sessionStorage.length; i++) {
      let key = sessionStorage.key(i);
      console.log(`---> Current Session Storage: ${key}: ${sessionStorage.getItem(key)}`);
    }
    //
    // Get User Id and set
    //
    sessionStorage.clear();
    var userId = document.getElementById("user").innerHTML;
    var to = userId.indexOf('(');
    sessionStorage.setItem('userId', userId.substring(0, to - 1));
    //
    // Get User Role and set
    //
    var str = document.getElementById("user").innerHTML;
    var start = str.indexOf('(') + 1;
    if (str.indexOf(':') !== -1){
      var end = str.indexOf(':') - 1;
    }
    else {
      var end = str.length - 1;
    }
    var role = str.substring(start, end);
    sessionStorage.setItem('userRole', role);
    //
    // Get User Practice Id and set
    //
    if (str.indexOf(':') !== -1){
      var start = str.indexOf(':') + 2;
      var end = str.length - 1;
      var practice = str.substring(start, end);
    }
    else {
      var practice = "";
    }
    sessionStorage.setItem('userPracticeId', practice);
    //
    // Display new session values set
    //
    for(let i=0; i<sessionStorage.length; i++) {
      let key = sessionStorage.key(i);
      console.log(`---> New Values in Session Storage: ${key}: ${sessionStorage.getItem(key)}`);
    }
  }
});

// -------------------------------------------------
//  Reset form, close panel view and open menu view
// -------------------------------------------------
function openMenu() {
  toggleView("nav");
  toggleView("section");
  toggleView("headerMain");
  toggleView("headerSub");
};

// -------------------------------------
//  Close menu view and open panel view
// -------------------------------------
function openPanel() {
  toggleView("nav");
  toggleView("section");
  toggleView("headerMain");
  toggleView("headerSub");
};

// -----------------
//  Set panel title
// -----------------
function panelTitle(title) {
  document.getElementById('panelName').innerHTML = title;
};

// ------------------------
//  Switch view display on
// ------------------------
function viewOn(viewId) {
  document.getElementById(viewId).style.display = 'block';
};

// -------------------------
//  Switch view display off
// -------------------------
function viewOff(viewId) {
  document.getElementById(viewId).style.display = 'none';
};

// ---------------------
//  Toggle view display
// ---------------------
function toggleView(viewId){
  var state = '';
  var view = document.getElementById(viewId);
  if(view.style.display == "block") {
      view.style.display = "none";
      state = "OFF";
  }
  else {
      view.style.display = "block";
      state = "ON";
  }
  console.log(`---> ${viewId} is ${state}`);
};

// ============================================================================
//  Utilities - Reusable Data Display Functions
// ============================================================================
//
// ------------------------------------------------------------
//  Set the line and type check boxes for the Lead detail view
// ------------------------------------------------------------
function setServicesView(services, prefix) {
  for (var i = 0, j = services.length; i < j; i++) {
    //console.log(">>> Services Line: ", i, services[i].line);
    //
    // Set insurance line selector to selected
    //
    document.getElementById(prefix + "-" + services[i].line.toLocaleLowerCase() + "-line").checked = true;
    //
    // Display insurance type selector for line
    //
    document.getElementById(prefix + "-" + services[i].line.toLocaleLowerCase() + "-types").style.display = 'block';
    //
    // For the insurance types found set the selector tickbox to selected
    //
    for (var x = 0, z = services[i].types.length; x < z; x++) {
      //console.log(">>> Services Detail: ", x, services[i].types[x]);
      if (document.getElementById(prefix + "-" + services[i].line.toLocaleLowerCase() + "-" + services[i].types[x].toLocaleLowerCase().replace(/\s/g, '-'))) {
        document.getElementById(prefix + "-" + services[i].line.toLocaleLowerCase() + "-" + services[i].types[x].toLocaleLowerCase().replace(/\s/g, '-')).checked = true;
      }
      else {
        alert(`Data Error: Invalid service type description: ${x}, ${services[i].types[x]}`);
      }
    }
  }
};

// -----------------------------------------------------
//  Open or close the display of a line's service types
// -----------------------------------------------------
function typeSwitch(el) {
  if (document.getElementById(el + "-line").checked) {
    // if selected switch on
    document.getElementById(el + "-types").style.display = 'block';
  }
  else {
    // if not selected switch off
    document.getElementById(el + "-types").style.display = 'none';
  }
};

// ============================================================================
//  Utilities - Table Display Functions
// ============================================================================

// ----------------------------------
//  Create table and display content
// ----------------------------------
function displayData(content, title, layoutId) {
  //
  //  Read layout definition
  //
  var layout = readLayout(layoutId);
  //
  //  Extract table content
  //
  var tableContent = [];
  var rowCount = content.length;
  var colCount = layout.definition.length;
  for (var i=0; i < rowCount; i++) {
    var cells = [];
    for (var j=0; j < colCount; j++) {
      //
      // If there is no data for a cell create it as a dash
      //
      cells.push((typeof content[i][layout.definition[j].fname] === 'undefined') ? (" - ") : (content[i][layout.definition[j].fname]));
    }
    tableContent[i] = cells;
  }
  //
  // Create table element
  //
  var table = document.createElement('table');
  //
  // Give table an id as reference
  //
  var tableId = 'table' + layoutId;
  table.setAttribute('id', tableId);
  //
  // Create header
  //
  var header = table.createTHead();
  //
  // Create header row
  //
  var headerRow = header.insertRow(0);
  headerRow.setAttribute('class', "list-head-row");
  //
  // Create cells and insert label content
  //
  for (var j = 0; j < colCount; j++) {
    var headerCell = headerRow.insertCell(-1);
    headerCell.innerHTML = layout.definition[j].label;
  }
  //
  // Create body
  //
  var body = table.createTBody();
  //
  // Create a body row for each data row
  //
  for (var i = 0; i < rowCount; i++) {
    //
    // Insert a body row for each data row
    //
    var tableRow = body.insertRow(-1);
    tableRow.setAttribute('class', "list-body-row");
    //
    // Insert a cell for each data column
    //
    for (var j = 0; j < colCount; j++) {
      //
      // Insert a cell
      //
      var tableCell = tableRow.insertCell(-1);
      //
      // Insert content into table cell
      //
      tableCell.innerHTML = (isString(tableContent[i][j]) ? (tableContent[i][j].trim()) : (tableContent[i][j]));
    } // end of column loop
  } // end of row loop
  //
  // Determine element ids value for data display
  //
  if (layoutId !== "4" && layoutId !== "5" && layoutId !== "6") {
    // for leads display function
    var listId = "tPos" + layoutId;
    var titleId = "title" + layoutId;
  }
  else {
    var listId = "tPos";
    var titleId = "title";
  }
  console.log(`---> list Id: ${listId} title: ${titleId}`);
  //
  // Insert table into DOM to display
  //
  var tPosElement = document.getElementById(listId);
  tPosElement.innerHTML = "";
  tPosElement.appendChild(table); // add child element to document
  //
  // Insert list heading for list display
  //
  if (title !== null) {
    document.getElementById(titleId).innerHTML = title;
  }
  console.log("<<< Data list display updated >>>");
};

// -----------------------------
//  Add table row functionality
// -----------------------------
function addRowHandlers(id) {
  console.log("<<< Start adding Row Handlers >>>");
  //console.log("---> Table Id: ", id);
  var elementId = "table" + id;
  //console.log("---> Element Id: ", elementId);
  var rows = document.getElementById(elementId).rows;
  var rowCount = document.getElementById(elementId).rows.length;
  //console.log("---> Table Rows - number: ", rowCount);
  //console.log("---> Table Rows - detail: ", rows);
  //
  // Add row function as required for dtype of list
  //
  if (id === "0"){
    // users list
    var rowFunc = function(){ displayUser(this.cells[4].innerHTML); };
    // cells[4] = user email
  }
  if (id === "1"){
    // practice assign leads list
    var rowFunc = function(){ displayLead(this.cells[0].innerHTML, id); };
    // cells[0] = lead reference
  }
  if (id === "2"){
    // practices list
    var rowFunc = function(){ displayPractice(this.cells[0].innerHTML); };
    // cells[0] = practice code
  }
  if (id === "3"){
    // advisers list
    var rowFunc = function(){ displayUser(this.cells[4].innerHTML); };
    // cells[4] = user email
  }
  if (id === "4"){
    // adviser leads list
    var rowFunc = function(){ displayLead(this.cells[0].innerHTML, id); };
    // cells[0] = lead reference
  }
  if (id === "5"){
    // agent leads list
    var rowFunc = function(){ displayLead(this.cells[0].innerHTML, id); };
    // cells[0] = lead reference
  }
  if (id === "6"){
    // practice leads list
    var rowFunc = function(){ displayLead(this.cells[0].innerHTML, id); };
    // cells[0] = lead reference
  }
  if (id === "7"){
    // practice leads list
    var rowFunc = function(){ linkAdviser(this.cells[6].innerHTML); };
    // cells[0] = lead reference
  }

  for (var i = 1; i < rowCount; i++) {
      // ignore header, row 0
      rows[i].onclick = rowFunc;
      rows[i].onmouseover = function(){ ChangeColor(this, true); };
      rows[i].onmouseout = function(){ ChangeColor(this, false); };
  }
  console.log("<<< Row Handlers Added >>>");
};

// --------------------------
//  Table layout definitions
// --------------------------
function readLayout(definitionId) {
  switch (definitionId) {
    case '0':
      console.log("List Layout: 0 (Admin Users)");
      var layoutDef = '{ "definition" : [' +
        '{ "fname" : "firstName" , "label" : "First Name" },' +
        '{ "fname" : "surname" , "label" : "Surname" },' +
        '{ "fname" : "phone" , "label" : "Phone" },' +
        '{ "fname" : "cell" , "label" : "Cell" },' +
        '{ "fname" : "email" , "label" : "email" },' +
        '{ "fname" : "roleCode" , "label" : "Role" },' +
        '{ "fname" : "adviserCode" , "label" : "Adv Code" },' +
        '{ "fname" : "practiceCode" , "label" : "Prac Code" },' +
        '{ "fname" : "status" , "label" : "Status" }' +
        ']}'
      ;
    break;
    case '1':
      console.log("List Layout: 1 (Practice Assign Leads)");
      var layoutDef = '{ "definition" : [' +
        '{ "fname" : "reference" , "label" : "Ref No." },' +
        '{ "fname" : "status" , "label" : "Status" },' +
        //'{ "fname" : "firstName" , "label" : "First Name" },' +
        //'{ "fname" : "surname" , "label" : "Surname" },' +
        '{ "fname" : "langPref" , "label" : "Language" },' +
        //'{ "fname" : "contactNum" , "label" : "Contact #" },' +
        //'{ "fname" : "altNumber" , "label" : "Alternate #" },' +
        //'{ "fname" : "cellNumber" , "label" : "Cell #" },' +
        //'{ "fname" : "eMail" , "label" : "eMail" },' +
        '{ "fname" : "postal" , "label" : "Postal" },' +
        '{ "fname" : "suburb" , "label" : "Suburb" },' +
        '{ "fname" : "service" , "label" : "Service(s)" },' +
        //'{ "fname" : "comment1" , "label" : "Comment" },' +
        '{ "fname" : "comment2" , "label" : "Service Comment" },' +
        '{ "fname" : "assignedAdviser" , "label" : "Adviser" }' +
        ']}'
      ;
    break;
    case '2':
      console.log("List Layout: 2 (Admin Practices)");
      var layoutDef = '{ "definition" : [' +
        '{ "fname" : "pracCode" , "label" : "Code" },' +
        '{ "fname" : "pracName" , "label" : "Name" },' +
        '{ "fname" : "pracPhone" , "label" : "Phone" },' +
        '{ "fname" : "pracEmail" , "label" : "Email" },' +
        '{ "fname" : "pracLeadCount" , "label" : "Lead Count" },' +
        '{ "fname" : "prinFirstName" , "label" : "Principle First Name" },' +
        '{ "fname" : "prinSurname" , "label" : "Principle Surname" },' +
        // '{ "fname" : "principle.phone" , "label" : "Principle Phone" },' +
        // '{ "fname" : "principle.cell" , "label" : "Principle Cell" },' +
        // '{ "fname" : "principle.email" , "label" : "Principle Email" },' +
        '{ "fname" : "offFirstName" , "label" : "Contact First Name" },' +
        '{ "fname" : "offSurname" , "label" : "Contact Surname" }' +
        // '{ "fname" : "backOffice.contact.phone" , "label" : "Contact Phone" },' +
        // '{ "fname" : "backOffice.contact.cell" , "label" : "Contact Cell" },' +
        // '{ "fname" : "backOffice.contact.email" , "label" : "Contact Email" }' +
        ']}'
      ;
    break;
    case '3':
      console.log("List Layout: 3 (Practice Advisers)");
      var layoutDef = '{ "definition" : [' +
        '{ "fname" : "firstName" , "label" : "First Name" },' +
        '{ "fname" : "surname" , "label" : "Surname" },' +
        '{ "fname" : "phone" , "label" : "Phone" },' +
        '{ "fname" : "cell" , "label" : "Cell" },' +
        '{ "fname" : "email" , "label" : "email" },' +
        '{ "fname" : "roleCode" , "label" : "Role" },' +
        '{ "fname" : "adviserCode" , "label" : "Adv Code" },' +
        '{ "fname" : "practiceCode" , "label" : "Practice Code" }' +
        ']}'
      ;
    break;
    case '4':
      console.log("List Layout: 4 (Adviser Leads)");
      var layoutDef = '{ "definition" : [' +
        '{ "fname" : "reference" , "label" : "Ref No." },' +
        '{ "fname" : "status" , "label" : "Status" },' +
        '{ "fname" : "state" , "label" : "Progress" },' +
        '{ "fname" : "firstName" , "label" : "First Name" },' +
        '{ "fname" : "surname" , "label" : "Surname" },' +
        '{ "fname" : "entityRefNum" , "label" : "ID/Reg Num" },' +
        '{ "fname" : "entityName" , "label" : "Org Name" },' +
        //'{ "fname" : "langPref" , "label" : "Language" },' +
        //'{ "fname" : "contactNum" , "label" : "Contact #" },' +
        //'{ "fname" : "altNumber" , "label" : "Alternate #" },' +
        //'{ "fname" : "cellNumber" , "label" : "Cell #" },' +
        //'{ "fname" : "eMail" , "label" : "eMail" },' +
        '{ "fname" : "postal" , "label" : "Postal" },' +
        '{ "fname" : "suburb" , "label" : "Suburb" },' +
        '{ "fname" : "service" , "label" : "Service(s)" },' +
        '{ "fname" : "lineOfBusiness" , "label" : "Business" }' +
        //'{ "fname" : "comment1" , "label" : "Comment" },' +
        //'{ "fname" : "comment2" , "label" : "Service Comment" }' +
        ']}'
      ;
    break;
    case '5':
      console.log("List Layout: 5 (Leads)");
      var layoutDef = '{ "definition" : [' +
        '{ "fname" : "reference" , "label" : "Ref No." },' +
        '{ "fname" : "servicerType" , "label" : "Servicer" },' +
        '{ "fname" : "status" , "label" : "Status" },' +
        '{ "fname" : "state" , "label" : "Progress" },' +
        '{ "fname" : "firstName" , "label" : "First Name" },' +
        '{ "fname" : "surname" , "label" : "Surname" },' +
        '{ "fname" : "entityRefNum" , "label" : "ID/Reg Num" },' +
        '{ "fname" : "entityName" , "label" : "Org Name" },' +
        //'{ "fname" : "langPref" , "label" : "Language" },' +
        '{ "fname" : "contactNum" , "label" : "Contact #" },' +
        //'{ "fname" : "altNumber" , "label" : "Alternate #" },' +
        //'{ "fname" : "cellNumber" , "label" : "Cell #" },' +
        //'{ "fname" : "eMail" , "label" : "eMail" },' +
        '{ "fname" : "postal" , "label" : "Postal" },' +
        '{ "fname" : "suburb" , "label" : "Suburb" },' +
        '{ "fname" : "service" , "label" : "Service(s)" },' +
        '{ "fname" : "lineOfBusiness" , "label" : "Business" }' +
        //'{ "fname" : "comment1" , "label" : "Comment" },' +
        //'{ "fname" : "comment2" , "label" : "Service Comment" }' +
        ']}'
      ;
    break;
    case '6':
      console.log("List Layout: 6 (Practice Leads)");
      var layoutDef = '{ "definition" : [' +
        '{ "fname" : "reference" , "label" : "Ref No." },' +
        '{ "fname" : "status" , "label" : "Status" },' +
        //'{ "fname" : "firstName" , "label" : "First Name" },' +
        //'{ "fname" : "surname" , "label" : "Surname" },' +
        '{ "fname" : "langPref" , "label" : "Language" },' +
        //'{ "fname" : "contactNum" , "label" : "Contact #" },' +
        //'{ "fname" : "altNumber" , "label" : "Alternate #" },' +
        //'{ "fname" : "cellNumber" , "label" : "Cell #" },' +
        //'{ "fname" : "eMail" , "label" : "eMail" },' +
        '{ "fname" : "postal" , "label" : "Postal" },' +
        '{ "fname" : "suburb" , "label" : "Suburb" },' +
        '{ "fname" : "service" , "label" : "Service(s)" },' +
        //'{ "fname" : "comment1" , "label" : "Comment" },' +
        '{ "fname" : "comment2" , "label" : "Service Comment" },' +
        '{ "fname" : "assignedAdviser" , "label" : "Adviser" }' +
        ']}'
      ;
    break;
    case '7':
      console.log("List Layout: 7 (Skilled Advisers)");
      var layoutDef = '{ "definition" : [' +
        '{ "fname" : "firstName" , "label" : "First Name" },' +
        '{ "fname" : "surname" , "label" : "Surname" },' +
        '{ "fname" : "leads.assigned" , "label" : "Assigned" },' +
        '{ "fname" : "leads.reject" , "label" : "Rejected" },' +
        '{ "fname" : "leads.quoted" , "label" : "Quoted" },' +
        '{ "fname" : "leads.written" , "label" : "Written" },' +
        '{ "fname" : "email" , "label" : "email" }' +
        ']}'
      ;
    break;
  }
  // console.log("Definition set: ", jText);
  var layout = JSON.parse(layoutDef); // convert JSON text into JS object
  // console.log("JSON Definition: ", layout);
  return layout;
};

// --------------------------
//  Table Filter definitions
// --------------------------
function filterDef(filterId) {
  switch (filterId) {
    case '1':
      console.log("Filter Definition: 1 (Leads Assign Filter)");
      var filterDef = '{ "definition" : [' +
        '{ "tableCol" : 0 , "valueId" : "lead-assign-ref-filter" },' +
        '{ "tableCol" : 2 , "valueId" : "lead-assign-language-filter" },' +
        '{ "tableCol" : 3 , "valueId" : "lead-assign-postal-filter" },' +
        '{ "tableCol" : 4 , "valueId" : "lead-assign-suburb-filter" },' +
        '{ "tableCol" : 5, "valueId" : "lead-assign-service-filter" }' +
        ']}'
      ;
    break;
    case '2':
      console.log("Filter Definition: 2 (Admin Practices Filter)");
    break;
    case '4':
      console.log("Filter Definition: 4 (Adviser Leads View Filter)");
      var filterDef = '{ "definition" : [' +
        '{ "tableCol" : 0 , "valueId" : "leads-ref-filter" },' +
        '{ "tableCol" : 1 , "valueId" : "leads-bussName-filter" },' +
        '{ "tableCol" : 8 , "valueId" : "leads-contName-filter" }' +
        '{ "tableCol" : 8 , "valueId" : "leads-contSurname-filter" }' +
        '{ "tableCol" : 8 , "valueId" : "leads-contNumb-filter" }' +
        '{ "tableCol" : 8 , "valueId" : "leads-refID-filter" }' +
        ']}'
      ;
    break;
    case '5':
      console.log("Filter Definition: 5 (Leads View Filter)");
      var filterDef = '{ "definition" : [' +
        '{ "tableCol" : 0 , "valueId" : "leads-ref-filter" },' +
        '{ "tableCol" : 1 , "valueId" : "leads-bussName-filter" },' +
        '{ "tableCol" : 8 , "valueId" : "leads-contName-filter" }' +
        '{ "tableCol" : 8 , "valueId" : "leads-contSurname-filter" }' +
        '{ "tableCol" : 8 , "valueId" : "leads-contNumb-filter" }' +
        '{ "tableCol" : 8 , "valueId" : "leads-refID-filter" }' +
        ']}'
      ;
    break;
    case '6':
      console.log("Filter Definition: 6 (Practice Leads Filter)");
      var filterDef = '{ "definition" : [' +
        '{ "tableCol" : 0 , "valueId" : "prac-lead-ref-filter" },' +
        '{ "tableCol" : 1 , "valueId" : "prac-lead-status-filter" },' +
        '{ "tableCol" : 8 , "valueId" : "prac-lead-adviser-filter" }' +
        ']}'
      ;
    break;
  }
  var filter = JSON.parse(filterDef); // convert JSON text into JS object
  console.log("JSON Definition: ", filter);
  return filter;
};

// Click Documentation:
  // {ref:'leadButton',id:'rejectLeadP',func:'rejectLead("P")'},
  // {ref:'leadButton',id:'adv-updateLead',func:'updateLead()'},
  // {ref:'modalLead',id:'assign-agent',func:'assignFork()'},
  // {ref:'modalLead',id:'assign-adviser',func:'assignFork()'},
  // {ref:'modalLead',id:'trfYes',func:'leadOk()'},
  // {ref:'modalLead',id:'trfNo',func:'leadOk()'},

  // {ref:'progress',id:'progress-update',func:'updateLeadProgress()'},
  // {ref:'progress',id:'progress-reset',func:'resetLeadProgressForm()'},

  // {ref:'modalPractice',id:'add-pcode',func:'addPostCode()'},
  // {ref:'modalPractice',id:'update-pcode',func:'amendPostCodeList("update")'},
  // {ref:'modalPractice',id:'remove-pcode',func:'amendPostCodeList("remove")'},
  // {ref:'modalPractice',id:'formAddPractice',func:'submitPractice("add")'},
  // {ref:'modalPractice',id:'formUpdatePractice',func:'submitPractice("update")'},
  // {ref:'modalPractice',id:'formDeletePractice',func:'deletePractice()'},

  // {ref:'viewPractice',id:'end-leads-view',func:'leadsViewOff()'},
  // {ref:'viewPractice',id:'apply-prac-filter',func:'filterTable("tPos1", "1")'},
  // {ref:'viewPractice',id:'end-adviser-view',func:'AdvViewOff()'},
  // {ref:'viewPractice',id:'link-adviser',func:'addAdviser()'},
  // {ref:'viewPractice',id:'amend-adviser',func:'updateAdviser()'},
  // {ref:'viewPractice',id:'delink-adviser',func:'removeAdviser()'},

  // {ref:'modalUser',id:'problem',func:'typeSwitch()'},

  // {ref:'modalUser',id:'formAddUser',func:'submitUser("add")'},
  // {ref:'modalUser',id:'formUpdateUser',func:'submitUser("update")'},
  // {ref:'modalUser',id:'formDeleteUser',func:'deleteUser()'},

  // {ref:'viewAdmin',id:'close-practice-view',func:'openMenu()'},
  // {ref:'viewAdmin',id:'add-practice',func:'addPractice()'},
  // {ref:'viewAdmin',id:'close-users-view',func:'openMenu()'},
  // {ref:'viewAdmin',id:'add-user',func:'addUser()'},
