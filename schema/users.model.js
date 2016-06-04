/**
 * Created by jahansj on 31/05/2016.
 */
"use strict";

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

let userSchema = mongoose.Schema({

    local: {
        email: String,
        password: String
    },

    facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    },

    twitter: {
        id: String,
        token: String,
        email: String,
        name: String
    },

    google: {
        id: String,
        token: String,
        email: String,
        name: Object
    }

});

userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);