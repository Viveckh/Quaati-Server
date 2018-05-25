import { db, StudentCollection } from './../database/dbRequests';
import DBCollections from './../properties/dbCollections.json'

export default {
    async getUserByToken(token){
        if (!token) return null;

        let query = { auth_token: token };

        let res = null;
        try {
            res = await StudentCollection().find(query).toArray();
        }catch(err){
            console.log("Error with collection ", err)
            return err;
        }
        return res;
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
            res = await StudentCollection().find(filterQuery).toArray();
        }catch(err){
            console.log("Error with collection ", err)
            return err;
        }
        return res;
    }
}

