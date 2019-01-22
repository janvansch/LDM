"use strict";

// ==============================================================================
//  Global modal controls (source: w3schools)
// ==============================================================================
var modal = document.getElementById('modalBox');
//var modalPrac = document.getElementById('modalPrac');

// Get the button that opens the modal
// var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
// When the user clicks the button, open the modal
//btn.onclick = function() {
//    modal.style.display = "block";
//}

// -----------------------------------------------------
//  When the user clicks on <span> (x), close the modal
// -----------------------------------------------------
span.onclick = function() {
  //
  // Clear Add User Form
  //
  resetform("formAddUser");
  document.getElementById("addUser").style.display = 'none';
  document.getElementById('selectAbility').style.display = 'none';
  document.getElementById('dispPersServ').style.display = 'none';
  document.getElementById('dispCommServ').style.display = 'none';
  document.getElementById('dispSasrServ').style.display = 'none';
  document.getElementById('dispAgriServ').style.display = 'none';
  document.getElementById('dispSpecServ').style.display = 'none';
  //
  // Clear Add Practice Form
  //
  resetform("formAddPractice");
  document.getElementById("addPractice").style.display = 'none';
  //
  // clear postal code table
  //
  var table = document.getElementById("tablePCode");
  table.innerHTML = "<tr> </tr>";
  //
  // Clear lead View Form
  //  
  resetform("formLead");
  document.getElementById('pl').style.display = 'none';
  document.getElementById('cl').style.display = 'none';
  document.getElementById('sl').style.display = 'none';
  document.getElementById('al').style.display = 'none';
  document.getElementById('xl').style.display = 'none';
  //
  // Close modal display
  //
  modal.style.display = "none";
}

// --------------------------------------------------------------
//  When the user clicks anywhere outside of the modal, close it
// --------------------------------------------------------------
window.onclick = function(event) {
  if (event.target == modal) {
    //
    // Clear Add User Form
    //
    resetform("formAddUser");
    document.getElementById("addUser").style.display = 'none';
    document.getElementById('selectAbility').style.display = 'none';
    document.getElementById('dispPersServ').style.display = 'none';
    document.getElementById('dispCommServ').style.display = 'none';
    document.getElementById('dispSasrServ').style.display = 'none';
    document.getElementById('dispAgriServ').style.display = 'none';
    document.getElementById('dispSpecServ').style.display = 'none';
    //
    // Clear Add Practice Form
    //  
    resetform("formAddPractice");
    document.getElementById("addPractice").style.display = 'none';
    //
    // clear postal code table
    //
    var table = document.getElementById("tablePCode");
    table.innerHTML = "<tr> </tr>";
    //
    // Clear lead View Form
    //  
    resetform("formLead");
    document.getElementById('pl').style.display = 'none';
    document.getElementById('cl').style.display = 'none';
    document.getElementById('sl').style.display = 'none';
    document.getElementById('al').style.display = 'none';
    document.getElementById('xl').style.display = 'none';
    
    //
    // Close modal display
    //
    modal.style.display = "none";
  }
}

// ==============================================================================
//  Initiate views
// ==============================================================================
// ----------------
//  Initiate views
// ----------------
window.onload = function() {
  document.getElementById('ifPersonal').style.display = 'none';
  document.getElementById('ifCommercial').style.display = 'none';
  document.getElementById('ifSasria').style.display = 'none';
  document.getElementById('ifAgriculture').style.display = 'none';
  document.getElementById('ifSpecialist').style.display = 'none';
  document.getElementById('ServiceComment').style.display = 'none';
  toggleView("viewLogin");
  toggleView("navLogin");
}

// ---------------------
//  View display toggle
// ---------------------
function toggleView(viewID){
  var state = '';
  var view = document.getElementById(viewID);
  if(view.style.display == "block") {
      view.style.display = "none";
      state = "OFF";
  }
  else {
      view.style.display = "block";
      state = "ON";
  }
  console.log(`---> ${viewID} is ${state}`);
}

// ==============================================================================
//  Login 
// ==============================================================================

