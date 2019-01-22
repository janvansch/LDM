var express = require('express');
var router = express.Router();
const fs = require('fs');

//==========================================================
// Log Requests
//==========================================================
router.use((req, res, next) => {
 var now = new Date().toString();
 var log = `${now}: ${req.method} ${req.url}`;

 console.log(log);
 fs.appendFile('server.log', log + '\n', function (err) {
   if (err) throw err;
 });
 next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
  
  res.render('index', { title: 'LDM - Login' });

});

module.exports = router;
