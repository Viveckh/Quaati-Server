import UserService from './userService'

export default {
    async findMatchedProfiles(user){
        let filterProps ={
            "class_status": user.class_status,
            "auth_token": {$ne: user.auth_token}
        }

        let filteredUsers;
        try{
            filteredUsers = await UserService.getUsersByFilter(filterProps);
        }catch(err){
            return err;
        }

        return filteredUsers;
    }
}