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
var modalPrac = document.getElementById('modalPrac');
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
  resetform("formAddUser");
  document.getElementById('selectAbility').style.display = 'none';
  document.getElementById('dispPersServ').style.display = 'none';
  document.getElementById('dispCommServ').style.display = 'none';
  document.getElementById('dispSasrServ').style.display = 'none';
  document.getElementById('dispAgriServ').style.display = 'none';
  document.getElementById('dispSpecServ').style.display = 'none';
  modal.style.display = "none";
}
// --------------------------------------------------------------
//  When the user clicks anywhere outside of the modal, close it
// --------------------------------------------------------------
window.onclick = function(event) {
  if (event.target == modal) {
    resetform("formAddUser");
    document.getElementById('selectAbility').style.display = 'none';
    document.getElementById('dispPersServ').style.display = 'none';
    document.getElementById('dispCommServ').style.display = 'none';
    document.getElementById('dispSasrServ').style.display = 'none';
    document.getElementById('dispAgriServ').style.display = 'none';
    document.getElementById('dispSpecServ').style.display = 'none';
    modal.style.display = "none";
  }
}
function resetform(form) {
  document.getElementById(form).reset();
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

//============================================================================
// Administration - System Users
//============================================================================

// ----------------------------------------------------
//  List system users and add row select functionality
// ----------------------------------------------------
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
      // Table layout & heading
      //
      var layoutId = '0';
      var prompt = 'User list:';
      //
      // Display user data in a table
      //
      displayData(data, prompt, layoutId);
      //
      // Add row select handlers to enable editing
      //
      addRowHandlers(layoutId);
    }
    else {
      var prompt = "User request error";
      document.getElementById("userErr").innerHTML = prompt;
    }
  });
}
// -------------------------------------------------------
//  If adviser role is selected display service else hide
// -------------------------------------------------------
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
  document.getElementById("addUserButtons").style.display = "block";
  document.getElementById("updateUserButtons").style.display = "none";
  
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
  document.getElementById("modal-header-text").innerHTML = "Selected User's Detail - Update/Delete";
  document.getElementById("addUserButtons").style.display = "none";
  document.getElementById("updateUserButtons").style.display = "block";
  //
  // Get user id (email)
  //
  var userId = user.cells[4].innerHTML;
  console.log(">>> User Email: ", userId);
  //
  // Create User Data request
  //
  var userKey = {
    userId : userId
  };
  //var dataString = JSON.stringify(leadData);
  var request = JSON.stringify(userKey);
  var method = "POST";
  var route = "/users/user";
  var contentType = "application/json";
  //
  //  Request User Data from Server
  //
  console.log(">>> Request: ", request);
  xhrRequest(method, route, contentType, request, (err, res) => {
    if (!err) {
      var user = JSON.parse(res.responseText);
      console.log(">>> User Detail: ", user);
      //
      // Fill form with user's data
      //
      console.log("---> firstname: ", user[0].firstName);
      document.getElementById("u0").value = user[0].firstName;
      document.getElementById("u1").value = user[0].surname;
      document.getElementById("u2").value = "********";
      document.getElementById("u3").value = user[0].phone;
      document.getElementById("u4").value = user[0].cell;
      document.getElementById("u5").value = user[0].email;
      document.getElementById("u6").value = user[0].practiceCode;
      var fName = document.getElementById("u0").innerHTML;
      console.log("===> firstname: ", fName);
      //
      // Set user role radio button 
      //
      var role = user[0].roleCode;
      console.log(">>> Role: ", role);
      if (role === "A") {
        // user has an Admin role
        document.getElementById("roleA").checked = true;
      }
      else if (role === "B") {
        // user has a Practice Backoffice role
        document.getElementById("roleB").checked = true;
      }
      else if (role === "C") {
        // user has an Adviser role
        document.getElementById("roleC").checked = true;
      }
      else if (role === "D") {
        // user has a Lead Recorder role 
        document.getElementById("roleD").checked = true;
      }
      else {
        console.log(">>> ERROR: Invalid Role: ", role);
      }
      //
      // If user is an adviser Extract and set selection boxes to indicat adviser services
      //
      if (role === "C") {
        var services = user[0].services;
        //
        // Display insurance line selector 
        //
        document.getElementById('selectAbility').style.display = 'block';
        for (var i = 0, j = services.length; i < j; i++) {
          if (services[i].line === "PL") {
            //
            // Set product line selector tickbox to selected
            //
            document.getElementById("pServType").checked = true;
            //
            // Display insurance type selector
            //
            document.getElementById('dispPersServ').style.display = 'block';
            for (var x = 0, z = services[i].types.length; x < z; x++) {
              console.log(">>> Services Detail: ", x, services[i].types[x]);
              if (services[i].types[x] === "Private Vehicle") {
                document.getElementById("pVehicle").checked = true;
              }
              else if (services[i].types[x] === "Home Contents") {
                document.getElementById("pHomeContents").checked = true;
              }
              else if (services[i].types[x] === "SOS") {
                document.getElementById("pSOS").checked = true;
              }
              else if (services[i].types[x] === "Building") {
                document.getElementById("pBuilding").checked = true;
              }
              else if (services[i].types[x] === "Watercraft") {
                document.getElementById("pWatercraft").checked = true;
              }
              else if (services[i].types[x] === "All Risk") {
                document.getElementById("pAllRisk").checked = true;
              }
              else {
                console.log(">>> ERROR - Invalid type: ", services[i].types[x]);
              }
            }
          }
          if (services[i].line === "CL") {
            document.getElementById("cServType").checked = true;
            document.getElementById('dispCommServ').style.display = 'block';
            for (var x = 0, z = services[i].types.length; x < z; x++) {
              console.log(">>> Services Detail: ", x, services[i].types[x]);
              if (services[i].types[x] === "Business") {
                document.getElementById("cBusiness").checked = true;
              }
              else if (services[i].types[x] === "Guesthouse") {
                document.getElementById("cGuesthouse").checked = true;
              }
              else if (services[i].types[x] === "Tourism,Leisure & Entertainment") {
                document.getElementById("cTourLeisEnter").checked = true;
              }
              else if (services[i].types[x] === "Small Business") {
                document.getElementById("cSmallBusiness").checked = true;
              }
              else if (services[i].types[x] === "Dental") {
                document.getElementById("cDental").checked = true;
              }
              else if (services[i].types[x] === "Medical") {
                document.getElementById("cMedical").checked = true;
              }
              else {
                console.log(">>> ERROR - Invalid type: ", services[i].types[x]);
              }
            }
          }
          if (services[i].line === "SL") {
            document.getElementById("sServType").checked = true;
            document.getElementById('dispSasrServ').style.display = 'block';
            for (var x = 0, z = services[i].types.length; x < z; x++) {
              console.log(">>> Services Detail: ", x, services[i].types[x]);
              if (services[i].types[x] === "Vehicle") {
                document.getElementById("sVehicle").checked = true;
              }
              else if (services[i].types[x] === "Property") {
                document.getElementById("sProperty").checked = true;
              }
              else if (services[i].types[x] === "Asset") {
                document.getElementById("sAsset").checked = true;
              }
              else {
                console.log(">>> ERROR - Invalid type: ", services[i].types[x]);
              }
            }
          }
          if (services[i].line === "AL") {
            document.getElementById("aServType").checked = true;
            document.getElementById('dispAgriServ').style.display = 'block';
            for (var x = 0, z = services[i].types.length; x < z; x++) {
              console.log(">>> Services Detail: ", x, services[i].types[x]);
              if (services[i].types[x] === "Asset") {
                document.getElementById("aAsset").checked = true;
              }
              else if (services[i].types[x] === "Game") {
                document.getElementById("aGame").checked = true;
              }
              else if (services[i].types[x] === "Fire") {
                document.getElementById("aFire").checked = true;
              }
              else if (services[i].types[x] === "Crop") {
                document.getElementById("aCrop").checked = true;
              }
              else if (services[i].types[x] === "Dairy") {
                document.getElementById("aDairy").checked = true;
              }
              else {
                console.log(">>> ERROR - Invalid type: ", services[i].types[x]);
              }
            }
          }
          if (services[i].line === "XL") {
            document.getElementById("xServType").checked = true;
            document.getElementById('dispSpecServ').style.display = 'block';
            for (var x = 0, z = services[i].types.length; x < z; x++) {
              console.log(">>> Services Detail: ", x, services[i].types[x]);
              if (services[i].types[x] === "Aviation") {
                document.getElementById("xAviation").checked = true;
              }
              else if (services[i].types[x] === "Bonds & Guarantees") {
                document.getElementById("xBondsGuarantees").checked = true;
              }
              else if (services[i].types[x] === "Cell Captive") {
                document.getElementById("xCellCapt").checked = true;
              }
              else if (services[i].types[x] === "Coporate Property") {
                document.getElementById("xCoporateProperty").checked = true;
              }
              else if (services[i].types[x] === "Crop") {
                document.getElementById("xCrop").checked = true;
              }
              else if (services[i].types[x] === "Engineering") {
                document.getElementById("xEngineering").checked = true;
              }
              else if (services[i].types[x] === "Heavy Haulage") {
                document.getElementById("xHeavyHaulage").checked = true;
              }
              else if (services[i].types[x] === "Hospitality Industry") {
                document.getElementById("xHospitalityInd").checked = true;
              }
              else if (services[i].types[x] === "Liability") {
                document.getElementById("xLiability").checked = true;
              }
              else if (services[i].types[x] === "Marine") {
                document.getElementById("xMarine").checked = true;
              }
              if (services[i].types[x] === "Private Client") {
                document.getElementById("xPrivateClient").checked = true;
              }
              else if (services[i].types[x] === "Seamless Prod") {
                document.getElementById("xSeamless Prod").checked = true;
              }
              else if (services[i].types[x] === "Specialist Real Estate") {
                document.getElementById("xSpecRealEst").checked = true;
              }
              else if (services[i].types[x] === "Structured Insurance") {
                document.getElementById("xStructuredInsurance").checked = true;
              }
              else if (services[i].types[x] === "Taxi & SEM") {
                document.getElementById("xTaxiSEM").checked = true;
              }
              else if (services[i].types[x] === "Travel") {
                document.getElementById("xTravel").checked = true;
              }
              else {
                console.log(">>> ERROR - Invalid type: ", services[i].types[x]);
              }
            }
          }
        }
      }
    }
    else {
      var prompt = "User detail request error";
      document.getElementById("userErr").innerHTML = prompt;
    }
    var fName = document.getElementById("u1").innerHTML;
      console.log(">>>> surname: ", fName);
  });
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
function submitUser(action) {
  console.log("---> Action: ", action);
  //
  //  Extract new/update user data from document
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
  //
  //  Create AJAX Request
  //
  var method = "POST";
  if (action === "update") {
    var route = "/users/update";
  }
  else {
    var route = "/users/add";
  }
  var contentType = "application/json";
  //
  //  Send User POST Request
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
      //
      // Close form and modal
      //
      document.getElementById("addUser").style.display = 'block';
      modal.style.display = "none";
      //
      // Update list
      //
      listUsers();
    }
    else {
      var prompt = "User submit error";
      document.getElementById("uErrMsg").innerHTML = prompt;
    }
  });
}

