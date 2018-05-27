import express from 'express';
import dbConnection from './../database/dbRequests';

import StudentDTO from './../database/dto/student.json';
import MatchService from './../service/matchService';
import UserService from './../service/userService';

var router = express.Router();

/* GET the entire data dump. */
router.get('/', async function(req, res, next) {
  const collection = await dbConnection.db().collection('students_master');
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
      return res.send(docs);

  });
});

/* GET the basic info of a user by passing their auth token */
router.get('/getBasicInfo/:auth_token', async function(req, res, next) {
  const collection = await dbConnection.db().collection('students_master');
  const query = { auth_token: req.params.auth_token };

  //Find the profile information for the associated user
  collection.find(query).project(StudentDTO).toArray(function(err, docs) {
    if (err) {
      console.error(err);
      return;
    }
    return res.send(docs);
  });
});

/* POST request that updates the basic info of a user */
router.post('/updateBasicInfo/:auth_token', async function(req, res, next) {
  const collection = await dbConnection.db().collection('students_master');
  const query = { auth_token: req.params.auth_token };
  const newValues = { $set: req.body }; //req.body can only contain whichever key-value pairs you want to update
  
  //Set the new values in the matching document
  collection.updateOne(query, newValues, function(err, result) {
    if (err) {
      console.error(err);
      return;
    }
    return res.send(result);
  });
});

router.get('/matches/:auth_token', async (req, res, next) => {
  
  if (!req.params.auth_token || req.params.auth_token.trim() == '') return res.status(400).send("User not provided.");
  let userFound = null;
  try {
    userFound = await UserService.getUserByToken(req.params.auth_token);
    if(!userFound || userFound.length < 1) throw new Error('Database Error');
  }
  catch(err){
    return res.status(404).statusMessage(err);
  }
  let matchProfiles;

  try {
    matchProfiles = await MatchService.findMatchedProfiles(userFound[0]);
  }catch(err){
    return res.status(500);
  }

  return res.send(matchProfiles);
})

/* POST request that updates who the users recently swiped across and gets the next set of matches */
router.post('/getMatches/:auth_token', async function(req, res, next){

  if (!req.params.auth_token || req.params.auth_token.trim() == '') return res.status(400).send("User not provided.");

  let newlySwipedUsers = req.body.newly_swiped_users;
  let authToken = req.params.auth_token;
  
  let result;
  
  try {
    result = await MatchService.getNextBatchOfMatches(authToken, newlySwipedUsers, req.body.requested_num_of_records);
  }catch(err) {
    console.log(err)
    return res.status(400).send(err);
  }
  return res.send(result);
});

/**
 * ENDPOINTS FOR
 * Authenticate
 * Update profile
 * Update settings
 * Show matches
 * 
 */

module.exports = router;
