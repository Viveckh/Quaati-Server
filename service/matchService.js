import UserService from './userService'
import { db, StudentCollection } from './../database/dbRequests';
import MatchResponseDTO from './../database/dto/matchResponse.json';
import Algo from './algo.js'

/** 
 * This service class helps find the new matches for the user. The functions include filtering the users and computation of Student Score.
 * @author Sujil Maharjan
*/
export default {
    /**
     * Finds the filtered matches. Current filter:
     * Class Status, Gender.
     * @author Sujil Maharjan
     * @param {Object} user Holds the user object. 
     * @returns all the filtered users. It doesn't have the student score.
     */
    async findMatchedProfiles(user) {
        let filterProps = {
            "class_status": user.class_status,
            "auth_token": { $ne: parseInt(user.auth_token) },
            "gender": user.gender
        }

        let filteredUsers;
        try {
            console.log("Filtering users for ", user.first_name);
            filteredUsers = await UserService.getUsersByFilter(filterProps);
            console.log("Filter done")
        } catch (err) {
            return err;
        }

        return filteredUsers;
    },

    /**
     * Gets the next batch of matches for the user with computed scores. The computed scores is based on a computational algorithm
     * that accounts for the similarity in personality between students. 
     * The 'similarity score' is calculated in 0-1. Multiply it with 100 to get the percentage.
     * @author Sujil Maharjan
     *
     * @param {String} token Holds the user's token
     * @param {Array} newSwipedUsers Holds the list of all the newly swiped users.
     * @param {Number} requestedNumberOfRecords Holds the total number of records that the user wants to see.
     * @returns the list of new matches with the score attached with their object.
     */
    async getNextBatchOfMatches(token, newSwipedUsers, requestedNumberOfRecords) {
        let userFound = null;
        try {
            userFound = await UserService.getUserByToken(token);
            
            if (!userFound || userFound.length < 1) throw new Error('Database Error');
        }
        catch (err) {
            return err;
        }

        const query = { auth_token: parseInt(token) };
        // pushing each of the entries in newly_swiped_users to the people_swiped array
        const newValues = { $push: { people_swiped: { $each: newSwipedUsers } } };

        //Add the last batch of users the current user swiped across to db
        let docs;
        try {
            docs = await StudentCollection().findOneAndUpdate(query, newValues, { returnOriginal: false });
        } catch (err) {
            console.log("Error")
            return err;
        }

        var auth_tokens_to_exclude;
        if (docs.value != undefined) {
            auth_tokens_to_exclude = docs.value.people_swiped;
        }
        auth_tokens_to_exclude.push(parseInt(token));

        let filterProps = {
            "class_status": userFound.class_status,
            "auth_token": { $nin: auth_tokens_to_exclude },
            "gender": userFound.gender
        }

        let res;
        
        try {
            res = await StudentCollection().find(filterProps).project(MatchResponseDTO).toArray();
            
        }catch(err){
            console.log("Error")
            return err;
        }
        let newArr = Algo.computeScores(userFound, res);
            
        return newArr.slice(0, requestedNumberOfRecords);
    }
}