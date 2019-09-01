const _ = require('lodash');
const {User} = require('../models/user');


//----------------------------------------
//	Login User
//----------------------------------------
var loginUser = async (req, res) => {
  console.log("Login User Started");
  try {
    const body = _.pick(req.body, ['email', 'password']);
    const user = await User.findByCredentials(body.email, body.password);
    console.log("User found");
    const token = await user.generateAuthToken();
    console.log("Token generated");
    console.log ("---> User:", _.pick(user, ['_id', 'roleCode', 'practiceCode', 'email']));
    res.header('x-auth', token).send(_.pick(user, ['_id', 'roleCode', 'practiceCode', 'email']));
  }
  catch (e) {
    res.status(400).send();
  }
}

module.exports = {loginUser};

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
    toggleView("nav");
    toggleView("navLead");
    navSetup("D", userId, userId);
  }
  else {
    console.log(`>>> Error - No role defined!
      User ID: ${userId},
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