//============================================================================
// Administration - Practices
//============================================================================

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
      console.log(">>> Practice data returned: ", data);
      //
      // Extract list data
      //
      // === None required ===
      //
      // Table layout & heading
      //
      var layoutId = '2';
      var prompt = 'Practice list:';
      //
      // Display practice data in a table
      //
      displayData(data, prompt, layoutId);
      //
      // Add row select handlers to enable practice editing
      //
      addRowHandlers(layoutId);
    }
    else {
      document.getElementById("practiceErr").innerHTML = "User request error";
    }
  });
}

// ------------------------------
//  Open add practice modal form
// ------------------------------
function addPractice() {
  // open model window
  // var modal = document.getElementById('modalBox');
  modalPrac.style.display = "block";
  //document.getElementById("viewAdminUser").style.display = 'block';
  // open add user form
  document.getElementById("addPractice").style.display = 'block';
  document.getElementById("modal-header-prac").innerHTML = "Add Practice";
  document.getElementById("addPracticeButtons").style.display = "block";
  document.getElementById("updatePracticeButtons").style.display = "none";
}

function displayPractice(practice) {

}

// --------------------------------------------
//  Check if new code is a duplicate post code
// --------------------------------------------
function dupPostCode(code){
  var table = document.getElementById("tablePCode");
  if (table.rows[0].cells.length === 0) {
    return false;
  }
  var rowCount = table.rows.length;
  for (var row = 0; row < rowCount; row++) {
    var cellCount = table.rows[row].cells.length
    for (var cell = 0; cell < cellCount; cell++) {
      if (code === table.rows[row].cells[cell].innerHTML) {
        return true;
      }
    }
  }
  return false;
}