// -----------------------------------------------
//  Validate Login and Open View Required by Role
// -----------------------------------------------

function login() {
  //
  //  Extract login credentials from login view
  //
  const loginData = document.getElementsByName("logindata");
  //
  // Validate credentials if provided
  //
  if (loginData[0].value !== '' && loginData[1].value !== '') {
    //
    // Validate login credentials
    //
    validate(loginData, (validUser) => {
      var user = validUser.body;
      var auth = validUser.x-auth;
      //
      // Close login View
      //
      toggleView("viewLogin");
      toggleView("navLogin");
      //
      // Display user id in system header
      //
      document.getElementById("user").innerHTML = "User: " + user.email;
      //
      // Display Role View
      //
      openRoleView(user);
    });
  }
  else {
    //
    // No login credentials provided
    //
    const prompt = "No login information ... please enter";
    document.getElementById("prompt").innerHTML = prompt;
  }
}

// ----------------------------
//  Validate login credentials
// ----------------------------
function validate(login, callback) {
  //
  // create server login request
  //
	var request = JSON.stringify({
	    email: login[0].value,
			password: login[1].value
	});
  var method = "POST";
	var route = '/users/login';
  var contentType = 'application/json';
  //
  //  Send login request to server
  //
  xhrRequest(method, route, contentType, request, (err, result) => {
    if (!err) {
      //
      // Login credentials valid
      //
      const resHeader = result.getResponseHeader("x-auth");
      const resBody = result.responseText;
      const resStr = '{"x-auth":"' + resHeader + '","body":' + resBody + '}';
      const resObj = JSON.parse(resStr);
      callback(resObj);
    }
    else {
      //
      // Login credentials invalid
      //
      const prompt = "Login invalid ... re-enter information";
      document.getElementById("prompt").innerHTML = prompt;
    }
  });
}

// ----------------
//  Open role view
// ----------------
function openRoleView(user) {
  const userId = user._id;
  const userEmail = user.email;
  const userRole = user.roleCode;
  const userPracCode = user.practiceCode;
  console.log(`>>> User Id: ${userId}, User eMail: ${userEmail}, User Role: ${userRole}, Practice Code: ${userPracCode}`);
  if (userRole==="A") {
    toggleView("viewAdmin");
    toggleView("navAdmin");
    navSetup("A");
  }
  else if (userRole==="B") {
    toggleView("viewPractice");
    toggleView("navPractice");
    navSetup("B", userEmail, userPracCode);
  }
  else if (userRole==="C") {
    toggleView("viewAdviser");
    toggleView("navAdviser");
    //showLeads(userID, userPracCode );
    //listAdvLeads();
    navSetup("C", userEmail, userEmail);
  }
  else if (userRole==="D"){
    toggleView("viewLead");
    toggleView("navLead");
    navSetup("D", userId, userId);
  }
  else {
    console.log(`>>> Error - No role defined!
      User ID: ${userID},
      User Role: ${userRole},
      Practice Code: ${userPracCode}`);
  }
}

