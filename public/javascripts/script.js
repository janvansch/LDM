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
}
// ==============================================
// * Authenticate user and oprn system if valid *
// ==============================================
function login() {
  // -------------------------------
  //  Authenticate user credentials
  // -------------------------------
  authenticateUser((validUser) => {
    console.log(">>> Valid User Data: ", validUser);
    var user = validUser.body;
    // var x-auth = validUser.x-auth;
    // ------------------
    //  Close login View
    // ------------------
    toggleLogin();
    toggleLogin();
    // --------------------------
    //  Set view for user's role
    // --------------------------
    setRoleView(user);
  });
}
// ----------------------------
//  Setup system for user role
// ----------------------------
function setRoleView(user) {
  var userID = user._id;
  var userPracCode = user.practiseCode;
  var userRole = user.roleCode;
  console.log(">>> User Role: ", userID, userPracCode, userRole);
  if (userRole==="A") {
    toggleAdmin();
  }
  else if (userRole==="B") {
    togglePractise();
    displayLeads(userPracCode);
  }
  else if (userRole==="C") {
    toggleAdviser();
    showLeads(userPracCode, userID);
  }
  else {
    toggleLead();
  }
}
// -------------------------------
//  Authenticate user credentials
// -------------------------------
function authenticateUser(callback) {
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
		var path = '/users/login';
    var contentType = 'application/json';
    //console.log(">>> Server Request:", request, path, contentType);
    // --------------------
    //  Send login Request
    // --------------------
    xhttpRequest(request, path, contentType, function(err, result) {
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
//======================
// Lead Processing Code
//======================
// ---------------
//  Display leads
// ---------------
function displayLeads() {
  var request = "XXXX";
  var method = "GET";
  var route = "/leads/list";
  var contentType = "application/json";
  //
  //  Request lead data from server
  //
  dataRequest(method, route, contentType, request, (err, res) => {
    if (!err) {
      var data = JSON.parse(res.responseText);
      console.log(">>> lead Docs: ", data);
      //
      // load report layout definition
      //
      var dataSource = '1';
      var objRules = readRules(dataSource);
      var prompt = 'Lead data for: ' + request;
      var formatData = [];
      var rowCount = data.length;
      for (var i=0; i < rowCount; i++) {
        //
        // Extract data from data into list
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
        cells.push((typeof data[i].postal === 'undefined') ? (" - ") : (data[i].postal));
        cells.push((typeof data[i].suburb === 'undefined') ? (" - ") : (data[i].suburb));
        cells.push((typeof data[i].service === 'undefined') ? (" - ") : (data[i].service));
        cells.push((typeof data[i].comment1 === 'undefined') ? (" - ") : (data[i].comment1));
        cells.push((typeof data[i].comment2 === 'undefined') ? (" - ") : (data[i].comment2));
        formatData[i] = cells;
        console.log("---> Report Row Data: ", i, formatData[i]);
      }
      //
      // Display Report
      //
      displayData(formatData, prompt, objRules);
    }
    else {
      var prompt = "Lead request error";
      document.getElementById("leadErr").innerHTML = prompt;
    }
  });
}
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
  // extract telephone numbers - only supported by Safari
  //formElement = "input";
  //inputType = "tel";
  //var contactTel = extractFormData(contactData, formElement, inputType);
  // extract email data from contact form
  formElement = "input";
  inputType = "email";
  var contactEmail = extractFormData(contactData, formElement, inputType);
  // extract selected day checkbox values
  // formElement = "input";
  // inputType = "checkbox";
  // var contactDays = extractFormData(contactData, formElement, inputType);
  // if (Object.keys(contactDays).length === 0 && contactDays.constructor === Object) {
  //   var name = "days";
  //   var value = [];
  //   value.push("any");
  //   contactDays[name] = value;
  // }
  var checkboxName = "contactDay";
  //formElement = "input";
  //inputType = "checkbox";
  var contactDays = getCheckedValues(contactData, checkboxName);
  if (Object.keys(contactDays).length === 0 && contactDays.constructor === Object) {
  //var array = contactDays.contactDay;
  //if (array.length === 0 && array.constructor === Array) {
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
    value.push("N/A");
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
  formElement = "input";
  inputType = "checkbox";
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
    value.push("Error");
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
// =======================================================
//  Lead Contact Form and Service Required Display Switch
// =======================================================
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
// ===================================
//  User Administration Functionality
// ===================================
function userList() {
  // get user data from Server
  // display user data
  // display buttons:
  //    Add User Button
  //    Delete User Button
  //    Edit User Button
}
// ----------
//  Add User
// ----------
function addUser() {
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
  name = userData[0];
  surname = userData[1];
  console.log("Login data input:", name, surname);
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
// =======================================
//  Practise Administration Functionality
// =======================================
function allocateLead() {
  console.log("===> Allocate lead to adviser process started: ");
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
function displayData(listContent, listPrompt, objRules) {
  //console.log("Report Data: ", listContent);
  var rowCount = listContent.length;
  var dataColCount = listContent[0].length;
  var colCount = objRules.filedef.length;
  if (colCount !== dataColCount) {
    console.log(`==> Err: Column Count issue: expected = ${colCount} data = ${dataColCount}`);
    alert(`==> Err: Column Count issue: expected = ${colCount} data = ${dataColCount}`);
  }
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
    //console.log("Header Labels: ", objRules.filedef[j].label);
    headerCell.innerHTML = objRules.filedef[j].label;
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
      tableCell.innerHTML = (isString(listContent[i][j]) ? (listContent[i][j].trim()) : (listContent[i][j]));
    } // end of column loop
  } // end of row loop
  //
  // Insert Table into DOM for display
  //
  var tablePos = document.getElementById("tablePos1");
  tablePos.innerHTML = "";
  tablePos.appendChild(table); // add child element to document
  //
  // Update list section heading
  //
  if (listPrompt !== null){
  document.getElementById("dList").innerHTML = listPrompt;
  }
  console.log("<<< Data list display updated >>>");
}
// ================================
//  Generic XMLHttpRequest handler
// ================================
function dataRequest(method, route, contentType, request, callback) {
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

// ================================
//  Generic XMLHttpRequest handler
// ================================
function xhttpRequest(request, path, contentType, callback) {
  //Validate params - if params not valid end immediately
  if (request == null || path == null || contentType == null) {
    console.log("<<< ERROR - required parameters not provided >>>");
  }
  else if (typeof callback !== "function"){
    console.log("<<< ERROR - the callback is not a function >>>");
  }
  else {
    // console.log("<<< VALID - execute XMLHttp request >>>");
    // Open connection to server
    if (window.XMLHttpRequest) {
      var xhttp = new XMLHttpRequest();
    }
    else {
      // code for IE6, IE5
      var xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhttp.onreadystatechange = function() {
      //Monitor request progress
      console.log("Ready state:", xhttp.readyState);
      if (xhttp.readyState == 4) {
        // Request complete
        if (xhttp.status == 200) {
          // status 200 - success
          var err = false;
          callback(err, xhttp);
        }
        else {
          // status not 200 - failed
          var err = true;
          console.log(`*** XHR request failure - status = ${xhttp.status} ***`);
          console.log(">>> Error result: ", xhttp.responseText);
          //var errorMsg = JSON.parse(xhttp);
          callback(err, '');
        }
      }
    }
    //Request transact data from server
    xhttp.open('POST', path);
    xhttp.setRequestHeader("Content-type", contentType);
    xhttp.send(request);
  }
}

// ===================================
//  View display management functions
// ===================================
// -------------------------------------
//  Switch login View on/off
// -------------------------------------
function toggleLogin(){
    var state = '';
    var login = document.getElementById("login");
    if(login.style.display == "block") {
        login.style.display = "none";
        state = "OFF";
    }
    else {
        login.style.display = "block";
        state = "ON";
    }
    console.log("login section:", state);
}
// -------------------------------------------
//  Switch Add lead View on/off
// -------------------------------------------
function toggleLead(){
    var list = document.getElementById("leadView");
    if(list.style.display == "block") {
        list.style.display = "none";
        var state = "OFF";
    } else {
        list.style.display = "block";
        var state = "ON";
    }
    console.log("Add Lead View:", state);
}
// -------------------------------------------
//  Switch Admin View on/off
// -------------------------------------------
function toggleAdmin(){
    var list = document.getElementById("userView");
    if(list.style.display == "block") {
        list.style.display = "none";
        var state = "OFF";
    } else {
        list.style.display = "block";
        var state = "ON";
    }
    console.log("Admin View:", state);
}
// -------------------------------------------
//  Switch Practise View on/off
// -------------------------------------------
function togglePractise(){
    var list = document.getElementById("practiseView");
    if(list.style.display == "block") {
        list.style.display = "none";
        var state = "OFF";
    } else {
        list.style.display = "block";
        var state = "ON";
    }
    console.log("Practise View:", state);
}
// -------------------------------------------
//  Switch Adviser View on/off
// -------------------------------------------
function toggleAdviser(){
    var list = document.getElementById("adviserView");
    if(list.style.display == "block") {
        list.style.display = "none";
        var state = "OFF";
    } else {
        list.style.display = "block";
        var state = "ON";
    }
    console.log("Adviser View:", state);
}
// -------------------------------------------
//  Switch User Add on/off
// -------------------------------------------
function toggleAddUser(){
    var list = document.getElementById("addUser");
    if(list.style.display == "block") {
        list.style.display = "none";
        var state = "OFF";
    } else {
        list.style.display = "block";
        var state = "ON";
    }
    console.log("Adviser View:", state);
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
function readRules(definition) {

  switch (definition) {
    case '0':
      console.log("Rules case: 0 (User)");
      var jText = '{ "filedef" : [' +
        '{ "fname" : "email" , "label" : "email" },' +
        '{ "fname" : "password" , "label" : "Password" },' +
        '{ "fname" : "name" , "label" : "Name" },' +
        '{ "fname" : "surname" , "label" : "Surname" },' +
        '{ "fname" : "phone" , "label" : "Phone" },' +
        '{ "fname" : "cell" , "label" : "Cell" },' +
        '{ "fname" : "role" , "label" : "Role" },' +
        '{ "fname" : "practise" , "label" : "Practise" } ]}'
      ;
    break;
    case '1':
      console.log("Rules case: 1 (Practise Lead)");
      var jText = '{ "filedef" : [' +
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
        '{ "fname" : "comment2" , "label" : "Service Comment" } ]}'
      ;
    break;
  }
    /*
    Result returned: {"leads":[{
      "contactLocation":{
        "streetNum":"",
        "streetName":null,
        "buildingName":"",
        "floor":"",
        "room":"",
        "postal":7441,
        "suburb":"Edgemead"
      },
      "postBox":{
        "postalCode":null,
        "boxNumber":null
      },
      "contactPref":{
        "contactDay":["any"],
        "time":"",
        "timeBA":"N/A"
      },
      "comments":{
        "comment1":"Test",
        "comment2":"Test",
        "comment3":"",
        "comment4":""
      },
      "currentInsurer":"",
      "previousInsurer":"",
      "lineOfBusiness":"",
      "service":["Error"],
      "status":["Open"],
      "completedAt":0,
      "_id":"5b756b0ef065660c30dc4119",
      "langPref":"English",
      "title":"",
      "firstName":"Johannes",
      "surname":"van Schalkwyk",
      "initials":"",
      "contactNum":"+27 21 123 4567",
      "altNumber":"",
      "cellNumber":"",
      "eMail":"",
      "agentApproval":"Yes"}
    ]}
    */

  // console.log("Definition set: ", jText);
  var obj = JSON.parse(jText); // convert JSON text into JS object
  // console.log("JSON Definition: ", obj);
  return obj;
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
