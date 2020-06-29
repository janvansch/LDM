"use strict";

// ================================================
//  Global modal controls (adapted from w3schools)
// ================================================
var modal = document.getElementById('modalBox');
// var modalPrac = document.getElementById('modalPrac');

// Get the button that opens the modal
// var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var xButton = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
// btn.onclick = function() {
//    modal.style.display = "block";
// }

// ---------------------------------------------------
//  When close button (x) is clicked, close the modal
// ---------------------------------------------------
xButton.onclick = function() {
  //
  // Clear Add User Form
  //
  ////resetform("formAddUser");
  ////document.getElementById('displayUser').style.display = 'none';
  ////document.getElementById('s-ins-lines').style.display = 'none';
  ////document.getElementById('s-pl-types').style.display = 'none';
  ////document.getElementById('s-cl-types').style.display = 'none';
  ////document.getElementById('s-sl-types').style.display = 'none';
  ////document.getElementById('s-al-types').style.display = 'none';
  ////document.getElementById('s-xl-types').style.display = 'none';
  //
  // Clear Add Practice Form
  //
  ////resetform("formAddPractice");
  ////document.getElementById("addPractice").style.display = 'none';
  //
  // clear postal code table
  //
  ////var table = document.getElementById("tablePCode");
  ////table.innerHTML = "<tr> </tr>";
  //
  // Clear lead View Form
  //
  ////resetform("formLead");
  //resetform("formAddUser");
  //resetform("formAddPractice");
  resetForm("lead-form");
  resetForm("leadProgressForm");

  document.getElementById('lead-view').style.display = 'none';
  document.getElementById('lead-progress').style.display = 'none';
  //document.getElementById('v-ins-line').style.display = 'none';
  document.getElementById('v-pl-types').style.display = 'none';
  document.getElementById('v-cl-types').style.display = 'none';
  document.getElementById('v-sl-types').style.display = 'none';
  document.getElementById('v-al-types').style.display = 'none';
  document.getElementById('v-xl-types').style.display = 'none';

  //
  // Close modal display
  //
  modal.style.display = "none";
};

// --------------------------------------------------------------
//  When the user clicks anywhere outside of the modal, close it
// --------------------------------------------------------------
window.onclick = function(event) {
  if (event.target == modal) {
    //
    // Clear Add User Form
    //
    ////resetform("formAddUser");
    ////document.getElementById('displayUser').style.display = 'none';
    ////document.getElementById('s-ins-lines').style.display = 'none';
    ////document.getElementById('s-pl-types').style.display = 'none';
    ////document.getElementById('s-cl-types').style.display = 'none';
    ////document.getElementById('s-sl-types').style.display = 'none';
    ////document.getElementById('s-al-types').style.display = 'none';
    ////document.getElementById('s-xl-types').style.display = 'none';
    //
    // Clear Add Practice Form
    //
    ////resetform("formAddPractice");
    ////document.getElementById("addPractice").style.display = 'none';
    //
    // clear postal code table
    //
    ////var table = document.getElementById("tablePCode");
    ////table.innerHTML = "<tr> </tr>";
    //
    // Clear lead View Form
    //
    ////resetform("formLead");

    resetForm("lead-form");
    resetForm("leadProgressForm");
    document.getElementById('lead-view').style.display = 'none';
    document.getElementById('lead-progress').style.display = 'none';
    //document.getElementById('v-ins-lines').style.display = 'none';
    document.getElementById('v-pl-types').style.display = 'none';
    document.getElementById('v-cl-types').style.display = 'none';
    document.getElementById('v-sl-types').style.display = 'none';
    document.getElementById('v-al-types').style.display = 'none';
    document.getElementById('v-xl-types').style.display = 'none';

    //
    // Close modal display
    //
    modal.style.display = "none";
  }
};

