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

