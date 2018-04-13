const database = require('./database.js');

//database schema
//////////////////////////////////////////////////////////////////
const userSchema = {
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
};
// databasemodel
const userModel = module.exports =  database.getSchema(userSchema, 'userModel');