import express from 'express';
import dbConnection from './../database/dbRequests';
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
  const fieldsToReturn = { first_name: 1, last_name: 1 };

  //Find the profile information for the associated user
  collection.find(query).project(fieldsToReturn).toArray(function(err, docs) {
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

/* POST request that updates who the users recently swiped across and gets the next set of matches */
router.post('/getMatches/:auth_token', async function(req, res, next){
  const collection = await dbConnection.db().collection('students_master');
  const query = { auth_token: req.params.auth_token };
  // pushing each of the entries in newly_swiped_users to the people_swiped array
  const newValues = { $push: { people_swiped: { $each : req.body.newly_swiped_users } } };
  
  //Add the last batch of users the current user swiped across to db
  collection.findOneAndUpdate(query, newValues, {returnOriginal: false}, function(err, docs) {
    if (err) {
      console.error(err);
      return;
    }
    
    var auth_tokens_to_exclude;
    if (docs.value != undefined) {
      auth_tokens_to_exclude = docs.value.people_swiped;
    }
    auth_tokens_to_exclude.push(req.params.auth_token);

    //Get the next batch of users for the user to swipe across, make sure they are new
    const queryToFindMatches = { auth_token: { $nin: auth_tokens_to_exclude } };
    const requested_num_of_records = Number(req.body.requested_num_of_records);
    const fieldsToReturn = { first_name: 1, last_name: 1 };
    collection.find(queryToFindMatches).limit(requested_num_of_records).project(fieldsToReturn).toArray(function(err, docs) {
      if (err) {
        console.error(err);
        return;
      }
      return res.send(docs);
    });
  });
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
