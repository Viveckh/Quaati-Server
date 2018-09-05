import dbConnection from './../database/dbRequests';
import StudentDTO from './../database/dto/student.json';

export default {
  async handleLikeDislikeDecision(req, res, next) {
    let body = req.body;
    let resBody = {
      success: true
    }

    const collection = await dbConnection.db().collection('students_master');
    const query = {
      auth_token: parseInt(req.params.auth_token)
    };
    const student2Query = {
      auth_token: parseInt(body.studentID)
    };

    try {
      let docs = await collection.find(query).project(StudentDTO).toArray();
      let secondUser = await collection.find(student2Query).project(StudentDTO).toArray();
      secondUser = secondUser[0];

      let firstUser = docs[0];
      if (body.isLiked) {
        if(!firstUser.liked){
          firstUser.liked = [];
        }

        // Checks if the other user likes this user first. If they both like each other, voalaaah! they are perfect for each other. 
        // Checks if second user has the current user in the liked list. If yes, then voallah!
        // If not, then add the second user to first user's liked list.
        if (secondUser.liked && secondUser.liked.indexOf(firstUser.auth_token) >= 0) {
          // Match scenario.
          if (!secondUser.matched) secondUser.matched = [];
          if(!firstUser.matched) firstUser.matched = [];

          if(secondUser.matched.indexOf(firstUser.auth_token) <0 ) {
            secondUser.matched.push(firstUser.auth_token);
            let ind = secondUser.liked.indexOf(firstUser.auth_token);
            if(ind >=0) secondUser.liked.splice(ind,1);
          }
          if(firstUser.matched.indexOf(secondUser.auth_token) < 0 ) {
            firstUser.matched.push(secondUser.auth_token);
            let ind = firstUser.liked.indexOf(secondUser.auth_token);
            if(ind >=0) firstUser.liked.splice(ind,1);
          }

          let resp = await collection.updateOne(student2Query, {$set : secondUser});
          if(!resp) return res.status(500).send("Error in DB");
          resBody['matched'] = true;

        } else {
          if(firstUser.liked.indexOf(body.studentID) < 0 ) firstUser.liked.push(body.studentID);
        }

      } else {
        if(!firstUser.disliked) firstUser.disliked = [];

        if(firstUser.disliked.indexOf(body.studentID) < 0){
        // If the user is disliked, then put it in disliked list and update the user. 
          firstUser.disliked.push(body.studentID);
        }
      }

      let user1Update = {
        $set : firstUser
      }
      let result = await collection.updateOne(query, user1Update);
      if(result ) return res.send(resBody)
      else return res.status(500).send("Error in DB");
    } catch (err) {
      console.log("Error!", err)
      return res.status(500).send("Error in DB");
    }

  }
}