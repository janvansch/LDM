const _ = require('lodash');
const express = require('express');
const router = express.Router();

//const {mongoose} = require('../db/mongoose');
//const {Lead} = require('../models/lead');
const {User} = require('../models/user');
const {PracticeAdvisers, SkilledAdvisers} = require('../controllers/usersCtrl');
const {authenticate} = require('../middleware/authenticate');

/* GET users listing. */

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// module.exports = router;

// ----------------------------------------
//	Add User
// ----------------------------------------
router.post('/add', async (req, res) => {
  console.log(">>> Add User request received: ", req.url, req.body);
  console.log(">>> Add User Services: ", req.body.services[0].line, req.body.services[0].types[0]);
  try {
    const body = _.pick(req.body, [
      'firstName',
      'surname',
	    'phone',
	    'cell',
      'email',
      'roleCode',
      'adviserCode',
	    'practiceCode',
	    'services',
      'password'
    ]);
    console.log(">>> body: ", body);
    const user = new User(body);
    await user.save();
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  }
  catch (e) {
    console.log(">>> Error: ", e);
    res.status(400).send(e);
  }
});

// ----------------------------------------
//  Get user detail
// ----------------------------------------
router.post('/user', (req, res) => {
  console.log(">>> Request body and url: ", req.body, req.url);
  User.find(
    { email: req.body.userId
    },
    {
      password : 0,
      tokens : 0
    }
    ).then((user) => {
      console.log(">>> Res - User data: ", user);
      res.send(user);
    }, (e) => {
      res.status(400).send(e);
    });
});

// ----------------------------------------
//  Update user detail
// ----------------------------------------
router.post('/update', (req, res) => {
  console.log(">>> Request body and url: ", req.body, req.url);
  const body = _.pick(req.body, [
    'firstName',
    'surname',
    'phone',
    'cell',
    'email',
    'roleCode',
    'adviserCode',
    'practiceCode',
    'services'
  ]);
  console.log(">>> Body data: ", body);
  User.findOneAndUpdate(
    { email: body.email
    },
    {
      'firstName' : body.firstName,
      'surname' : body.surname,
      'phone' : body.phone,
      'cell' : body.cell,
      'email' : body.email,
      'roleCode' : body.roleCode,
      'adviserCode' : body.adviserCode,
      'practiceCode' : body.practiceCode,
      'services' : body.services
    },
    {
      upsert: false,
      new: true
    }
  )
  .then(
    (user) => {
      console.log(">>> Res: ", user);
      res.send(user);
    },
    (e) => {
      console.log(">>> Res: ", user);
      res.status(400).send(e);
    }
  );
});

//----------------------------------------
//	Authenticate a user
//----------------------------------------
router.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

// ----------------------------------------
//  Get all users
// ----------------------------------------
router.get('/list', async (req, res) => {
  console.log(">>> Request body and url: ", req.body, req.url);
  try {
    const users = await User.find(
      {},
      {
        services : 0,
        password : 0,
        tokens : 0
      }
    )
    .sort({surname: 1});
    res.send(users);
  }
  catch (e) {
    console.log("===> ERROR: ", e);
    var errData = JSON.stringify(e);
    console.log("===> ERROR Data: ", errData);
    res.status(400).send(errData);
  }
});
// router.get('/list', (req, res) => {
//   User.find(
//     { //_creator: req.user._id
//     },
//     {
//       services : 0,
//       password : 0,
//       tokens : 0
//     }
//     ).then((users) => {
//       res.send(users);
//     }, (e) => {
//       res.status(400).send(e);
//     });
// });

// ------------------------------------------------
//  Get all the advisers of the specified practice
// ------------------------------------------------
router.get('/advisers/:practice', (req, res) => {
  PracticeAdvisers(req, res);
});

// -------------------------------------------------------------------
//  Get all the advisers of the practice that has the required skills
// -------------------------------------------------------------------
router.get('/skilled/:criteria', (req, res) => {
  SkilledAdvisers(req, res);
});

//----------------------------------------
//	Suspend User
//----------------------------------------
router.delete('/users/me/token', authenticate, async (req, res) => {
  try {
    await req.user.removeToken(req.token);
    res.status(200).send();
  }
  catch (e) {
    res.status(400).send();
  }
});

// ----------------------------------------
//	Add adviser user test data via Postman
// ----------------------------------------
router.post('/addAdviser', async (req, res) => {
  try {
    //
    // Extract POST Data
    //
    var body = req.body;
    console.log("===> Adviser test data: ", body);
    //const user = new User(body);
    await User.insertMany(body);
    res.status(200).send("ok");
  }
  catch (e) {
    console.log("===> ERROR - Insert Adviser Data: ", e);
    res.status(400).send(e);
  }
});

module.exports = router;
