import UserService from './userService'
import { db, StudentCollection } from './../database/dbRequests';

export default {
    async findMatchedProfiles(user) {
        let filterProps = {
            "class_status": user.class_status,
            "auth_token": { $ne: user.auth_token },
            "gender": user.gender
        }

        let filteredUsers;
        try {
            filteredUsers = await UserService.getUsersByFilter(filterProps);
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
        const requested_num_of_records = Number(requestedNumberOfRecords);
        const fieldsToReturn = { first_name: 1, last_name: 1 };

        let filterProps = {
            "class_status": userFound.class_status,
            "auth_token": { $nin: auth_tokens_to_exclude },
            "gender": userFound.gender
        }

        let res;
        
        try {
            res = await StudentCollection().find(filterProps).limit(requested_num_of_records).toArray();
            
        }catch(err){
            console.log("Error")
            return err;
        }
            
        return res;
    }
}