// -------------------------------
//  Setup view navigation options 
// -------------------------------
function navSetup(menuType, user, data) {
  //
  // Functions for view navigation options
  //
  if (menuType === "A") {
    //
    // Functions for Admin view options
    //
    var menuName = ".navOptAdmin"; // user outside the block
    const opt0Func = function(){ profile(user); }; // has block scope
    const opt1Func = function(){ listPractices(); }; // has block scope
    const opt2Func = function(){ listUsers(); }; // has block scope
    var optFunc = [opt0Func, opt1Func, opt2Func]; // user outside the block
  }  
  if (menuType === "B") {
    //
    // Functions for Practice view options
    //    
    var menuName = ".navOptPrac";
    const opt0Func = function(){ profile(user); };
    const opt1Func = function(){ listPracLeads(data); };
    const opt2Func = function(){ listAdvisers(data); };
    var optFunc = [opt0Func, opt1Func, opt2Func];
  }
  if (menuType === "C") {
    //
    // Functions for Adviser view options
    //
    var menuName = ".navOptAdviser";
    const opt0Func = function(){ profile(user); };
    const opt1Func = function(){ listAdvLeads(data); };
    const opt2Func = function(){ listAdvClients(data); };
    var optFunc = [opt0Func, opt1Func, opt2Func];    
  }
  if (menuType === "D") {
    //
    // Functions for Lead view options
    //
    var menuName = ".navOptLead";
    const opt0Func = function(){ profile(user); };
    const opt1Func = function(){ addLead(); };
    const opt2Func = function(){ selectLead(); };
    var optFunc = [opt0Func, opt1Func, opt2Func]; 
  }
  //
  // Select view navigation options from DOM
  //
  const menuOptions=document.querySelectorAll(menuName);
  console.log("Menu Options: ", menuOptions);
  //
  // Link required functions to navigation options
  //
  for(var i=0;i<menuOptions.length;i++) { 
    console.log("---> Option Func: ", optFunc[i]);
    menuOptions[i].onclick = optFunc[i];
    menuOptions[i].onmouseover = function(){ ChangeColor(this, true); };
    menuOptions[i].onmouseout = function(){ ChangeColor(this, false); };
    
  }
  console.log("---> Menu Options", menuOptions);
}

// // ====================================
// //  Filter table rows by column values
// // ====================================
// function pracLeadFilter(tableId, filterId) {
//   //
//   //  Read filter definition
//   //
//   var filter = filterDef(filterId);
//   console.log("---> Filter definition: ", filter);
//   //
//   // Read filter parameter values entered
//   //
//   var filterObj = {};
//   var cols = [];
//   var x = 0;
//   var colFilter = [], criteria = [];
//   var colCount = filter.definition.length;
//   console.log("---> Filter Column Count: ", colCount);
//   for (var i=0; i < colCount; i++) {
//     console.log("---> Filter ID: ", filter.definition[i].valueId);
//     colFilter[i] = document.getElementById(filter.definition[i].valueId).value;
//     if (colFilter[i].length > 0) {
//       cols[x] = filter.definition[i].tableCol;
//       criteria[x] = colFilter[i];
//       console.log("---> Filter values 0:", cols[x], criteria[x]);
//       x++;
//     }
//   }
//   filterObj = {
//     cols : cols,
//     criteria : criteria
//   }
//   console.log("---> Filter Obj: ", filterObj);
//   //
//   // Apply filter to table rows
//   //
//   filterTable(tableId, filterObj);
// }

