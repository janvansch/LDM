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
    title: 'Login:'
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

    // ----------------------------------------------------
    //  Setup user view in accordance with the user's role
    // ----------------------------------------------------
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
        title: 'Admin Options:',
        modal: "yes",
        view: "admin",
        user: userEmail,
        userPrac: ""
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
        {func:'openLeadsView("Practice")',text:'View Leads'},
        {func:'listAdvisers(data)',text:'View Advisers'}
      ];
      //
      // View definition
      //
      viewObj = {
        prompt: " ",
        productDef: product,
        menuDef: options,
        title: 'Practice Options:',
        modal: "yes",
        view: "practice",
        user: userEmail,
        userPrac: userPracCode
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
        {func:'openLeadsView("Adviser")',text:'View Assigned Leads'}
        //{func:'listAdvClients(user)',text:'View Clients'}
      ];
      //
      // View definition
      //
      viewObj = {
        prompt: " ",
        productDef: product,
        menuDef: options,
        title: 'Adviser Options:',
        modal: "yes",
        view: "adviser",
        user: userEmail,
        userPrac: ""
      };
    }
    //
    // Leads Agent role view
    //
    if (userRole==="D") {
      //
      // Menu definition
      //
      const options = [
        {func:'profile(user)',text:'Edit Profile'},
        // {func:'openAddLead()',text:'Add Lead'},
        {func:'openLeadsView("")',text:'Leads'}
      ];
      //
      // View definition for index.ejs
      //
      viewObj = {
        prompt: " ", // not used?
        productDef: product, // the cover options
        menuDef: options, // the menu options
        title: 'Agent Options:', // menu header
        modal: "yes", // if yes include modal place holder in view
        view: "agent", // which view to display
        user: userEmail, // the user's id
        userPrac: ""
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
