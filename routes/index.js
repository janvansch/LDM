"use strict";

var express = require('express');
var router = express.Router();
// import { Router } from "express"
const fs = require('fs');
const {Product} = require('../models/product');
const {myCache} = require('../middleware/cache');

//==========================================================
// Log Requests (middleware specific to this router)
//==========================================================
router.use((req, res, next) => {
 var now = new Date().toString();
 var log = `${now}: ${req.method} ${req.url}`;

 console.log("Log entry: ", log);
 fs.appendFile('server.log', log + '\n', function (err) {
   if (err) throw err;
 });
 next();
});

/* GET home page. */
router.get('/', async function(req, res, next) {
  // -------------------------------------------
  //  Get list of all the practices (Admin use)
  // -------------------------------------------
  try {
    const product = await Product.find(
      {},
      {
        _id : 0,
      }
    );
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
    res.render('index', { productDef: product, title: 'LDM - Login' });
  }
  catch (e) {
    console.log(">>> Error: ", e);
    res.render('error', { message: 'Failed to load product definitions', error: e });
  }
});

// ------------------------------------
//	Add a new product definition to DB
// ------------------------------------
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
