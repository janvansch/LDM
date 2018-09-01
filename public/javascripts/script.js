"use strict";
// ==========================
//  Initiate
// ==========================
window.onload = function() {
    document.getElementById('ifPersonal').style.display = 'none';
    document.getElementById('ifCommercial').style.display = 'none';
    document.getElementById('ifSasria').style.display = 'none';
    document.getElementById('ifAgriculture').style.display = 'none';
    document.getElementById('ifSpecialist').style.display = 'none';
    document.getElementById('ServiceComment').style.display = 'none';
    toggleView("viewLogin");
}
// -------------------------------------------
//  Global modal controls (source: w3schools)
// -------------------------------------------
var modal = document.getElementById('modalBox');
// Get the button that opens the modal
// var btn = document.getElementById("myBtn");
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
// When the user clicks the button, open the modal
//btn.onclick = function() {
//    modal.style.display = "block";
//}
// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
// =====================================
// * Login and open view for user role *
// =====================================
function login() {
  // -------------------------------
  //  Authenticate user credentials
  // -------------------------------
  authenticateLogin((validUser) => {
    console.log(">>> Valid User Data: ", validUser.body);
    var user = validUser.body;
    // var x-auth = validUser.x-auth;
    // ------------------
    //  Close login View
    // ------------------
    toggleView("viewLogin");
    // --------------------------
    //  Display Role View
    // --------------------------
    openView(user);
  });
}

// -------------------------------
//  Authenticate login credentials
// -------------------------------
function authenticateLogin(callback) {
  // -------------------------------
  //  Get login data from DOM input
  // -------------------------------
  var loginData = document.getElementsByName("logindata");
  if (loginData[0].value !== '' && loginData[1].value !== '') {
    // --------------------------
    //  create Login data object
    // --------------------------
		var loginData = {
		    email: loginData[0].value,
				password: loginData[1].value
		};
		var request = JSON.stringify(loginData);
    var method = "POST";
		var route = '/users/login';
    var contentType = 'application/json';
    //console.log(">>> Server Request:", request, path, contentType);
    // --------------------
    //  Send login Request
    // --------------------
    //xhttpRequest(request, path, contentType, function(err, result) {
    xhrRequest(method, route, contentType, request, (err, result) => {
      // ------------------------------
      //  Process login Attempt Result
      // ------------------------------
      if (!err) {
        // ---------------
        // extract Result
        // ---------------
        var resHeader = result.getResponseHeader("x-auth");
        var resBody = result.responseText;
        //console.log(`>>> Result returned: Header = ${resHeader}, Body = ${resBody}`);
        var resStr = '{"x-auth":"' + resHeader + '","body":' + resBody + '}';
        var resObj = JSON.parse(resStr);
        //console.log(">>> Body Object: ", resObj);
        var user = "User: " + resObj.body.email;
        document.getElementById("user").innerHTML = user;
        callback(resObj);
      }
      else {
        var prompt = "Login invalid ... re-enter information";
        document.getElementById("prompt").innerHTML = prompt;
      }
    });
  }
  else {
    var prompt = "No login information ... please enter";
    document.getElementById("prompt").innerHTML = prompt;
  }
}

