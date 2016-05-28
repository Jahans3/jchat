/**
 * Created by jahansj on 28/05/2016.
 */
"use strict";

const mongose = require('mongoose');

const user = mongoose.model('User',{
    username: String,
    password: String,
    email: String,
    gender: String,
    address: String
});

module.exports = user;