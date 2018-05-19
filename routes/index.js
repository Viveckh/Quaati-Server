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

/**
 * ENDPOINTS FOR
 * Authenticate
 * Update profile
 * Update settings
 * Show matches
 * 
 */

module.exports = router;
