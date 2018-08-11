import UserService from './userService'
import { db, StudentCollection } from './../database/dbRequests';
import MatchResponseDTO from './../database/dto/matchResponse.json';
import Algo from './algo.js'

export default {
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

        //Get the next batch of users for the user to swipe across, make sure they are new
        // const queryToFindMatches = { auth_token: { $nin: auth_tokens_to_exclude } };

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