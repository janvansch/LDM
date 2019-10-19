"use strict";

const express = require('express');
const router = express.Router();
// import { Router } from "express"
const fs = require('fs');
const {Product} = require('../models/product');
const {loginPage, loginUser} = require('../controllers/accessCtrl');
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
const {myCache} = require('../middleware/cache');
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

// --------------------------
// Log Requests (middleware)
// --------------------------
router.use((req, res, next) => {
 let now = new Date().toString();
 let log = `${now}: ${req.method} ${req.url}`;

 console.log("===> Log entry: ", log);
 fs.appendFile('server.log', log + '\n', function (err) {
   if (err) throw err;
 });
 next();
});

// --------------------
//  Provide login page
// --------------------
router.get('/', (req, res, next) => {
  // xxxxxxxxxxxxxxxxxxxxxxxx
  //  Investigate node-cache
  // xxxxxxxxxxxxxxxxxxxxxxxx
  myCache.get( "myKey", function( err, value ){
    if( !err ){
      if(value == undefined){
        // key not found
      }
      else{
        console.log( "INDEX - Cached Data: ", value );
        //{ my: "Special", variable: 42 }
        // ... do something ...
      }
    }
  });
  // xxxxxxxxxxxxxxxxxxxxxxxx

  loginPage(req, res);

});

//----------------------------------------
//	Process login request
//----------------------------------------
router.post('/', (req, res) => {
  loginUser(req, res);
});
//window.location.href = "/";



// -------------------------------------------------
//	Utility route to add a product definition to DB
//  Route accessed with Postman
//  This will have to become an admin function
//  Or maybe a setup script?
// -------------------------------------------------
router.post('/addProduct', async (req, res) => {
  try {
    //
    // Extract POST Data
    //
    var body = req.body;
    console.log("===> Product Definition body: ", body);
    const product = new Product(body);
    await product.save();
    res.status(200).send("ok");
  }
  catch (e) {
    console.log("===> ERROR - Add Product: ", e);
    //var errData = JSON.stringify(e);
    res.status(400).send(e);
  }
});

module.exports = router;
