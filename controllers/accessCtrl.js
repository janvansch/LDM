const _ = require('lodash');
const {User} = require('../models/user');
const {Product} = require('../models/product');

// ----------------------------------------
//	Render Login Page
// ----------------------------------------
var loginPage = (req, res, promptText) => {

  if (promptText === undefined) {
    var promptText = " ";
  }

  const options = [{func:'profile(user)',text:'Reset Password'}];

  //
  // Render App login page
  //
  res.render('index', {
    prompt: promptText,
    menuDef: options,
    modal: "yes",
    view: "login",
    user: "",
    title: 'LDM - Login'
  });
}
// ----------------------------------------
//	Process access request - Login User
// ----------------------------------------
var loginUser = async (req, res) => {
  // console.log("Login User Started");
  // console.log("===> Login data", req.body.logindata);
  try {
    // -----------------------------------------------------
    //  Validate user credentials and create security token
    // -----------------------------------------------------
    //
    // Extract credentials from request
    //
    const email = req.body.logindata[0];
    const pwd = req.body.logindata[1];
    //const body = _.pick(req.body, ['email', 'password']);
    //
    // Call User schema static method to do validation
    //
    const user = await User.findByCredentials(email, pwd);
    console.log("---> User found");
    //
    // Call User schema method to generate access token for the user
    //
    const token = await user.generateAuthToken();
    console.log("---> Token generated");

    // ----------------------------
    //  Extract required user data
    // ----------------------------
    const userInfo = (_.pick(user, ['_id', 'roleCode', 'practiceCode', 'email']));
    console.log ("---> User Info:", userInfo);
    const userId = userInfo._id;
    const userEmail = userInfo.email;
    const userRole = userInfo.roleCode;
    const userPracCode = userInfo.practiceCode;

    console.log(`>>> User Information:
      User ID: ${userId},
      User email: ${userEmail},
      User Role: ${userRole},
      Practice Code: ${userPracCode}`);

    // ------------------------------------------
    //  Retrieve product definition data from DB
    // ------------------------------------------
    console.log("Start Product data load");
    const product = await Product.find(
      {},
      {
        _id : 0,
      }
    );
    console.log("Product data loaded");

    // -------------------------------------
    //  Setup view according to user's role
    // -------------------------------------
    let viewObj;
    //
    // Admin role view
    //
    if (userRole==="A") {
      //
      // Menu definition
      //
      const options = [
        {func:'profile(user)',text:'Edit Profile'},
        {func:'listPractices()',text:'View Practices'},
        {func:'listUsers()',text:'View Users'}
      ];
      //
      // View definition
      //
      viewObj = {
        prompt: " ",
        productDef: product,
        menuDef: options,
        modal: "yes",
        view: "admin",
        user: userEmail,
        title: 'LDM - Login'
      };
    }
    //
    // Practice role view
    //
    if (userRole==="B") {
      //
      // Menu definition
      //
      const options = [
        {func:'profile(user)',text:'Edit Profile'},
        {func:'listPracLeads(data)',text:'View Leads'},
        {func:'listAdvisers(data)',text:'View Advisers'}
      ];
      //
      // View definition
      //
      viewObj = {
        prompt: " ",
        productDef: product,
        menuDef: options,
        modal: "yes",
        view: "practice",
        user: userEmail,
        title: 'LDM - Login'
      };
    }
    //
    // Adviser role view
    //
    if (userRole==="C") {
      //
      // Menu definition
      //
      const options = [
        {func:'profile(user)',text:'Edit Profile'},
        {func:'listAdvLeads(data)',text:'View Leads'},
        {func:'listAdvClients(data)',text:'View Clients'}
      ];
      //
      // View definition
      //
      viewObj = {
        prompt: " ",
        productDef: product,
        menuDef: options,
        modal: "yes",
        view: "adviser",
        user: userEmail,
        title: 'LDM - Login'
      };
    }
    //
    // Agent role view
    //
    if (userRole==="D") {
      //
      // Menu definition
      //
      const options = [
        {func:'profile(user)',text:'Edit Profile'},
        {func:'openAddLead()',text:'Add Lead'},
        {func:'selectLead()',text:'View Leads'}
      ];
      //
      // View definition
      //
      viewObj = {
        prompt: " ",
        productDef: product,
        menuDef: options,
        modal: "yes",
        view: "lead",
        user: userEmail,
        title: 'LDM - Login'
      };
    }
    // ------------------------------------------------
    //  Render the view for the authorised user's role
    // ------------------------------------------------
    res
      .header('x-auth', token)
      .render('index', viewObj)
      //.end()
    ;
  }
  // -----------------------------------------------------
  //  Login invalid - render login page with error prompt
  // -----------------------------------------------------
  catch (e) {
    console.log(e);
    const prompt = 'Login Failed - Invalid Credentials';
    loginPage(req, res, prompt);
  }
}

module.exports = {loginPage, loginUser};

// else if (userRole==="D"){
//   toggleView("viewLead");
//   toggleView("nav");
//   toggleView("navLead");
//   navSetup("D", userId, userId);
// }

// // ----------------------------
// //  Validate login credentials
// // ----------------------------
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

// // ----------------
// //  Open role view
// // ----------------
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

// // -------------------------------
// //  Setup view navigation options
// // -------------------------------
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
