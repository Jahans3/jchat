/**
 * Created by jahansj on 27/05/2016.
 */
"use strict";

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

var url = 'mongodb://localhost:27017/test';

MongoClient.connect(url, function(err, db) {
    console.log("Connected correctly to server.");

    insertUser(db)
    findUsers(db)
    //db.close();
});

let insertUser = (db) => {
    db.collection('users').insertOne(
        {
            username: 'aaron paul',
            password_hash: '2e9dwqjxwqiw9d390293r',
            channels: ['channel-1', 'channel-2']
        },
        function(err, result) {
            assert.equal(err, null);

            console.log(`Inserted a new user into table users`);
        });
};

let findUsers = (db) => {
    let cursor = db.collection('users').find( );

    cursor.each(function(err, doc) {

        assert.equal(err, null);

        if (doc != null) {
            console.log('Table not null');

            console.dir(doc);
        } else {
            console.log('Table null');
        }
    });
};

/*
    user {
        username: 'aaron paul',
        password/hash: '2e9dwqjxwqiw9d390293r',
        channels: ['channel-1', 'channel-2']
    }
 */

//addUser

//findUser

