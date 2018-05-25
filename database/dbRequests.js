import express from 'express';
import assert from 'assert';
import MongoClient from 'mongodb';
import config from './../properties/db.js'
import tunnel from 'tunnel-ssh'
import DBCollections from './../properties/dbCollections.json'

// const url = 'mongodb://localhost:27017/quaati-db-main';

let db = null, server;
let database; 
let student_collection;

let getDB = async () => {
    
    try {
        server = await tunnel(config.config);

        let client = null;
        try {
            console.log("URL", config.url)
            client = await MongoClient.connect(config.url, {useNewUrlParser: true});
        }
        catch(err){
            console.log("ERROR IN DB: ", err);
        }

        console.log("Connected to DB successfully!");
        database = client.db(config.databaseName);

        student_collection = database.collection(DBCollections.STUDENT_COLLECTION)
    }
    catch(err){
        console.log("Error connecting to SSH Tunnel")
    }
    return database;
}

getDB()

exports.db = () => database;

exports.StudentCollection = () => student_collection;