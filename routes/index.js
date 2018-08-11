import express from 'express';
import dbConnection from './../database/dbRequests';

import StudentDTO from './../database/dto/student.json';
import MatchService from './../service/matchService';
import UserService from './../service/userService';

import UserController from './../controllers/userController';
import MatchController from './../controllers/matchController';

var router = express.Router();

/* GET the entire data dump. */
router.get('/', async function(req, res, next) {

  return res.send("API Works");
});

router.route('/users')
      .get(UserController.getAllUsers);

router.route('/users/:auth_token')
      .get(UserController.getUserInfo)     
      .post(UserController.modifyUserInfo);

router.get('/users/:auth_token/filteredMatch', MatchController.getFilteredMatches);

router.post('/users/:auth_token/matches', MatchController.getNewMatches);


/**
 * ENDPOINTS FOR
 * Authenticate
 * Update profile
 * Update settings
 * Show matches
 * 
 */

module.exports = router;
