const _ = require('lodash');
const express = require('express');
const router = express.Router();

// const {mongoose} = require('../db/mongoose');
const {Practice} = require('../models/practice');

// ----------------------------------------
//	Add Practice
// ----------------------------------------
router.post('/add', async (req, res) => {
  console.log(">>> Router - Add Practice request received: ", req.url, req.body);
  try {
    const body = _.pick(req.body, [
      'pracCode',
      'pracName',
      'pracPhone',
      'pracEmail',
      //'pracLeadCount',
      'principle',
	    'backOffice',
	    'area',
      'who'
    ]);
    body['pracLeadCount'] = 0;
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
//  Get practice detail
// ----------------------------------------
router.post('/practice', async (req, res) => {
  console.log(">>> Request body and url: ", req.body, req.url);
  try {
    const practice = await Practice.find(
      { 
        pracCode: req.body.pracCode 
      },
      {
        _id : 0,
        pracLeadCount : 0,
        who : 0,
        createdAt : 0,
        updatedAt : 0
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
//  Update practice detail
// ----------------------------------------
router.post('/update', async (req, res) => {
  console.log(">>> Request body and url: ", req.body, req.url);
  try {
    const body = _.pick(req.body, [
      'pracCode',
      'pracName',
      'pracPhone',
      'pracEmail',
      'principle',
      'backOffice',
      'area',
      'who'
      
    ]);
    console.log(">>> Practice body: ", body);
    console.log(">>> Practice Area: ", body.area);
    await Practice.findOneAndUpdate(
      { pracCode: body.pracCode 
      },
      {
        'pracCode' : body.pracCode,
        'pracName' : body.pracName,
        'pracPhone' : body.pracPhone,
        'pracEmail' : body.pracEmail,
        'principle.firstName' : body.principle.firstName,
        'principle.surname' : body.principle.surname,
        'principle.phone' : body.principle.phone,
        'principle.cell' : body.principle.cell,
        'principle.email' : body.principle.email,
        'backOffice.contact.firstName' : body.backOffice.contact.firstName,
        'backOffice.contact.surname' : body.backOffice.contact.surname,
        'backOffice.phone' : body.backOffice.phone,
        'backOffice.cell' : body.backOffice.cell,
        'backOffice.email' : body.backOffice.email,
        'area' : body.area,
        'who' : body.who
      },
      {
        upsert: false,
        new: true
      }
    )
    res.status(200).send("Ok");
  }
  catch (e) {
    console.log(">>> Practice update error: ", e);
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
        //backOffice : 0,
        area : 0,
        createdWhen : 0,
        createdBy : 0
      }
    );
    //console.log(">>> Data Returned: ", practices);
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
          prinSurname : practices[i].principle.surname,
          offFirstName : practices[i].backOffice.contact.firstName,
          offSurname : practices[i].backOffice.contact.surname
        }
      );
    }
    //console.log(">>> Data list: ", listData);
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
