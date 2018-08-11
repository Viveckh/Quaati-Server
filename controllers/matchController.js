import MatchService from './../service/matchService';
import UserService from './../service/userService';

export default {
  async getFilteredMatches(req, res, next) {
    if (!req.params.auth_token || req.params.auth_token.trim() == '') return res.status(400).send("User not provided.");
    let userFound = null;
    try {
      userFound = await UserService.getUserByToken(req.params.auth_token);
      if (!userFound || userFound.length < 1) throw new Error('Database Error');
    } catch (err) {
      return res.status(404).statusMessage(err);
    }
    let matchProfiles;
    console.log("User with the token is found", userFound.first_name)
    try {
      matchProfiles = await MatchService.findMatchedProfiles(userFound);
    } catch (err) {
      return res.status(500);
    }
    return res.send(matchProfiles);
  },

  async getNewMatches(req, res, next) {
    if (!req.params.auth_token || req.params.auth_token.trim() == '') return res.status(400).send("User not provided.");

    let newlySwipedUsers = req.body.newly_swiped_users;
    let authToken = req.params.auth_token;

    let result;

    try {
      result = await MatchService.getNextBatchOfMatches(authToken, newlySwipedUsers, req.body.requested_num_of_records);
    } catch (err) {
      console.log(err)
      return res.status(400).send(err);
    }
    return res.send(result);
  }
}