// ==============================================================================
//  View Control
// ==============================================================================
// -------------------
//  Select start view
// -------------------
window.onload = function() {
  if (document.getElementById("viewLogin")){
    toggleView("section");
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
};

// -------------------------------------------------
//  Reset form, close panel view and open menu view
// -------------------------------------------------
function openMenu() {
  toggleView("nav");
  toggleView("section");
  toggleView("headerMain");
  toggleView("headerSub");

  // what does the line below do here??????????
  document.getElementById("tPos").innerHTML = 'Enter lead selection criteria and click "Find"';
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

// ==============================================================================
//  Login
// ==============================================================================

// -----------------------------------------------
//  Validate Login and Open View Required by Role
// -----------------------------------------------

// function login() {
//   //
//   //  Extract login credentials from login form
//   //
//   const loginData = document.getElementsByName("logindata");

//   if (loginData[0].value !== '' && loginData[1].value !== '') {
//     //
//     // Validate login credentials if provided
//     //
//     validate(loginData, (validUser) => {
//       var user = validUser.body;
//       var auth = validUser.x-auth;
//       //
//       // Close login View
//       //
//       toggleView("viewLogin");
//       //
//       // Open system
//       //
//       toggleView("section");
//       //toggleView("navLogin");
//       //
//       // Display user id in system header
//       //
//       document.getElementById("user").innerHTML = "User: " + user.email;
//       //
//       // Display Role View
//       //
//       openRoleView(user);
//     });
//   }
//   else {
//     //
//     // No login credentials provided
//     //
//     const prompt = "No login information ... please enter";
//     document.getElementById("prompt").innerHTML = prompt;
//   }
// }

// function login() {
//   //
//   //  Extract login credentials from login form
//   //
//   const login = document.getElementsByName("logindata");
//   //
//   //  If provided, request access from server
//   //
//   if (login[0].value !== '' && login[1].value !== '') {
//     //
//     // create login request
//     //
//     var request = JSON.stringify({
//       email: login[0].value,
//       password: login[1].value
//     });
//     var method = "POST";
//     var route = '/users/login';
//     var contentType = 'application/json';
//     //
//     //  Send login request to server
//     //
//     xhrRequest(method, route, contentType, request, (err, result) => {
//       if (!err) {
//         //
//         // Login credentials valid
//         //
//         const resHeader = result.getResponseHeader("x-auth");
//         const resBody = result.responseText;
//         console.log("===> Server response: ", result);
//         // const resStr = '{"x-auth":"' + resHeader + '","body":' + resBody + '}';
//         // const resObj = JSON.parse(resStr);
//         // console.log("===> Server response: ", resObj);
//         //var user = validUser.body;
//         //var auth = validUser.x-auth;
//         //
//         // Close login View
//         //
//         toggleView("viewLogin");
//         //
//         // Open system
//         //
//         toggleView("section");
//         //toggleView("navLogin");
//         //
//         // Display user id in system header
//         //
//         //document.getElementById("user").innerHTML = "User: " + user.email;
//         //
//         // Display Role View
//         //
//         openRoleView(user);
//       }
//       else {
//         //
//         // Login credentials invalid
//         //
//         const prompt = "Login invalid ... re-enter information";
//         document.getElementById("prompt").innerHTML = prompt;
//       }
//     });

//   }
//   else {
//     //
//     // No login credentials provided
//     //
//     const prompt = "No login information ... please enter";
//     document.getElementById("prompt").innerHTML = prompt;
//   }
// }

// ----------------------------
//  Validate login credentials
// ----------------------------
// function validate(login, callback) {
//   //
//   // create server login request
//   //
// 	var request = JSON.stringify({
// 	    email: login[0].value,
// 			password: login[1].value
// 	});
//   var method = "POST";
// 	var route = '/users/login';
//   var contentType = 'application/json';
//   //
//   //  Send login request to server
//   //
//   xhrRequest(method, route, contentType, request, (err, result) => {
//     if (!err) {
//       //
//       // Login credentials valid
//       //
//       const resHeader = result.getResponseHeader("x-auth");
//       const resBody = result.responseText;
//       const resStr = '{"x-auth":"' + resHeader + '","body":' + resBody + '}';
//       const resObj = JSON.parse(resStr);
//       callback(resObj);
//     }
//     else {
//       //
//       // Login credentials invalid
//       //
//       const prompt = "Login invalid ... re-enter information";
//       document.getElementById("prompt").innerHTML = prompt;
//     }
//   });
// }

// ----------------
//  Open role view
// ----------------
// function openRoleView(user) {
//   const userId = user._id;
//   const userEmail = user.email;
//   const userRole = user.roleCode;
//   const userPracCode = user.practiceCode;
//   console.log(`>>> User Id: ${userId}, User eMail: ${userEmail}, User Role: ${userRole}, Practice Code: ${userPracCode}`);
//   if (userRole==="A") {
//     toggleView("viewAdmin");
//     toggleView("navAdmin");
//     navSetup("A");
//   }
//   else if (userRole==="B") {
//     toggleView("viewPractice");
//     toggleView("navPractice");
//     navSetup("B", userEmail, userPracCode);
//   }
//   else if (userRole==="C") {
//     toggleView("viewAdviser");
//     toggleView("navAdviser");
//     //showLeads(userID, userPracCode );
//     //listAdvLeads();
//     navSetup("C", userEmail, userEmail);
//   }
//   else if (userRole==="D"){
//     toggleView("viewLead");
//     toggleView("nav");
//     toggleView("navLead");
//     navSetup("D", userId, userId);
//   }
//   else {
//     console.log(`>>> Error - No role defined!
//       User ID: ${userId},
//       User Role: ${userRole},
//       Practice Code: ${userPracCode}`);
//   }
// }

// -------------------------------
//  Setup view navigation options
// -------------------------------
// function navSetup(menuType, user, data) {
//   //
//   // Functions for view navigation options
//   //
//   if (menuType === "A") {
//     //
//     // Functions for Admin view options
//     //
//     var menuName = ".navOptAdmin"; // user outside the block
//     const opt0Func = function(){ profile(user); }; // has block scope
//     const opt1Func = function(){ listPractices(); }; // has block scope
//     const opt2Func = function(){ listUsers(); }; // has block scope
//     var optFunc = [opt0Func, opt1Func, opt2Func]; // user outside the block
//   }
//   if (menuType === "B") {
//     //
//     // Functions for Practice view options
//     //
//     var menuName = ".navOptPrac";
//     const opt0Func = function(){ profile(user); };
//     const opt1Func = function(){ listPracLeads(data); };
//     const opt2Func = function(){ listAdvisers(data); };
//     var optFunc = [opt0Func, opt1Func, opt2Func];
//   }
//   if (menuType === "C") {
//     //
//     // Functions for Adviser view options
//     //
//     var menuName = ".navOptAdviser";
//     const opt0Func = function(){ profile(user); };
//     const opt1Func = function(){ listAdvLeads(data); };
//     const opt2Func = function(){ listAdvClients(data); };
//     var optFunc = [opt0Func, opt1Func, opt2Func];
//   }
//   if (menuType === "D") {
//     //
//     // Functions for Lead view options
//     //
//     var menuName = ".navOptLead";
//     const opt0Func = function(){ profile(user); };
//     const opt1Func = function(){ addLead(); };
//     const opt2Func = function(){ selectLead(); };
//     var optFunc = [opt0Func, opt1Func, opt2Func];
//   }
//   //
//   // Select view navigation options from DOM
//   //
//   const menuOptions=document.querySelectorAll(menuName);
//   console.log("Menu Options: ", menuOptions);
//   //
//   // Link required functions to navigation options
//   //
//   for(var i=0;i<menuOptions.length;i++) {
//     console.log("---> Option Func: ", optFunc[i]);
//     menuOptions[i].onclick = optFunc[i];
//     menuOptions[i].onmouseover = function(){ ChangeColor(this, true); };
//     menuOptions[i].onmouseout = function(){ ChangeColor(this, false); };
//   }
//   console.log("---> Menu Options", menuOptions);
// }

// ====================================
//  Filter table rows by column values
// ====================================
function pracLeadFilter(tableId, filterId) {
  //
  //  Read filter definition
  //
  var filter = filterDef(filterId);
  console.log("---> Filter definition: ", filter);
  //
  // Read filter parameter values entered
  //
  var filterObj = {};
  var cols = [];
  var x = 0;
  var colFilter = [], criteria = [];
  var colCount = filter.definition.length;
  console.log("---> Filter Column Count: ", colCount);
  for (var i=0; i < colCount; i++) {
    console.log("---> Filter ID: ", filter.definition[i].valueId);
    colFilter[i] = document.getElementById(filter.definition[i].valueId).value;
    if (colFilter[i].length > 0) {
      cols[x] = filter.definition[i].tableCol;
      criteria[x] = colFilter[i];
      console.log("---> Filter values 0:", cols[x], criteria[x]);
      x++;
    }
  }
  filterObj = {
    cols : cols,
    criteria : criteria
  }
  console.log("---> Filter Obj: ", filterObj);
  //
  // Apply filter to table rows
  //
  filterTable(tableId, filterObj);
}

// =============================================================================
//  Utilities - Reusable Data Display Functions
// =============================================================================
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
      document.getElementById(prefix + "-" + services[i].line.toLocaleLowerCase() + "-" + services[i].types[x].toLocaleLowerCase().replace(/\s/g, '-')).checked = true;
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

//
// The functions below can be removed once user skill and add lead
// functions has been converted to use the new data driven product structure
//
// function servPers() {
//   if (document.getElementById('pServType').checked) {
//     // if selected switch on
//     document.getElementById('dispPersServ').style.display = 'block';
//   }
//   else {
//     // if not selected switch off
//     document.getElementById('dispPersServ').style.display = 'none';
//   }
// }
// function plDispSwitch() {
//   if (document.getElementById('p-line').checked) {
//     // if selected switch on
//     document.getElementById('pl-types').style.display = 'block';
//   }
//   else {
//     // if not selected switch off
//     document.getElementById('pl-types').style.display = 'none';
//   }
// }
// function servComm() {
//   if (document.getElementById('cServType').checked) {
//     document.getElementById('dispCommServ').style.display = 'block';
//   }
//   else {
//     document.getElementById('dispCommServ').style.display = 'none';
//   }
// }
// function clDispSwitch() {
//   if (document.getElementById('c-line').checked) {
//     document.getElementById('cl-types').style.display = 'block';
//   }
//   else {
//     document.getElementById('cl-types').style.display = 'none';
//   }
// }
// function servSasr() {
//   if (document.getElementById('sServType').checked) {
//     document.getElementById('dispSasrServ').style.display = 'block';
//   }
//   else {
//     document.getElementById('dispSasrServ').style.display = 'none';
//   }
// }
// function slDispSwitch() {
//   if (document.getElementById('s-line').checked) {
//     document.getElementById('sl-types').style.display = 'block';
//   }
//   else {
//     document.getElementById('sl-types').style.display = 'none';
//   }
// }
// function servAgri() {
//   if (document.getElementById('aServType').checked) {
//     document.getElementById('dispAgriServ').style.display = 'block';
//   }
//   else {
//     document.getElementById('dispAgriServ').style.display = 'none';
//   }
// }
// function alDispSwitch() {
//   if (document.getElementById('a-line').checked) {
//     document.getElementById('al-types').style.display = 'block';
//   }
//   else {
//     document.getElementById('al-types').style.display = 'none';
//   }
// }
// function servSpec() {
//   if (document.getElementById('xServType').checked) {
//     document.getElementById('dispSpecServ').style.display = 'block';
//   }
//   else {
//     document.getElementById('dispSpecServ').style.display = 'none';
//   }
// }
// function xlDispSwitch() {
//   if (document.getElementById('x-line').checked) {
//     document.getElementById('xl-types').style.display = 'block';
//   }
//   else {
//     document.getElementById('xl-types').style.display = 'none';
//   }
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
  if (layoutId !== "1" && layoutId !== "4" && layoutId !== "5") {
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
    // practice leads list
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
    var rowFunc = function(){ displayAdvisers(this.cells[0].innerHTML); };
    // cells[0] = adviser code
  }
  if (id === "4"){
    // adviser leads list
    var rowFunc = function(){ displayLead(this.cells[0].innerHTML, id); };
    // cells[0] = lead reference
  }
  if (id === "5"){
    // leads list
    var rowFunc = function(){ displayLead(this.cells[0].innerHTML, id); };
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
        '{ "fname" : "service" , "label" : "Service(s)" },' +
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
  }
  var filter = JSON.parse(filterDef); // convert JSON text into JS object
  console.log("JSON Definition: ", filter);
  return filter;
};