// =============================================================================
//  Utilities - Table Display Functions 
// =============================================================================

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
  // Insert Table into DOM for display
  //
  var elementId = "tPos" + layoutId;
  var tPosElement = document.getElementById(elementId);
  tPosElement.innerHTML = "";
  tPosElement.appendChild(table); // add child element to document
  //
  // Update list section heading
  //
  if (title !== null) {
    var elementId = "title" + layoutId;
    document.getElementById(elementId).innerHTML = title;
  }
  console.log("<<< Data list display updated >>>");
}
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
    // user list
    var rowFunc = function(){ displayUser(this.cells[4].innerHTML); };
    // cells[4] = user email
  }
  if (id === "1"){
    // lead list
    var rowFunc = function(){ displayLead(this.cells[0].innerHTML); };
    // cells[0] = lead reference
  }
  if (id === "2"){
    // practice list
    var rowFunc = function(){ displayPractice(this.cells[0].innerHTML); };
    // cells[0] = practice code
  }
  if (id === "5"){
    // lead list
    var rowFunc = function(){ displayLead(this.cells[0].innerHTML); };
    // cells[0] = lead reference
  }
  for (var i = 1; i < rowCount; i++) {
      // ignore header, row 0
      rows[i].onclick = rowFunc;
      rows[i].onmouseover = function(){ ChangeColor(this, true); };
      rows[i].onmouseout = function(){ ChangeColor(this, false); };
  }
  console.log("<<< Row Handlers Added >>>");
}
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
        '{ "fname" : "practiceCode" , "label" : "Practice Code" }' +
        ']}'
      ;
    break;
    case '1':
      console.log("List Layout: 1 (Practice Leads)");
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
        '{ "fname" : "service" , "label" : "Service Required" },' +
        '{ "fname" : "comment1" , "label" : "Comment" },' +
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
        '{ "fname" : "practiceCode" , "label" : "Practice Code" }' +
        ']}'
      ;
    break;
    case '4':
      console.log("List Layout: 4 (Adviser Leads)");
      var layoutDef = '{ "definition" : [' +
        '{ "fname" : "reference" , "label" : "Ref No." },' +
        '{ "fname" : "status" , "label" : "Status" },' +
        '{ "fname" : "firstName" , "label" : "First Name" },' +
        '{ "fname" : "surname" , "label" : "Surname" },' +
        '{ "fname" : "langPref" , "label" : "Language" },' +
        //'{ "fname" : "contactNum" , "label" : "Contact #" },' +
        //'{ "fname" : "altNumber" , "label" : "Alternate #" },' +
        //'{ "fname" : "cellNumber" , "label" : "Cell #" },' +
        //'{ "fname" : "eMail" , "label" : "eMail" },' +
        '{ "fname" : "postal" , "label" : "Postal" },' +
        '{ "fname" : "suburb" , "label" : "Suburb" },' +
        '{ "fname" : "service" , "label" : "Service Required" },' +
        '{ "fname" : "comment1" , "label" : "Comment" },' +
        '{ "fname" : "comment2" , "label" : "Service Comment" }' +
        //
        // Change:
        //    Remove comments. Create function to only display
        //    last comment made by adviser on the lead.
        //
        ']}'
      ;
    break;
    case '5':
      console.log("List Layout: 5 (Leads)");
      var layoutDef = '{ "definition" : [' +
        '{ "fname" : "reference" , "label" : "Ref No." },' +
        '{ "fname" : "status" , "label" : "Status" },' +
        '{ "fname" : "firstName" , "label" : "First Name" },' +
        '{ "fname" : "surname" , "label" : "Surname" },' +
        '{ "fname" : "entityRefNum" , "label" : "ID/Reg Num" },' +
        '{ "fname" : "entityName" , "label" : "Org Name" },' +
        //'{ "fname" : "langPref" , "label" : "Language" },' +
        '{ "fname" : "contactNum" , "label" : "Contact #" },' +
        //'{ "fname" : "altNumber" , "label" : "Alternate #" },' +
        '{ "fname" : "cellNumber" , "label" : "Cell #" },' +
        //'{ "fname" : "eMail" , "label" : "eMail" },' +
        '{ "fname" : "postal" , "label" : "Postal" },' +
        '{ "fname" : "suburb" , "label" : "Suburb" },' +
        '{ "fname" : "service" , "label" : "Service Required" }' +
        //'{ "fname" : "comment1" , "label" : "Comment" },' +
        //'{ "fname" : "comment2" , "label" : "Service Comment" }' +
        ']}'
      ;
    break;
  }
  // console.log("Definition set: ", jText);
  var layout = JSON.parse(layoutDef); // convert JSON text into JS object
  // console.log("JSON Definition: ", layout);
  return layout;
}

// --------------------------
//  Table Filter definitions
// --------------------------
function filterDef(filterId) {
  switch (filterId) {
    case '1':
      console.log("Filter Definition: 1 (Practice Leads Filter)");
      var filterDef = '{ "definition" : [' +
        '{ "tableCol" : 0 , "valueId" : "prac-lead-ref-filter" },' +
        '{ "tableCol" : 1 , "valueId" : "prac-lead-status-filter" },' +
        '{ "tableCol" : 8 , "valueId" : "prac-lead-adviser-filter" }' +
        ']}'
      ;
    break;
    case '2':
      console.log("Filter Definition: 2 (Admin Practices Filter)");
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
  }
  var filter = JSON.parse(filterDef); // convert JSON text into JS object
  console.log("JSON Definition: ", filter);
  return filter;
}