// ----------------------------
//  Open role view
// ----------------------------
function openView(user) {
  var userID = user._id;
  var userPracCode = user.practiseCode;
  var userRole = user.roleCode;
  console.log(`>>> User ID: ${userID}, User Role: ${userRole}, Practice Code: ${userPracCode}`);
  if (userRole==="A") {
    toggleView("viewAdmin");
    toggleView("navAdmin");
  }
  else if (userRole==="B") {
    toggleView("viewPractice");
    toggleView("navPractice");
    // Display the leads of the practise
    // displayLeads(userPracCode);
  }
  else if (userRole==="C") {
    toggleView("viewAdviser");
    toggleView("navAdviser");
    // showLeads(userID, userPracCode );
  }
  else {
    toggleView("viewLead");
    toggleView("navLead");
  }
}
//================================
// User Administration Processing
//================================
// --------------------------------------------------------------------
//  List system users and enable add, update and remove user functions
// --------------------------------------------------------------------
function listUsers() {
  //
  // Switch User Maintenance Display on
  //
  document.getElementById('panelAdminUser').style.display = 'block';
  //
  // Switch Practise Maintenance Display off
  //
  document.getElementById('panelAdminPrac').style.display = 'none';
  //
  // Create User Data request
  //
  var request = "XXXX";
  var method = "GET";
  var route = "/users/list";
  var contentType = "application/json";
  //
  //  Request User Data from Server
  //
  xhrRequest(method, route, contentType, request, (err, res) => {
    console.log(">>> res: ", res.responseText);
    if (!err) {
      var data = JSON.parse(res.responseText);
      console.log(">>> Users: ", data);
      //
      // load user table layout definition
      //
      var layoutId = '0';
      var prompt = 'User list:';
      //
      // Display user data list as table
      //
      displayData(data, prompt, layoutId);
    }
    else {
      var prompt = "Lead request error";
      document.getElementById("leadErr").innerHTML = prompt;
    }
  });
}
// ==================================
//  Accreditation and Skill Switches
// ==================================
function isAdviser() {
  if (document.getElementById('roleC').checked) {
    // switch accreditation and skills on
    document.getElementById('selectAbility').style.display = 'block';
  }
  else if (
      document.getElementById('roleA').checked ||
      document.getElementById('roleB').checked ||
      document.getElementById('roleD').checked
    ) {
    // switch accreditation and skills off
    document.getElementById('selectAbility').style.display = 'none';
  }
}
// ------------------------
//  Open user capture form
// ------------------------
function addUser() {
  // open model window
  // var modal = document.getElementById('modalBox');
  modal.style.display = "block";
  //document.getElementById("viewAdminUser").style.display = 'block';
  // open add user form
  document.getElementById("addUser").style.display = 'block';

}
// ---------------------
//  Delete User
// ---------------------
function deleteUser() {

}
// ---------------------
//  Update User
// ---------------------
function updateUser() {

}

