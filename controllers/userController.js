import dbConnection from './../database/dbRequests';
import StudentDTO from './../database/dto/student.json';

export default {
  async getUserInfo(req, res, next) {
    const collection = await dbConnection.db().collection('students_master');
    const query = {
      auth_token: parseInt(req.params.auth_token)
    };
    
    //Find the profile information for the associated user
    collection.find(query).project(StudentDTO).toArray(function (err, docs) {
      if (err) {
        console.error(err);
        return;
      }
      return res.send(docs);
    });
  },

  async modifyUserInfo(req,res,next) {
    const collection = await dbConnection.db().collection('students_master');
    const query = { auth_token: parseInt(req.params.auth_token) };
    const newValues = { $set: req.body }; //req.body can only contain whichever key-value pairs you want to update
    
    //Set the new values in the matching document
    collection.updateOne(query, newValues, function(err, result) {
      if (err) {
        console.error(err);
        return;
      }
      return res.send(result);
    });
  },


  async getAllUsers(req, res, next) {
    const collection = await dbConnection.db().collection('students_master');

    collection.find({}).toArray(function (err, docs){
      return res.send(docs);
    })
  }
}