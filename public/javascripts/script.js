"use strict";

// ==========================
//  Initiate views
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

// ===========================================
//  Global modal controls (source: w3schools)
// ===========================================
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

// =============================
//  Login and startup functions
// =============================

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
      var resHeader = result.getResponseHeader("x-auth");
      var resBody = result.responseText;
      var resStr = '{"x-auth":"' + resHeader + '","body":' + resBody + '}';
      var resObj = JSON.parse(resStr);
      callback(resObj);
    }
    else {
      //
      // Login credentials invalid
      //
      var prompt = "Login invalid ... re-enter information";
      document.getElementById("prompt").innerHTML = prompt;
    }
  });
}
// ----------------------------------------
//  Validate login and open user role view
// ----------------------------------------
function login() {
  //
  //  Extract login credentials from login view
  //
  var loginData = document.getElementsByName("logindata");
  if (loginData[0].value !== '' && loginData[1].value !== '') {
    validate(loginData, (validUser) => {
      console.log("User  body data", validUser.body);
      var user = validUser.body;
      var auth = validUser.x-auth;
      //
      // Close login View
      //
      toggleView("viewLogin");
      //
      // Display user id in system header
      //
      //var user = "User: " + validUser.body.email;
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
    var prompt = "No login information ... please enter";
    document.getElementById("prompt").innerHTML = prompt;
  }
}
// ---------------------------
//  Open view for user's role
// ---------------------------
function openRoleView(user) {
  var userId = user._id;
  var userRole = user.roleCode;
  var userPracCode = user.practiceCode;
  console.log(`>>> User Id: ${userId}, User Role: ${userRole}, Practice Code: ${userPracCode}`);
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
  else if (userRole==="D"){
    toggleView("viewLead");
    toggleView("navLead");
  }
  else {
    console.log(`>>> Error - No role defined!
      User ID: ${userID},
      User Role: ${userRole},
      Practice Code: ${userPracCode}`);
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
      // Display user data in a table
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
// ---------------------------------------
//  User accreditation and skill switches
// ---------------------------------------
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
// --------------------------
//  Open add user modal form
// --------------------------
function addUser() {
  // open model window
  // var modal = document.getElementById('modalBox');
  modal.style.display = "block";
  //document.getElementById("viewAdminUser").style.display = 'block';
  // open add user form
  document.getElementById("addUser").style.display = 'block';
  document.getElementById("modal-header-text").innerHTML = "Add User";
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

// ------------------
//  Edit user record
// ------------------
function displayUser(user) {
  //
  // open model window
  //
  // var modal = document.getElementById('modalBox');
  modal.style.display = "block";
  //
  // Display user form
  //
  document.getElementById("addUser").style.display = 'block';
  document.getElementById("modal-header-text").innerHTML = "Update User";
  //
  // Extract data from selected user and insert into modal form fields
  //
  console.log(">>> Edit User: ", user);
  var inputTag = '',
      field = '',
      fieldNr = 0;
  console.log(">>> Row length: ", user.cells.length);
  for (var c = 0, m = user.cells.length; c < m; c++) {
    if (c === 5) {
      var role = user.cells[c].innerHTML;
      console.log(">>> Role: ", role);
      if (role === "A") {
        document.getElementById("roleA").checked = true;
      }
      else if (role === "B") {
        document.getElementById("roleB").checked = true;
      }
      else if (role === "C") {
        document.getElementById("roleC").checked = true;
      }
      else if (role === "D") {
        document.getElementById("roleD").checked = true;
      }
      else {
        console.log(">>> ERROR: Invalid Role: ", role);
      }
    }
    else if (c === 7) {
      var services = user.cells[c].innerHTML;
      console.log(">>> Services Detail: ", c, fieldNr, services[0].line, services[0].types);
      for (var i = 0, j = services.length; i < j; i++) {
        console.log(">>> Services Detail: ", i, services[i].line);
        if (services[i].line === "PL") {
          document.getElementById("pServType").checked = true;
          for (var x = 0, z = services[i].types.length; x < z; x++) {
            console.log(">>> Services Detail: ", x, services[i].types[x]);
            if (services[i].types === "Vehicle") {
              document.getElementById("pVehicle").checked = true;
            }
            else if (services[i].types === "Home Contents") {
              document.getElementById("pHomeContents").checked = true;
            }


          }
        }
      }
      services[i].types[0]
    }
    else {
      field = 'u' + fieldNr.toString();
      inputTag = document.getElementById(field);
      console.log(">>> Input Tag Detail: ", c, fieldNr, inputTag);
      if (inputTag.name === "password") {
        inputTag.value = "********";
        fieldNr++;
        field = 'u' + fieldNr.toString();
        inputTag = document.getElementById(field);
        console.log(">>> Input Tag Detail: ", c, fieldNr, inputTag);
        inputTag.value = user.cells[c].innerHTML;
        fieldNr++;
      }
      else {
        inputTag.value = user.cells[c].innerHTML;
        fieldNr++;
      }
    }
  }
  /*
    <tr style="background-color: rgb(247, 183, 51);">
    0/0 <td>Cameron</td>
    1/1 <td>van Schalkwyk</td>
    -/2 password ******
    2/3 <td>123</td>
    3/4 <td>456</td>
    4/5 <td>cameron@example.com</td>
    5/6 <td>C</td>
    6/7 <td>P11</td>
    7/8 <td>PL,CL,SL,AL,XL</td>
    8/9 <td>
    pVehicle,pHomeContents,pSOS,pBuilding,pWatercraft,pAllRisk,cBusiness,cGuesthouse,cTourLeisEnter,cSmallBusiness,cDental,cMedical,sVehicle,sProperty,sAsset,aAsset,aGame,aFire,aCrop,aDairy,xAviation,xBondsGuarantee,xCellCapt,xCoporateProperty,xCrop,xEngineering,xHeavyHaulage,xHospitalityInd,xLiability,xMarine,xPrivateClient,xSeamlessProd,xSpecRealEst,xStructuredInsurance,xTaxiSEM,xTravel
    </td>
    </tr>
  */
}

// -----------------------------------------------------
//  Open or Close the display of a service type's items
// -----------------------------------------------------
function servPers() {
  if (document.getElementById('pServType').checked) {
    // if selected switch on
    document.getElementById('dispPersServ').style.display = 'block';
  }
  else {
    // if not selected switch off
    document.getElementById('dispPersServ').style.display = 'none';
  }
}
function servComm() {
  if (document.getElementById('cServType').checked) {
    document.getElementById('dispCommServ').style.display = 'block';
  }
  else {
    document.getElementById('dispCommServ').style.display = 'none';
  }
}
function servSasr() {
  if (document.getElementById('sServType').checked) {
    document.getElementById('dispSasrServ').style.display = 'block';
  }
  else {
    document.getElementById('dispSasrServ').style.display = 'none';
  }
}
function servAgri() {
  if (document.getElementById('aServType').checked) {
    document.getElementById('dispAgriServ').style.display = 'block';
  }
  else {
    document.getElementById('dispAgriServ').style.display = 'none';
  }
}
function servSpec() {
  if (document.getElementById('xServType').checked) {
    document.getElementById('dispSpecServ').style.display = 'block';
  }
  else {
    document.getElementById('dispSpecServ').style.display = 'none';
  }
}
// ----------------------------
//  Submit User Data to Server
// ----------------------------
function submitUser() {
  //
  // Extract data from DOM
  //
  //
  //  Extract New User Data
  //
  var formAddUser = document.getElementById("formAddUser");
  var radioName = "";
  var formElement = "";
  var inputType = "";
  //
  // Extract text data from add user form
  //
  formElement = "input";
  inputType = "text";
  var userText = extractFormData(formAddUser, formElement, inputType);
  //
  // Extract email data from add user form
  //
  formElement = "input";
  inputType = "email";
  var userEmail = extractFormData(formAddUser, formElement, inputType);
  //
  // Extract user role from add user form
  //
  radioName = "role";
  var userRole = getRadioCheckedValue(formAddUser, radioName);
  //
  // Extract Service Information for Adviser role
  //
  if (userRole.role === "C") {
    //
    // Extract adviser service line data
    //
    var checkboxName = "line";
    var insLine = getCheckedValues(formAddUser, checkboxName);
    if (Object.keys(insLine).length === 0 && insLine.constructor === Object) {
      var name = "line";
      var value = [];
      value.push("none selected");
      insLine[name] = value;
    }
    else {
      //
      // Extract adviser services for each of the insurance lines selected
      //
      console.log("---> The Lines obj: ", insLine.line);
      var lines = insLine.line;
      console.log("---> The Lines: ", lines);
      var userServices = [];
      lines.forEach((element) => {
        var checkboxName = element;
        console.log("---> The Element: ", element);
        var selection = getCheckedValues(formAddUser, checkboxName);
        console.log("---> The Types selected: ", selection);
        if (Object.keys(selection).length === 0 && selection.constructor === Object) {
          var value = [];
          value.push("none selected");
          selection[checkboxName] = value;
        }
        var lineTypes = {
          line : element,
          types : selection[element]
        };
        console.log("---> Insurance Line Cover Types: ", lineTypes);
        
        userServices.push(lineTypes);
        console.log("---> User Services: ", userServices);
      })
    }
  }
  else{
    var userServices = [
      {
        "line" : "n/a",
        "types" : ["n/a"]
      }
    ];
  }
  //
  //  create User data object
  //
  var userData = {
    firstName : userText.firstName,
    surname : userText.surname,
    phone : userText.phone,
    cell : userText.cell,
    email : userEmail.email,
    roleCode : userRole.role,
    practiceCode : userText.practice,
    services : userServices,
    password : userText.password
  };
  var dataString = JSON.stringify(userData);
  console.log(">>> User Data: ", dataString);
  var method = "POST";
  var route = "/users/add";
  var contentType = "application/json";
  //
  //  Send Lead POST Request
  //
  xhrRequest(method, route, contentType, dataString, (err, result) => {
    if (!err) {
      var resBody = result.responseText;
      //
      // Clear create user form
      //
      document.getElementById("formAddUser").reset();
      //
      // switch accreditation and skills off
      //
      document.getElementById('selectAbility').style.display = 'none';
      //
      // Switch off skill sections
      //
      document.getElementById('dispPersServ').style.display = 'none';
      document.getElementById('dispCommServ').style.display = 'none';
      document.getElementById('dispSasrServ').style.display = 'none';
      document.getElementById('dispAgriServ').style.display = 'none';
      document.getElementById('dispSpecServ').style.display = 'none';
    }
    else {
      var prompt = "Lead submit error";
      document.getElementById("leadErr").innerHTML = prompt;
    }
  });
}

//====================================
// Practise Administration Processing
//====================================

// -----------------------------------
//  Open Practice Maintenance Display
// -----------------------------------
function listPractices() {
  //
  // Switch Practice Maintenance Display on
  //
  document.getElementById('panelAdminPrac').style.display = 'block';
  //
  // Switch User Maintenance Display off
  //
  document.getElementById('panelAdminUser').style.display = 'none';
  //
  // Create Practise Data request
  //
  var request = "XXXX";
  var method = "GET";
  var route = "/practices/list";
  var contentType = "application/json";
  //
  //  Request Practise Data from Server
  //
  xhrRequest(method, route, contentType, request, (err, res) => {
    if (!err) {
      var data = JSON.parse(res.responseText);
      console.log(">>> Practice docs: ", data);
      //
      // load table layout definition
      //
      var dataSource = '2';
      var objRules = readLayout(dataSource);
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

// ============================
//  Capture Lead Functionality
// ============================

// ----------------------------------------------------------------------
//  Lead Display Switches for Contact Form and Service Required Selector
// ----------------------------------------------------------------------
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
// --------------------------------------
//  Display Switches for Lead Cover Form
// --------------------------------------
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
// --------------------------
//  Send lead data to server
// --------------------------
function submitLead() {
  console.log("*** Submit Lead Function ***");
  //
  //  Extract Contact Data
  //
  var contactData = document.getElementById("contactForm");
  var radioName = "";
  var formElement = "";
  var inputType = "";
  //
  // extract language preference
  //
  radioName = "langPref";
  var contactLanguage = getRadioCheckedValue(contactData, radioName);
  //
  // extract text data from contact form
  //
  formElement = "input";
  inputType = "text";
  var contactInfo = extractFormData(contactData, formElement, inputType);
  //
  // extract email data from contact form
  //
  formElement = "input";
  inputType = "email";
  var contactEmail = extractFormData(contactData, formElement, inputType);
  //
  // extract selected day checkbox values
  //
  var checkboxName = "contactDay";
  var contactDays = getCheckedValues(contactData, checkboxName);
  if (Object.keys(contactDays).length === 0 && contactDays.constructor === Object) {
    var name = "contactDay";
    var value = [];
    value.push("any");
    contactDays[name] = value;
  }
  //
  // extract contact time
  //
  formElement = "input";
  inputType = "time";
  var contactTime = extractFormData(contactData, formElement, inputType);
  //
  // extract before or after
  //
  radioName = "timeBA";
  var contactTimeBA = getRadioCheckedValue(contactData, radioName);
  if (Object.keys(contactTimeBA).length === 0 && contactTimeBA.constructor === Object) {
    var name = "timeBA";
    var value = [];
    value.push("n/a");
    contactTimeBA[name] = value;
  }
  //
  // extract comment data from contact form
  //
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
  var dataString = JSON.stringify(leadData);
  var method = "POST";
  var route = "/leads/add";
  var contentType = "application/json";
  //
  //  Send Lead POST Request
  //
  xhrRequest(method, route, contentType, dataString, (err, result) => {
    if (!err) {
      var resBody = result.responseText;
      document.getElementById("contactForm").reset();
      document.getElementById("coverForm").reset();
    }
    else {
      var prompt = "Lead submit error";
      document.getElementById("leadErr").innerHTML = prompt;
    }
  });
}

// =======================================
//  Practise Administration Functionality
// =======================================
//
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
// ------------------
//  Display Advisers
// ------------------
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
//  Allocate Adviser to Lead
// --------------------------
function allocateAdviser() {
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

// =============================
//  Form Data Extract Utilities
// =============================
//
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
//
// ===================================
// === Data List Display Functions ===
// ===================================
//
// ----------------------------------
//  Create table and display content
// ----------------------------------
function displayData(content, title, layoutId) {
  console.log("Content: ", content);
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
      //console.log("Table Cell: ", i, j, listContent[i][j]);
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
  if (title !== null){
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
  console.log("---> Table Id: ", id);
  var elementId = "table" + id;
  console.log("---> Element Id: ", elementId);
  var rows = document.getElementById(elementId).rows;
  var rowCount = document.getElementById(elementId).rows.length;
  console.log("---> Table Rows: ", rowCount);
  if (id === "0"){
    var rowFunc = function(){ displayUser(this); };
  }
  for (var i = 1; i < rowCount; i++) {
      // ignore header, row 0
      rows[i].onclick = rowFunc;
      rows[i].onmouseover = function(){ ChangeColor(this, true); };
      rows[i].onmouseout = function(){ ChangeColor(this, false); };
  }
  console.log("<<< Row Handlers Added >>>");
}
// -------------------------
//  List layout definitions
// -------------------------
function readLayout(definitionId) {
  switch (definitionId) {
    case '0':
      console.log("List Layout: 0 (Users)");
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
      console.log("List Layout: 1 (Leads)");
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
    case '2':
      console.log("List Layout: 2 (Practices)");
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
    case '3':
      console.log("List Layout: 3 (Advisers)");
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
  // console.log("JSON Definition: ", layout);
  return layout;
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