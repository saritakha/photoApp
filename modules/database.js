'use strict';

class Database {
    constructor() {
        this.mongoose = require('mongoose');
    }

    //connect to mongodb
    //////////////////////////////////////////////////////////////////
    connectDB(url, app) {
        this.mongoose.connect(url).then((data) => {
            console.log('database connected');
        },
         err => {
            console.log('Connection to db failed: ' + err);
        });
    }

    //database schema
    //////////////////////////////////////////////////////////////////
    getSchema(schema, name) {
        const s = new this.mongoose.Schema(schema);
        return this.mongoose.model(name, s);
    }
}

module.exports = new Database();