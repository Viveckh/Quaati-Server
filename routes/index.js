import express from 'express';
import dbConnection from './../database/dbRequests';
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  const collection = await dbConnection.db().collection('students_master');
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
      console.log("Found the following records");
      // console.log(docs)
      //return docs;
      return res.send(docs);
  });

  //res.render('index', { title: 'Express' });
});

module.exports = router;