// ------------------------------------------
//  Create a list of postal codes in a table
// ------------------------------------------
function addPostCode() {
  //
  // Get input
  //
  const newPCode = document.getElementById("pCode").value;
  console.log("---> New Postal Code: ", newPCode);
  if (newPCode === "") {
    alert("Please enter a postal code before clicking the Add Button!");
  }
  else if (dupPostCode(newPCode)){
    alert("The postal code entered is already in the list?");
  }
  else {
    //
    // Clear input
    //
    document.getElementById("pCode").value = "";
    //
    // Insert into list table and display
    //
    const table = document.getElementById("tablePCode");
    var rowCount = table.rows.length;
    //if (typeof rowCount === 'undefined') {
    if (rowCount === 0) {
      //
      // Create first row
      //
      var tableRow = body.insertRow(-1);
      rowCount = 1;
      //
      // Create first cell
      //
      var tableCell = tableRow.insertCell(-1);
      var rowLen = 1;
    }
    else {
      var rowLen = table.rows[rowCount - 1].cells.length
      if ( rowLen === 20) {
        //
        // Add a new row
        //
        var tableRow = table.insertRow(-1);
        rowCount++;
        //
        // Create first cell in new row
        //
        var tableCell = tableRow.insertCell(-1);
        var rowLen = 1;
      }
      else {
        tableRow = table.rows[rowCount - 1];
        //
        // Create a cell
        //
        var tableCell = tableRow.insertCell(-1);
      }
      //
      // Insert cell content
      //
      tableCell.innerHTML = (isString(newPCode) ? (newPCode.trim()) : (newPCode));
      tableCell.onclick = function(){displayPostCode(this.innerHTML);};
      tableCell.onmouseover = function(){ ChangeColor(this, true); };
      tableCell.onmouseout = function(){ ChangeColor(this, false); };
    }
  }
}

