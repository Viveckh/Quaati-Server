import express from 'express';
import assert from 'assert';
import MongoClient from 'mongodb';

const url = 'mongodb://smaharj1:Quaati-db-12345@168.62.52.99:27017/quaati-db-main';
//const url = 'mongodb://168.62.52.99:22/quaati-db-main'
const dbName = 'quaati-db-main';

MongoClient.connect(url, function (err, db) {
    if (err) {
        console.log(err);
        return;
    }
    console.log("arey bhaiii");
    db.close();
});

var dbConnection = MongoClient.connect(url, function(err, client) {
    //assert.equal(null, err);
    if (err) {
        console.log(err);
        return;
    }
    console.log("Connected successfully to database server");

    const db = client.db(dbName);
  });

module.exports = dbConnection;