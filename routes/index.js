import express from 'express';

import UserController from './../controllers/userController';
import MatchController from './../controllers/matchController';
import DecisionController from './../controllers/decisionController';

var router = express.Router();

/* GET the entire data dump. */
router.get('/', async function(req, res, next) {

  return res.send("API Works");
});

/** Route to handle 'users' api endpoint. */
router.route('/users')
      .get(UserController.getAllUsers);

/** Routes to handle post and get requests for given user. */
router.route('/users/:auth_token')
      .get(UserController.getUserInfo)     
      .post(UserController.modifyUserInfo);

/** Route that serves when the user only looks for filtered results and doesn't care about the score. */
router.get('/users/:auth_token/filteredMatch', MatchController.getFilteredMatches);

/** Route that serves when looking for new matches. Probably the most important link in the whole app. */
router.post('/users/:auth_token/matches', MatchController.getNewMatches);

router.post('/users/:auth_token/decision', DecisionController.handleLikeDislikeDecision)
/**
 * ENDPOINTS FOR
 * Authenticate
 * Update profile
 * Update settings
 * Show matches
 * 
 */

module.exports = router;