// ---------------------------------------------------------------
//  Display selected postal code for maintenance - edit or delete 
// ---------------------------------------------------------------
function displayPostCode(pCode) {
  console.log("---> Post Code selected: ", pCode);
  //
  // Display selected postal code view
  //
  document.getElementById("selectedPCode").value = pCode;
  document.getElementById("addPostCode").style.display = 'none';
  document.getElementById("editPostCode").style.display = 'block';
  //
  // Determine row and column index of selected cell
  //
  //const table = document.querySelector('#tablePCode');
  const rows = document.querySelectorAll('#tablePCode tr');
  const rowsArray = Array.from(rows);
  const rowIndex = rowsArray.findIndex(row => row.contains(event.target));
  const columns = Array.from(rowsArray[rowIndex].querySelectorAll('td'));
  const columnIndex = columns.findIndex(column => column == event.target);
  console.log("---> Selected cell Row and Column Index: ", rowIndex, columnIndex)
  //
  // Store reference for next event
  //
  localStorage.setItem("rowIndex", rowIndex);
  localStorage.setItem("columnIndex", columnIndex);
}

// -----------------------------
//  Update postal code list with maintenance
// -----------------------------
function updatePostCodeList(action) {
  const table = document.querySelector('#tablePCode');
  const rowIndex = localStorage.getItem("rowIndex");
  const columnIndex = localStorage.getItem("columnIndex");
  console.log("---> Update cell Row and Column Index: ", rowIndex, columnIndex)
  if (action === "update") {
    table.rows[rowIndex].cells[columnIndex].innerHTML = document.getElementById("selectedPCode").value
  }
  else if (action === "remove") {
    //var row = document.getElementById("myRow");
    var row = table.rows[rowIndex];
    row.deleteCell(columnIndex);
  }
  else {
    console.log("---> ERROR: @ cell: ", rowIndex, columnIndex)
  }
  //
  // Clear input
  //
  document.getElementById("selectedPCode").value = "";
  //
  // Display add postal code view
  //
  document.getElementById("addPostCode").style.display = 'block';
  document.getElementById("editPostCode").style.display = 'none';
}

