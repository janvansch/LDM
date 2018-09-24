const _ = require('lodash');
const express = require('express');
const router = express.Router();

// const {mongoose} = require('../db/mongoose');
const {Practice} = require('../models/practice');

// ----------------------------------------
//	Add Practice
// ----------------------------------------
router.post('/add', async (req, res) => {
  console.log(">>> Router - Add User request received: ", req.url, req.body);
  try {
    const body = _.pick(req.body, [
      'pracCode',
      'pracName',
      'pracPhone',
      'pracEmail',
      'pracLeadCount',
      'principle',
	    'backOffice',
	    'area',
      'email',
	    'createdWhen',
	    'createdBy'
    ]);
    console.log(">>> body _.picked: ", body);
    const practice = new Practice(body);
    await practice.save();
    res.status(200).send(practice);
  }
  catch (e) {
    res.status(400).send(e);
  }
});

// ----------------------------------------
//  Get user detail
// ----------------------------------------
router.post('/user', async (req, res) => {
  console.log(">>> Request body and url: ", req.body, req.url);
  try {
    const practice = await User.find(
      { code: req.body.practiceCode 
      },
      {
        password : 0,
        tokens : 0
      }
    );
    console.log(">>> Res - Practice data: ", practice);
    res.status(200).send(practice);
  }
  catch (e) {
    res.status(400).send(e);
  }
});

// ----------------------------------------
//  Update user detail
// ----------------------------------------
router.post('/update', async (req, res) => {
  console.log(">>> Request body and url: ", req.body, req.url);
  try {
    const body = _.pick(req.body, [
      'practice',
      'principle',
      'backOffice',
      'area',
      'userId'
      
    ]);
    console.log(">>> Practice data: ", body);
    await practice.findOneAndUpdate(
      { code: body.practiceCode 
      },
      {
        'firstName' : body.firstName,
        'surname' : body.surname,
        'phone' : body.phone,
        'cell' : body.cell,
        'email' : body.email,
        'roleCode' : body.roleCode,
        'services' : body.services
      },
      {
        upsert: false,
        new: true
      }
    )
    console.log(">>> Res: ", practice);
    res.status(200).send(practice);
  }
  catch (e) {
    res.status(400).send(e);
  }
});

// ----------------------------------------
//  Get list of practices
// ----------------------------------------
router.get('/list', async (req, res) => {
  console.log(">>> Request body and url: ", req.body, req.url);
  try {
    const practices = await Practice.find(
      {},
      {
        _id : 0,
        //principle : 0,
        backOffice : 0,
        area : 0,
        createdWhen : 0,
        createdBy : 0
      }
    );
    console.log(">>> Data Returned: ", practices);
    const listData = [];
    for (var i = 0, j = practices.length; i < j; i++) {
      listData.push(
        {
          pracCode : practices[i].pracCode,
          pracName : practices[i].pracName,
          pracPhone : practices[i].pracPhone,
          pracEmail : practices[i].pracEmail,
          pracLeadCount : practices[i].pracLeadCount,
          prinFirstName : practices[i].principle.firstName,
          prinSurname : practices[i].principle.surname
        }
      );
    }
    console.log(">>> Data list: ", listData);
    res.status(200).send(listData);
  }
  catch (e) {
    console.log(">>> Error: ", e);
    res.status(400).send(e);
  }
});

//----------------------------------------
//	Suspend Practise
//----------------------------------------
router.delete('/users/me/token', async (req, res) => {
  try {
    await req.user.removeToken(req.token);
    res.status(200).send();
  }
  catch (e) {
    res.status(400).send();
  }
});

module.exports = router;
