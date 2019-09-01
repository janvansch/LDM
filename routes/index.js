"use strict";

const express = require('express');
const router = express.Router();
// import { Router } from "express"
const fs = require('fs');
const {Product} = require('../models/product');
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
const {myCache} = require('../middleware/cache');
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

//==========================================================
// Log Requests (middleware)
//==========================================================
router.use((req, res, next) => {
 let now = new Date().toString();
 let log = `${now}: ${req.method} ${req.url}`;

 console.log("===> Log entry: ", log);
 fs.appendFile('server.log', log + '\n', function (err) {
   if (err) throw err;
 });
 next();
});

// -------------
//  GET UI page
// -------------
router.get('/', async function(req, res, next) {
  try {
    //
    // Product Structure Definition
    //
    // Retrieve product definitions from DB
    //
    console.log("Start Product data load");
    const product = await Product.find(
      {},
      {
        _id : 0,
      }
    );
    console.log("Product data loaded");
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
    //
    // Leads Menu Definition
    //
    const options = [
      {func:'profile(user)',text:'Edit Profile'},
      {func:'addLead()',text:'Add Lead'},
      {func:'selectLead()',text:'View Leads'}
    ]
    // Modal definition for Login
    //
    const modal = "";
    //
    // Render App UI page with definition data
    //
    res.render('index', {
      productDef: product,
      menuDef: options,
      modalDef: modal,
      view: "login",
      title: 'LDM - Login'
    });
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
