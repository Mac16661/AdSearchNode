/*
 *  Connects to external services
 */

const mongoose = require("mongoose");

// MongoDB database connection
mongoose.set("strictQuery", true);

async function connectToMongoDB(url) {
    return await mongoose.connect(url, {dbName: 'testDB'});
}

module.exports = {
    connectToMongoDB,
};