import { db, StudentCollection } from './../database/dbRequests';

/** 
 * This service class helps to get/set the user information in the database. 
 * @author Sujil Maharjan
 * 
*/
export default {
    async getUserByToken(token){
        if (!token) return null;

        let query = { auth_token: parseInt(token) };

        let res = null;
        try {
            res = await StudentCollection().find(query).toArray();
        }catch(err){
            console.log("Error with collection ", err)
            return err;
        }
        return res.length >=1 ? res[0] : [];
    },

    async getAllUsers() {
        let res = null;
        try {
            res = await StudentCollection().find().toArray();
        }catch(err){
            console.error("Database error: ", err)
            return err;
        }

        return res;
    },

    async getUsersByFilter(filterQuery){
        if (!filterQuery) return null;

        let res = null;
        try {
            console.log("Getting users by filter...")
            res = await StudentCollection().find(filterQuery).toArray();
            console.log("Found users...")
        }catch(err){
            console.log("Error with collection ", err)
            return err;
        }
        return res;
    }
}