// ----------------------------
//  Submit User Data to Server
// ----------------------------
function submitUser() {
  // -------------------
  //  Get data from DOM
  // -------------------
  var userData = document.getElementsByName("userdata");
  console.log("Login data input:", userData);
  if(document.getElementById('roleA').checked) {
    role = "A";
  }
  else if(document.getElementById('roleB').checked) {
    role = "B";
  }
  else if(document.getElementById('roleC').checked) {
    role = "C";
  }
  else if(document.getElementById('roleD').checked) {
    role = "D";
  }
  name = userData[0].value;
  surname = userData[1].value;
  console.log("User data input:", name, surname, role);
}
//====================================
// Practise Administration Processing
//====================================
// -----------------------------------
//  Open Practice Maintenance Display
// -----------------------------------
function listPractices() {
  //
  // Switch User Maintenance Display on
  //
  document.getElementById('panelAdminPrac').style.display = 'block';
  //
  // Switch Practise Maintenance Display off
  //
  document.getElementById('panelAdminUser').style.display = 'none';
  //
  // Create User Data request
  //
  var request = "XXXX";
  var method = "GET";
  var route = "/users/list";
  var contentType = "application/json";
  //
  //  Request User Data from Server
  //
  xhrRequest(method, route, contentType, request, (err, res) => {
    if (!err) {
      var data = JSON.parse(res.responseText);
      console.log(">>> lead Docs: ", data);
      //
      // load table layout definition
      //
      var dataSource = '2';
      var objRules = readRules(dataSource);
      var prompt = 'Lead data for: ' + request;
      var formatData = [];
      var rowCount = data.length;
      for (var i=0; i < rowCount; i++) {
        //
        // Extract data into list
        //
        var cells = [];
        cells.push((typeof data[i].status === 'undefined') ? (" - ") : (data[i].status));
        cells.push((typeof data[i].firstName === 'undefined') ? (" - ") : (data[i].firstName));
        cells.push((typeof data[i].surname === 'undefined') ? (" - ") : (data[i].surname));
        cells.push((typeof data[i].langPref === 'undefined') ? (" - ") : (data[i].langPref));
        cells.push((typeof data[i].contactNum === 'undefined') ? (" - ") : (data[i].contactNum));
        cells.push((typeof data[i].altNumber === 'undefined') ? (" - ") : (data[i].altNumber));
        cells.push((typeof data[i].cellNumber === 'undefined') ? (" - ") : (data[i].cellNumber));
        cells.push((typeof data[i].eMail === 'undefined') ? (" - ") : (data[i].eMail));
        cells.push((typeof data[i].contactLocation.postal === 'undefined') ? (" - ") : (data[i].contactLocation.postal));
        cells.push((typeof data[i].contactLocation.suburb === 'undefined') ? (" - ") : (data[i].contactLocation.suburb));
        cells.push((typeof data[i].service === 'undefined') ? (" - ") : (data[i].service));
        cells.push((typeof data[i].comments.comment1 === 'undefined') ? (" - ") : (data[i].comments.comment1));
        cells.push((typeof data[i].comments.comment2 === 'undefined') ? (" - ") : (data[i].comments.comment2));
        formatData[i] = cells;
        console.log("---> Report Row Data: ", i, formatData[i]);
      }
      //
      // Display data list as table
      //
      displayData(formatData, prompt, objRules, dataSource);
    }
    else {
      var prompt = "Lead request error";
      document.getElementById("leadErr").innerHTML = prompt;
    }
  });
}
//=================
// Lead Processing
//=================
// ---------------------------
//  Send lead data to server
// ---------------------------
function submitLead() {
  console.log("*** Submit Lead Function ***");
  //
  //  Extract Contact Data
  //
  var contactData = document.getElementById("contactForm");
  var radioName = "";
  var formElement = "";
  var inputType = "";
  // extract language preference
  radioName = "langPref";
  var contactLanguage = getRadioCheckedValue(contactData, radioName);
  // extract text data from contact form
  formElement = "input";
  inputType = "text";
  var contactInfo = extractFormData(contactData, formElement, inputType);
  // extract email data from contact form
  formElement = "input";
  inputType = "email";
  var contactEmail = extractFormData(contactData, formElement, inputType);
  // extract selected day checkbox values
  var checkboxName = "contactDay";
  var contactDays = getCheckedValues(contactData, checkboxName);
  if (Object.keys(contactDays).length === 0 && contactDays.constructor === Object) {
    var name = "contactDay";
    var value = [];
    value.push("any");
    contactDays[name] = value;
  }
  // extract contact time
  formElement = "input";
  inputType = "time";
  var contactTime = extractFormData(contactData, formElement, inputType);
  // extract before or after
  radioName = "timeBA";
  var contactTimeBA = getRadioCheckedValue(contactData, radioName);
  if (Object.keys(contactTimeBA).length === 0 && contactTimeBA.constructor === Object) {
    var name = "timeBA";
    var value = [];
    value.push("n/a");
    contactTimeBA[name] = value;
  }
  // extract comment data from contact form
  var formElement = "textarea";
  var contactComment = extractFormData(contactData, formElement);
  // extract postal codes
  formElement = "input";
  inputType = "number";
  var contactPostalCode = extractFormData(contactData, formElement, inputType);
  //
  //  Extract Cover Data
  //
  var coverData = document.getElementById("coverForm");
  var checkboxName = "service";
  var coverInfo = getCheckedValues(coverData, checkboxName);
  if (Object.keys(coverInfo).length === 0 && coverInfo.constructor === Object) {
  //var array = coverInfo.perService;
  //if (array.length === 0 && array.constructor === Array) {
    //
    // ************ ERROR ***********
    //  A sevice must be selected
    //
    var name = "service";
    var value = [];
    value.push("none selected");
    coverInfo[name] = value;
  }
  formElement = "textarea";
  var coverComment = extractFormData(coverData, formElement);
  //
  //  create Lead data object
  //
  var leadData = {
    lead: [
      contactLanguage,
      contactInfo,
      contactEmail,
      contactDays,
      contactTime,
      contactTimeBA,
      contactComment,
      contactPostalCode,
      coverInfo,
      coverComment
    ]
  };
  console.log("---> Lead Object: ", leadData);
  var dataString = JSON.stringify(leadData);
  console.log("---> Lead String: ", dataString);
  var path = "/leads/add";
  var contentType = "application/json";
  //
  //  Send Lead POST Request
  //
  xhttpRequest(dataString, path, contentType, function(err, result) {
    if (!err) {
      var resBody = result.responseText;
      //console.log(`>>> Result returned: Header = ${resHeader}, Body = ${resBody}`);
      console.log(`>>> Result returned: Body = ${resBody}`);
      //var resObj = JSON.parse(resBody);
    }
    else {
      var prompt = "Lead submit error";
      document.getElementById("leadErr").innerHTML = prompt;
    }
  });
}
// =========================================================
//  Lead Contact Form and Service Required Display Switches
// =========================================================
function leadOk() {
  if (document.getElementById('trfSTAYes').checked) {
    // switch Yes on
    document.getElementById('contactForm').style.display = 'block';
    document.getElementById('insSelector').style.display = 'block';
    // switch No off
    document.getElementById('noForm').style.display = 'none';
  }
  else if (document.getElementById('trfSTANo').checked) {
    // switch No on
    document.getElementById('noForm').style.display = 'block';
    // switch Yes off
    document.getElementById('contactForm').style.display = 'none';
    document.getElementById('insSelector').style.display = 'none';
    // switch other off as well
    document.getElementById('ifPersonal').style.display = 'none';
    document.getElementById('ifCommercial').style.display = 'none';
    document.getElementById('ifSasria').style.display = 'none';
    document.getElementById('ifAgriculture').style.display = 'none';
    document.getElementById('ifSpecialist').style.display = 'none';
    document.getElementById('ServiceComment').style.display = 'none';
  // need to clear previous selections as well
  //  document.getElementById("myForm").reset();
  //  document.getElementById('ifPersonal').reset();
  //  document.getElementById('ifCommercial').reset();
  //  document.getElementById('ifSasria').reset();
  //  document.getElementById('ifAgriculture').reset();
  //  document.getElementById('ifSpecialist').reset();
  }
}
// ==================================
//  Lead Cover Form Display Switches
// ==================================
function line() {
  if (document.getElementById('personal').checked) {
    // switch on
    document.getElementById('ifPersonal').style.display = 'block';
    console.log("*** Personal Insurance Selected ***");
    // switch rest off
    document.getElementById('ifCommercial').style.display = 'none';
    document.getElementById('ifSasria').style.display = 'none';
    document.getElementById('ifAgriculture').style.display = 'none';
    document.getElementById('ifSpecialist').style.display = 'none';
  }
  else if(document.getElementById('commercial').checked) {
    document.getElementById('ifCommercial').style.display = 'block';
    console.log("*** Commercial Insurance Selected ***");
    document.getElementById('ifPersonal').style.display = 'none';
    document.getElementById('ifSasria').style.display = 'none';
    document.getElementById('ifAgriculture').style.display = 'none';
    document.getElementById('ifSpecialist').style.display = 'none';
  }
  else if(document.getElementById('sasria').checked) {
    document.getElementById('ifSasria').style.display = 'block';
    console.log("*** SASRIA Insurance Selected ***");
    document.getElementById('ifPersonal').style.display = 'none';
    document.getElementById('ifCommercial').style.display = 'none';
    document.getElementById('ifAgriculture').style.display = 'none';
    document.getElementById('ifSpecialist').style.display = 'none';
  }
  else if(document.getElementById('agriculture').checked) {
    document.getElementById('ifAgriculture').style.display = 'block';
    console.log("*** Agriculture Insurance Selected ***");
    document.getElementById('ifPersonal').style.display = 'none';
    document.getElementById('ifCommercial').style.display = 'none';
    document.getElementById('ifSasria').style.display = 'none';
    document.getElementById('ifSpecialist').style.display = 'none';
  }
  else if(document.getElementById('specialist').checked) {
    document.getElementById('ifSpecialist').style.display = 'block';
    console.log("*** Specialist Insurance Selected ***");
    document.getElementById('ifPersonal').style.display = 'none';
    document.getElementById('ifCommercial').style.display = 'none';
    document.getElementById('ifSasria').style.display = 'none';
    document.getElementById('ifAgriculture').style.display = 'none';
  }
  document.getElementById('ServiceComment').style.display = 'block';
}
// =======================================
//  Practise Administration Functionality
// =======================================
// ------------------------
//  Display practise leads
// ------------------------
function listLeads() {
  //
  // Switch leads Display on
  //
  document.getElementById('panelLeadAlloc').style.display = 'block';
  //
  // Switch Practise Maintenance Display off
  //
  document.getElementById('panelAdvMaint').style.display = 'none';
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
      // Display Report
      //
      displayData(data, prompt, layoutId);
    }
    else {
      var prompt = "Lead request error";
      document.getElementById("leadErr").innerHTML = prompt;
    }
  });
}
function listAdvisers() {
  //
  // Switch leads Display on
  //
  document.getElementById('panelAdvMaint').style.display = 'block';
  //
  // Switch Practise Maintenance Display off
  //
  document.getElementById('panelLeadAlloc').style.display = 'none';
  //
  // Create Leads Data request
  //
  var request = "XXXX";
  var method = "GET";
  var route = "/leads/advisers";
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
      var prompt = 'Adviser data for: ' + request;
      //
      // Display Report
      //
      displayData(data, prompt, layoutId);
    }
    else {
      var prompt = "Lead request error";
      document.getElementById("leadErr").innerHTML = prompt;
    }
  });
}
function allocateAdviser() {
  console.log("===> Allocate Adviser Started");

  // var leadRef, adviserRef;
  //
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
// =============================
//  Form Data Extract Utilities
// =============================
// -------------------------------------------------------------
//  Return values of specified element type from specified form
// -------------------------------------------------------------
function extractFormData(form, formElement, inputType) {
  console.log("===> Extract Form Data for: ", formElement, inputType);
  var selector = "";
  if (formElement === "input" && inputType !== "") {
    selector = 'input[' + 'type="' + inputType + '"]';
  }
  else if (formElement !== "input" && inputType === undefined) {
    selector = formElement;
  }
  else {
    console.log("===> Selector Error!");
    selector = "";
  }
  var el = form.querySelectorAll(selector);
  var myData = {};
  if (formElement === "input" && inputType === "checkbox") {
    // get checked values
    for (var x = 0; x < el.length; x++) {
      if (el[x].checked) {
        var name = el[x].name;
        var value = el[x].value;
        myData[name] = value;
      }
    }
    return myData;
  }
  else {
    for (var x = 0; x < el.length; x++) {
      var name = el[x].name;
      var value = el[x].value;
      myData[name] = value;
    }
    return myData;
  }
}
// ----------------------------------------------------------
//  Return the values of the checked checkboxes in the group
// ----------------------------------------------------------
function getCheckedValues(form, checkboxName) {
  var selector = 'input[' + 'name="' + checkboxName + '"]';
  var el = form.querySelectorAll(selector);
  var checked = {};
  var checkedValues = [];
  for (var x = 0; x < el.length; x++) {
    if (el[x].checked) {
      checkedValues.push(el[x].value);
    }
  }
  if (checkedValues.length !== 0) {
    checked[checkboxName] = checkedValues;
  }
  return checked;
}
// ------------------------------------------------
//  Return the value of the selected radio buttons
// ------------------------------------------------
function getRadioCheckedValue(form, radioName) {
  var selector = 'input[' + 'name="' + radioName + '"]';
  var radio = form.querySelectorAll(selector);
  console.log("===> Radio extracted: ", radio);
  var rData = {};
  for (var i = 0; i < radio.length; i++) {
    if(radio[i].checked) {
      var name = radio[i].name;
      var value = radio[i].value;
      rData[name] = value;
      return rData;
    }
  }
  return rData;
}
// --------------------------
//  Reset the specified form
// --------------------------
function formReset(form) {
    document.getElementById(form).reset();
}
// =========================================
//  Create table and display content in DOM
// =========================================
function displayData(content, prompt, layoutId) {
  //function displayData(listContent, listPrompt, objRules, dataSource) {
  console.log("Content: ", content);
  //var rowCount = content.length;
  //var contentColCount = content[0].length;
  // -----------------------------------
  //  Read layout definition
  // -----------------------------------
  var layout = readLayout(layoutId);
  //var layoutColCount = layout.definition.length;
  //if (layoutColCount !== contentColCount) {
  //  console.log(`==> Err: Column Count issue: expected = ${layoutColCount} data = ${contentColCount}`);
  //  alert(`==> Warning: Number of columns problem: expected = ${layoutColCount} but data = ${contentColCount}`);
  //}
  // ------------------------------------
  //  Extract table content from content
  // ------------------------------------
  var tableContent = [];
  var rowCount = content.length;
  var colCount = layout.definition.length;
  for (var i=0; i < rowCount; i++) {
    var cells = [];
    for (var j=0; j < colCount; j++) {
      // objectName["propertyName"]
      console.log(`---> layout Column: ${j} Field Name: ${layout.definition[j].fname}`);
      cells.push((typeof content[i][layout.definition[j].fname] === 'undefined') ? (" - ") : (content[i][layout.definition[j].fname]));
      //cells.push((typeof content[i][layout.definition[j].fname] === 'undefined') ? (" - ") : (content[i][layout.definition[j].fname]));
      console.log(`---> Data Row: ${i} Data: ${cells}`);
    }
    tableContent[i] = cells;
    //console.log(`---> Report Row: ${i} Data: ${tableContent[i]}`);
  }
  // ---------------------------------
  //  Create content table
  // ---------------------------------
  //
  // creates a table element
  //
  var table = document.createElement('table');
  //
  // Give table an id to reference it
  //
  table.setAttribute('id','dataList');
  //
  // create header
  //
  var header = table.createTHead();
  //
  // create header row
  //
  var headerRow = header.insertRow(0);
  //
  // create cells and insert label content
  //
  for (var j = 0; j < colCount; j++) {
    var headerCell = headerRow.insertCell(-1);
    headerCell.innerHTML = layout.definition[j].label;
  }
  //
  // create body
  //
  var body = table.createTBody();
  //
  //
  // create a body row for each data row
  //
  for (var i = 0; i < rowCount; i++) {
    //
    // insert a body row for each data row
    //
    var tableRow = body.insertRow(-1);
    //
    // insert a cell for each data column
    //
    for (var j = 0; j < colCount; j++) {
      //
      // insert a cell
      //
      var tableCell = tableRow.insertCell(-1);
      //
      // insert content into table cell
      //
      //console.log("Table Cell: ", i, j, listContent[i][j]);
      tableCell.innerHTML = (isString(tableContent[i][j]) ? (tableContent[i][j].trim()) : (tableContent[i][j]));
    } // end of column loop
  } // end of row loop
  //
  // Insert Table into DOM for display
  //
  var tableId = "table" + layoutId;
  var tablePos = document.getElementById(tableId);
  tablePos.innerHTML = "";
  tablePos.appendChild(table); // add child element to document
  //
  // Update list section heading
  //
  if (prompt !== null){
    var listDesc = "list" + layoutId;
    document.getElementById(listDesc).innerHTML = prompt;
  }
  console.log("<<< Data list display updated >>>");
}
// ================================
//  Generic XMLHttpRequest handler
// ================================
function xhrRequest(method, route, contentType, request, callback) {
  //Validate params - if params not valid end immediately
  if (request == null || route == null || contentType == null) {
    console.log("<<< ERROR - required parameters not provided >>>");
  }
  else if (typeof callback !== "function"){
    console.log("<<< ERROR - the callback is not a function >>>");
  }
  else {
    if (window.XMLHttpRequest) {
      var xhr = new XMLHttpRequest();
    }
    else {
      // code for IE6, IE5
      var xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhr.onreadystatechange = function() {
      // Monitor request progress
      console.log("Ready state:", xhr.readyState);
      if (xhr.readyState == 4) {
        // Request complete
        if (xhr.status == 200) {
          // status 200 - success
          var err = false;
          callback(err, xhr);
        }
        else {
          // Request failed
          var err = true;
          console.log(`*** XHR request failure - status = ${xhr.status} ***`);
          console.log(">>> Error result: ", xhr.responseText);
          callback(err, '');
        }
      }
    }
    //Request transact data from server
    xhr.open(method, route);
    xhr.setRequestHeader("Content-type", contentType);
    xhr.send(request);
  }
}
// ===============================
//  Views display toggle function
// ===============================
function toggleView(viewID){
    var state = '';
    var login = document.getElementById(viewID);
    if(login.style.display == "block") {
        login.style.display = "none";
        state = "OFF";
    }
    else {
        login.style.display = "block";
        state = "ON";
    }
    console.log(`---> ${viewID} is ${state}`);
}
// -------------------------------------------
//  Switch policy edit section display on/off
// -------------------------------------------
function toggleEdit(edPrompt){
    var edit = document.getElementById("poledit");
    if(edit.style.display == "block") {
        edit.style.display = "none";
        clearEdit();
    } else {
        edit.style.display = "block";
    }
    document.getElementById("edHead").innerHTML = edPrompt;
}
//========================================================
// Read required data definition as an object
//========================================================
function readLayout(definitionId) {

  switch (definitionId) {
    case '0':
      console.log("Rules case: 0 (User)");
      var layoutDef = '{ "definition" : [' +
        '{ "fname" : "firstName" , "label" : "First Name" },' +
        '{ "fname" : "surname" , "label" : "Surname" },' +
        '{ "fname" : "phone" , "label" : "Phone" },' +
        '{ "fname" : "cell" , "label" : "Cell" },' +
        '{ "fname" : "email" , "label" : "email" },' +
        '{ "fname" : "roleCode" , "label" : "Role" },' +
        '{ "fname" : "practiceCode" , "label" : "Practice Code" },' +
        '{ "fname" : "accreditation" , "label" : "Accreditation" },' +
        '{ "fname" : "skill" , "label" : "Skills" }' +
        ']}'
      ;
    break;
    case '1':
      console.log("Rules case: 1 (Practise Lead)");
      var layoutDef = '{ "definition" : [' +
        '{ "fname" : "status" , "label" : "Status" },' +
        '{ "fname" : "firstName" , "label" : "First Name" },' +
        '{ "fname" : "surname" , "label" : "Surname" },' +
        '{ "fname" : "langPref" , "label" : "Language" },' +
        '{ "fname" : "contactNum" , "label" : "Contact #" },' +
        '{ "fname" : "altNumber" , "label" : "Alternate #" },' +
        '{ "fname" : "cellNumber" , "label" : "Cell #" },' +
        '{ "fname" : "eMail" , "label" : "eMail" },' +
        '{ "fname" : "postal" , "label" : "Postal" },' +
        '{ "fname" : "suburb" , "label" : "Suburb" },' +
        '{ "fname" : "service" , "label" : "Service Required" },' +
        '{ "fname" : "comment1" , "label" : "Comment" },' +
        '{ "fname" : "comment2" , "label" : "Service Comment" }' +
        ']}'
      ;
    break;
  }
  // console.log("Definition set: ", jText);
  var layout = JSON.parse(layoutDef); // convert JSON text into JS object
  console.log("JSON Definition: ", layout);
  return layout;
}
// =====================
// * General Utilities *
// =====================
// -----------------------
//  disable & enable form
// -----------------------
function formDisable() {
    // Call to disable -> document.getElementById("btnPlaceOrder").disabled = true;
    var limit = document.forms[0].elements.length;
    for (var i=0; i < limit; i++) {
       document.forms[0].elements[i].disabled = true;
    }
}
function formEnable() {
    // Call to enable  -> document.getElementById("btnPlaceOrder").disabled = false;
    var limit = document.forms[0].elements.length;
    for (var i=0; i < limit; i++) {
       document.forms[0].elements[i].disabled = false;
    }
}
// ---------------------------------
//  Highlight a row/cell in a table
// ---------------------------------
function ChangeColor(tableRow, highLight) {
    if (highLight) {
        // tableRow.style.backgroundColor = '#dcfac9';
        tableRow.style.backgroundColor = '#F7B733';
    }
    else {
        tableRow.style.backgroundColor = 'white';
    }
}
// -------------------------------
//  Test if data item is a string
// -------------------------------
function isString(o) {
    return typeof o == "string" || (typeof o == "object" && o.constructor === String);
}
// -------------------------------
//  Test if data item is a string
// -------------------------------
function isNumber(o) {
    return typeof o == "number" || (typeof o == "object" && o.constructor === Number);
}

// ===========================================
//  Functions to add elements and text to DOM
// ===========================================
/*******************************************************************************************
 * By https://www.scribd.com/document/2279811/DOM-Append-Text-and-Elements-With-Javascript *
 *******************************************************************************************/
// ------------------------------
//  add text to existing element
// ------------------------------
/**************************************************************
 * Add test:                                                  *
 * node: The element/node that the text is to be appended to. *
 * txt: The text to append to the node.                       *
 **************************************************************/
function appendText(node,txt) {
    node.appendChild(document.createTextNode(txt));
}
// --------------------
//  add element to DOM
// --------------------
/********************************************************
 * Add new element:                                     *
 *      node = element where to add new element         *
 *      tag = the type of element to add                *
 *      id = optional id for element                    *
 *      htm = optional internal html text for element   *
 ********************************************************/
function appendElement(node,tag,id,htm) {
    var ne = document.createElement(tag);
    if(id) ne.id = id;
    if(htm) ne.innerHTML = htm;
    node.appendChild(ne);
}
function addElementBefore(node,tag,id,htm) {
    var ne = document.createElement(tag);
    if(id) ne.id = id;
    if(htm) ne.innerHTML = htm;
    node.parentNode.insertBefore(ne,node);
}
function addElementAfter(node,tag,id,htm) {
    var ne = document.createElement(tag);
    if(id) ne.id = id;
    if(htm) ne.innerHTML = htm;
    node.parentNode.insertBefore(ne,node.nextSibling);
}
