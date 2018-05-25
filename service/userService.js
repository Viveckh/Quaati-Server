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
    }
}

