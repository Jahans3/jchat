/**
 * Created by jahansj on 06/06/2016.
 */
"use strict";

const mongoose = require('mongoose');

let groupSchema = mongoose.Schema({

    name: String,
    founder: String,
    channels: [{
        name: String,
        users: [{
            name: String,
            userid: String,
            accessLevel: Number
        }]
    }],
    users: [{
        name: String,
        userid: String,
        admin: Boolean
    }]

});


module.exports = mongoose.model('Group', groupSchema);