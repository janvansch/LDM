"use strict";
//============================================================================
// Admin View - System Users
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
    var request = "";
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
  // -------------------------------------------------------------------------
  //  If adviser role is selected display service ability selection else hide
  // -------------------------------------------------------------------------
  function isAdviser() {
    if (document.getElementById('roleC').checked) {
      // switch accreditation and skills on
      document.getElementById('s-ins-lines').style.display = 'block';
    }
    else if (
        document.getElementById('roleA').checked ||
        document.getElementById('roleB').checked ||
        document.getElementById('roleD').checked
      ) {
      // switch accreditation and skills off
      document.getElementById('s-ins-lines').style.display = 'none';
    }
  }
  // -----------------------------
  //  Display add user modal form
  // -----------------------------
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
  
  // --------------------------------
  //  Display user detail modal form
  // --------------------------------
  function displayUser(userId) {
    //
    // open model window
    //
    // var modal = document.getElementById('modalBox');
    modal.style.display = "block";
    //
    // Display user form
    //
    document.getElementById("displayUser").style.display = 'block';
    document.getElementById("modal-header-text").innerHTML = "Selected User's Detail - Update/Delete";
    document.getElementById("addUserButtons").style.display = "none";
    document.getElementById("updateUserButtons").style.display = "block";
    
    console.log(">>> User Email: ", userId);

    //
    // Create User Data request
    //
    var request = JSON.stringify({userId : userId});
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
        // Fill display form with user's data
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
        // If user is an adviser set selection boxes
        // to indicate the adviser's accreditation/services
        //
        if (role === "C") {
          //
          // Display adviser skill detail
          //
          document.getElementById("s-ins-lines").style.display = 'block';
          var services = user[0].services;
          showServices(services, 's');



          // var services = user[0].services;
          // //
          // // Display insurance line selector 
          // //
          // document.getElementById('selectAbility').style.display = 'block';
          // for (var i = 0, j = services.length; i < j; i++) {
          //   if (services[i].line === "PL") {
          //     //
          //     // Set insurance line selector tickbox to selected
          //     //
          //     document.getElementById("pServType").checked = true;
          //     //
          //     // Display insurance type selector
          //     //
          //     document.getElementById('dispPersServ').style.display = 'block';
          //     //
          //     // Set insurance line type tickboxes 
          //     //
          //     for (var x = 0, z = services[i].types.length; x < z; x++) {
          //       console.log(">>> Services Detail: ", x, services[i].types[x]);
          //       if (services[i].types[x] === "Private Vehicle") {
          //         document.getElementById("pVehicle").checked = true;
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
          //     document.getElementById("cServType").checked = true;
          //     document.getElementById('dispCommServ').style.display = 'block';
          //     for (var x = 0, z = services[i].types.length; x < z; x++) {
          //       console.log(">>> Services Detail: ", x, services[i].types[x]);
          //       if (services[i].types[x] === "Business") {
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
          //     document.getElementById("sServType").checked = true;
          //     document.getElementById('dispSasrServ').style.display = 'block';
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
          //     document.getElementById("aServType").checked = true;
          //     document.getElementById('dispAgriServ').style.display = 'block';
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
          //     document.getElementById("xServType").checked = true;
          //     document.getElementById('dispSpecServ').style.display = 'block';
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
          //}
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
    //  Create AJAX Request - update or add User
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
        document.getElementById("addUser").style.display = 'none';
        modal.style.display = "none";
        //
        // Update list
        //
        listUsers();
      }
      else {
        var prompt = "User submit error";
        document.getElementById("errMsg").innerHTML = prompt;
      }
    });
  }
  
  //============================================================================
  // Admin View - Practices
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
    var request = "";
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
    //modalPrac.style.display = "block";
    modal.style.display = "block";
    //document.getElementById("viewAdminUser").style.display = 'block';
    // open add user form
    document.getElementById("addPractice").style.display = 'block';
    document.getElementById("modal-header-text").innerHTML = "Add Practice";
    document.getElementById("addPracticeButtons").style.display = "block";
    document.getElementById("updatePracticeButtons").style.display = "none";
  }
  
  // -------------------------
  //  Display Practice Detail
  // -------------------------
  function displayPractice(practiceCode) {
    //
    // open model window
    //
    // var modal = document.getElementById('modalBox');
    //modalPrac.style.display = "block";
    modal.style.display = "block";
    //
    // Display user form
    //
    document.getElementById("addPractice").style.display = 'block';
    document.getElementById("modal-header-text").innerHTML = "Update Practice or Delete";
    document.getElementById("addPracticeButtons").style.display = "none";
    document.getElementById("updatePracticeButtons").style.display = "block";
    
    console.log(">>> Practice Code: ", practiceCode);

    //
    // Create User Data request
    //
    var request = JSON.stringify({pracCode : practiceCode});
    var method = "POST";
    var route = "/practices/practice";
    var contentType = "application/json";
    //
    //  Request Practice Data from Server
    //
    console.log(">>> Request: ", request);
    xhrRequest(method, route, contentType, request, (err, res) => {
      if (!err) {
        var practice = JSON.parse(res.responseText);
        console.log(">>> Practice Detail: ", practice);
        //
        // Fill form with selected practice data
        //
        console.log("---> Practice Code from server: ", practice[0].pracCode);
        document.getElementById("pracCode").value = practice[0].pracCode;
        document.getElementById("pracName").value = practice[0].pracName;
        document.getElementById("pracPhone").value = practice[0].pracPhone;
        document.getElementById("pracEmail").value = practice[0].pracEmail;
  
        document.getElementById("prinFirstName").value = practice[0].principle.firstName;
        document.getElementById("prinSurname").value = practice[0].principle.surname;
        document.getElementById("prinPhone").value = practice[0].principle.phone;
        document.getElementById("prinCell").value = practice[0].principle.cell;
        document.getElementById("prinEmail").value = practice[0].principle.email;
  
        document.getElementById("offFirstName").value = practice[0].backOffice.contact.firstName;
        document.getElementById("offSurname").value = practice[0].backOffice.contact.surname;
        document.getElementById("offPhone").value = practice[0].backOffice.phone;
        document.getElementById("offCell").value = practice[0].backOffice.cell;
        document.getElementById("offEmail").value = practice[0].backOffice.email;
  
        for (var i = 0; i < practice[0].area.length; i++) {
          insertPostCode(practice[0].area[i])
        }
        var pCode = document.getElementById("pracCode").value;
        console.log("===> Practice Code from DOM: ", pCode);
      }
    });
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
  
  // -------------------------------
  //  Process add postal code event
  // -------------------------------
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
      // Insert postal code into table
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
        //
        // Add mouse select functions
        // 
        tableCell.onclick = function(){displayPostCode(this.innerHTML);};
        tableCell.onmouseover = function(){ ChangeColor(this, true); };
        tableCell.onmouseout = function(){ ChangeColor(this, false); };
      }
    }
  }
  
  // ----------------------------
  //  Update postal code display
  // ----------------------------
  function insertPostCode(code) {
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
      tableCell.innerHTML = (isString(code) ? (code.trim()) : (code));
      //
      // Add mouse select functions
      // 
      tableCell.onclick = function(){displayPostCode(this.innerHTML);};
      tableCell.onmouseover = function(){ ChangeColor(this, true); };
      tableCell.onmouseout = function(){ ChangeColor(this, false); };
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
  
  // ------------------------------------------
  //  Update postal code list with maintenance
  // ------------------------------------------
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
  function submitPractice(action) {
    console.log("---> Practice Action: ", action);
    //
    //  Extract new/update practice data from DOM
    //
    var formAddPractice = document.getElementById("formAddPractice");
    //
    // Do data validations
    //
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
      // Extract area data
      //
      var areaCodes = [];
      for (var i=0; i < rowCount; i++) {
        for (var j=0; j < cellCount; j++) {
          areaCodes.push(table.rows[i].cells[j].innerHTML);
        }
      }
      console.log(">>> Area Codes extracted: ", areaCodes);
      //
      // Extract login user information
      //
      var user = document.getElementById("user").innerHTML
      var who = user.replace("User: ", "");
      //
      //  Create practice data object
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
      console.log(">>> Practice Data to send: ", dataString);
      //
      //  Create AJAX Request - update or add Practice
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
      //  Send Practice POST Request
      //
      xhrRequest(method, route, contentType, dataString, (err, result) => {
        if (!err) {
          //
          // Clear create practice form
          //
          document.getElementById("formAddPractice").reset();
          //
          // clear postal code table
          //
          var table = document.getElementById("tablePCode");
          table.innerHTML = "<tr> </tr>";
          //
          // Close form and modal
          //
          document.getElementById("addPractice").style.display = 'none';
          modal.style.display = "none";
          //
          // Update practice list
          //
          listPractices();
        }
        else {
          document.getElementById("errMsg").innerHTML = "Practice submit error";
        }
      });
    }
    else {
      formAddPractice.reportValidity();
    }
  }