// --------------------------------
//  Submit practice data to server
// --------------------------------
// document.getElementById("addPractice").addEventListener("click", function(event){
//   event.preventDefault()
//   var action = 'add';
function submitPractice(action) {
  console.log("---> Practice Action: ", action);
  //
  //  Extract new/update practice data from DOM
  //
  var formAddPractice = document.getElementById("formAddPractice");
  //
  // Do data validations
  if (formAddPractice.checkValidity() === false) {
    alert("Practice information not valid!");
  }
  //
  // Check that at least one postal code was entered, if not alert user
  //
  var table = document.getElementById("tablePCode");
  var rowCount = table.rows.length;
  var cellCount = table.rows[rowCount - 1].cells.length;
  if (cellCount < 1){
    alert("Please add at least one postal code!");
  }
  //
  // If postal code entered and input attributes are valid 
  // then continue else display errors
  //
  if (cellCount > 0 && formAddPractice.checkValidity() === true) {
    var formElement = "";
    var inputType = "";
    //
    // Extract text data from add practice form
    //
    formElement = "input";
    inputType = "text";
    var text = extractFormData(formAddPractice, formElement, inputType);
    //
    // Extract email data from add practice form
    //
    formElement = "input";
    inputType = "email";
    var email = extractFormData(formAddPractice, formElement, inputType);
    //
    // Extract practice operational area data
    //
    var areaCodes = [];
    for (var i=0; i < rowCount; i++) {
      for (var j=0; j < cellCount; j++) {
        //
        // If there is no data for a cell create it as a dash 
        //
        areaCodes.push(table.rows[i].cells[j].innerHTML);
      }
    }
    console.log(">>> Area Code: ", areaCodes);
    //
    // Extract User
    //
    var user = document.getElementById("user").innerHTML
    var who = user.replace("User: ", "");
    //
    //  create User data object
    //
    var practiceData = {
      pracCode : text.pracCode,
      pracName : text.pracName,
      pracPhone : text.pracPhone,
      pracEmail : email.pracEmail,
      principle : {
        firstName : text.prinFirstName,
        surname : text.prinSurname,
        phone : text.prinPhone,
        cell : text.prinCell,
        email : email.prinEmail
      },
      backOffice : {
        contact : {
          firstName : text.offFirstName,
          surname : text.offSurname,
          //phone : text.conPhone,
          //cell : text.conCell,
          //email : email.conEmail
        },
        phone : text.offPhone,
        cell : text.offCell,
        email : email.offEmail
      },
      area : areaCodes,
      who : who
    };
    var dataString = JSON.stringify(practiceData);
    console.log(">>> Practice Data: ", dataString);
    //
    //  Create AJAX Request
    //
    var method = "POST";
    if (action === "update") {
      var route = "/practices/update";
    }
    else {
      var route = "/practices/add";
    }
    var contentType = "application/json";
    //
    //  Send User POST Request
    //
    xhrRequest(method, route, contentType, dataString, (err, result) => {
      if (!err) {
        var resBody = result.responseText;
        //
        // Clear create user form
        //
        document.getElementById("formAddPractice").reset();
        //
        // Close form and modal
        //
        document.getElementById("addPractice").style.display = 'block';
        modal.style.display = "none";
        //
        // Update list
        //
        listPractices();
      }
      else {
        document.getElementById("pErrMsg").innerHTML = "Practice submit error";
      }
    });
  }
  else {
    formAddPractice.reportValidity();
  }
};

