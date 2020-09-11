// ================
//  UserController
// ================
//const {mongoose} = require('../db/mongoose');
const _ = require('lodash');
const {User} = require('../models/user');

// ------------------------------------------------
//  Get all the adviser of the specified practice
//    - Advisers = users with roleCode = C
//    - The practice is determined from the signed
//      in user's practiceCode.
// ------------------------------------------------
var PracticeAdvisers = async (req, res) => {
  const practice = req.params.practice;
  console.log("---> GET parameter and url: ", practice, req.url);
  try {
    const users = await User.find(
      {
        roleCode: "C",
        practiceCode: practice
      },
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
};

// ---------------------------------------------------------------
//  Get all the advisers of the practice and check which has the
//  necessary skill to provide the serviced required by the lead.
// ---------------------------------------------------------------
var SkilledAdvisers = async (req, res) => {
  //
  // Find adviser users for practice
  //
  console.log("*** Find Skills Advisers Started ***")
  console.log("---> Request criteria: ", req.params.criteria);
  //const params = req.params.criteria;
  const objCriteria = JSON.parse(req.params.criteria);
  const practice = objCriteria.practice;
  console.log("---> Practice Criteria: ", practice);
  const services = objCriteria.services;
  console.log("---> Services Required: ", services, services.length);

  try {
    const practiceAdvisers = await User.find(
      {
        roleCode: "C",
        practiceCode: practice
      },
      {
        //services : 0,
        password : 0,
        tokens : 0
      }
    )
    .sort({surname: 1});

    console.log("---> Practice Advisers: ", practiceAdvisers);
    var skilledAdvisers = selectAdvisers(practiceAdvisers, services);
    res.send(skilledAdvisers);
  }

  catch (e) {
    console.log("===> ERROR: ", e);
    var errData = JSON.stringify(e);
    console.log("===> ERROR Data: ", errData);
    res.status(400).send(errData);
  }

};

//
// Select advisers with the required skill
//
function selectAdvisers(adv, serv) {
  console.log(`---> Adviser Count: ${adv.length} Service Count: ${serv.length}`);
  console.log(`---> Lead services: ${serv[0].line}`);
  let adviserList = [];

  for (var n = 0; n < adv.length; n++) { // for every adviser
    console.log(`---> adviser loop counter: ${n}`);
    var skill = adv[n].services;
    console.log(`---> Skills Count: ${skill.length}`);
    console.log(`---> Skills List: ${skill}`);
    var pass = false;
    var nextAdv = false;

    for (var i = 0; i < serv.length && !nextAdv; i++) {
      // loop over the service line items
      console.log(`---> service line loop counter: ${i}`);

      for (var x = 0; x < skill.length && !nextAdv; x++) {
        // for every service line item loop over the skill line items
        console.log(`---> skill line loop counter: ${x}`);

        if (serv[i].line === skill[x].line) {
          // skill and service line items match
          console.log(`---> Line Match - Skill: ${skill[x].line}, Service: ${serv[i].line}`);

          for (var j = 0; j < serv[i].types.length && !nextAdv; j++) {
            // loop over service types of line item
            console.log(`---> service type loop counter: ${j}`);
            var found = false;

            for (var y = 0; y < skill[x].types.length && !found; y++) {
              // Check if skill type matches service type
              console.log(`---> skill type loop counter: ${y}`);
              if (serv[i].types[j] === skill[x].types[y]) {
                found = true; // if found end search
                pass = true; // a candidate for the qualified list
                console.log(`---> Type Match - Service: ${serv[i].types[j]}, Skill: ${skill[x].types[y]}`);
                // skill match found, check next service type item
              }
              // next skill type
            }
            // All skill types checked against service type

            if (found = false) {
              // When the skill type loop ends without a match then the adviser is not qualified
              console.log(`---> No Skill Match - Service Type: ${serv[i].types[j]}`);
              nextAdv = true; // Adviser not qualified, not necessary to check further, check next adviser
              pass = false; // don't add adviser to qualified list
            }
            // next service type
          }
          // All service types checked

        } // End line match state

        else {
          // skill line item does not match service line, try next item
          console.log(`---> No Match - Skill: ${skill[x].line}, Service: ${serv[i].line}`);
        }
        // next skill line
      }
      // All skill items checked no match for service

      // next service line
    }
    // All service lines checked

    if (pass === true) {
      // If pass is true then all service types was found which means the adviser has the required skills
      // Place adviser on qualified list
      console.log("===> Adviser: ", adv[n]);
      adviserList.push(adv[n]);
    }
    // next adviser

  }
  // All advisers checked

  // Return list of qualified advisers
  console.log("===> Adviser list: ", adviserList);
  return (adviserList);

};

module.exports = {PracticeAdvisers, SkilledAdvisers};