// ===========================================================================
//  Leads Capture
// ===========================================================================

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

// ===========================================================================
//  Practise 
// ===========================================================================
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

// ===============================
//  Utilities - Form Data Extract
// ===============================
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
// ==================================================================================
//  Utilities - Data List Display 
// ==================================================================================
//
// ----------------------------------
//  Create table and display content
// ----------------------------------
function displayData(content, title, layoutId) {
  console.log("---> List content: ", content);
  //
  //  Read layout definition
  //
  var layout = readLayout(layoutId);
  console.log("---> Layout definition: ", layout);
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
  console.log("---> Table Rows - number: ", rowCount);
  console.log("---> Table Rows - detail: ", rows);
  //
  // Add row function as required for dtype of list
  //
  if (id === "0"){
    var rowFunc = function(){ displayUser(this); };
  }
  if (id === "2"){
    var rowFunc = function(){ displayPractice(this); };
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
        //'{ "fname" : "contactNum" , "label" : "Contact #" },' +
        //'{ "fname" : "altNumber" , "label" : "Alternate #" },' +
        //'{ "fname" : "cellNumber" , "label" : "Cell #" },' +
        //'{ "fname" : "eMail" , "label" : "eMail" },' +
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
        '{ "fname" : "backOffice.contact.firstName" , "label" : "Contact First Name" },' +
        '{ "fname" : "backOffice.contact.surname" , "label" : "Contact Surname" }' +
        // '{ "fname" : "backOffice.contact.phone" , "label" : "Contact Phone" },' +
        // '{ "fname" : "backOffice.contact.cell" , "label" : "Contact Cell" },' +
        // '{ "fname" : "backOffice.contact.email" , "label" : "Contact Email" }' +
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

// ==================================
//  Utilities - Views display toggle
// ==================================

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

// ============================================
//  Utilities - Generic XMLHttpRequest handler
// ============================================

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
//  Utilities - General 
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
        tableRow.style.backgroundColor = 'rgb(244, 244, 248';
        // tableRow.style.backgroundColor = 'white';
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

// // ===========================================
// //  Functions to add elements and text to DOM
// // ===========================================
// /*******************************************************************************************
//  * By https://www.scribd.com/document/2279811/DOM-Append-Text-and-Elements-With-Javascript *
//  *******************************************************************************************/
// // ------------------------------
// //  add text to existing element
// // ------------------------------
// /**************************************************************
//  * Add test:                                                  *
//  * node: The element/node that the text is to be appended to. *
//  * txt: The text to append to the node.                       *
//  **************************************************************/
// function appendText(node,txt) {
//     node.appendChild(document.createTextNode(txt));
// }
// // --------------------
// //  add element to DOM
// // --------------------
// /********************************************************
//  * Add new element:                                     *
//  *      node = element where to add new element         *
//  *      tag = the type of element to add                *
//  *      id = optional id for element                    *
//  *      htm = optional internal html text for element   *
//  ********************************************************/
// function appendElement(node,tag,id,htm) {
//     var ne = document.createElement(tag);
//     if(id) ne.id = id;
//     if(htm) ne.innerHTML = htm;
//     node.appendChild(ne);
// }
// function addElementBefore(node,tag,id,htm) {
//     var ne = document.createElement(tag);
//     if(id) ne.id = id;
//     if(htm) ne.innerHTML = htm;
//     node.parentNode.insertBefore(ne,node);
// }
// function addElementAfter(node,tag,id,htm) {
//     var ne = document.createElement(tag);
//     if(id) ne.id = id;
//     if(htm) ne.innerHTML = htm;
//     node.parentNode.insertBefore(ne,node.nextSibling);
// }
