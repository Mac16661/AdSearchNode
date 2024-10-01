const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    category : {
        type: String,
    },
    wallet_address: {
        type: String,
        require: true,
        unique: true,
    },
    country: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        default: ""
    }
})

// Creating Schema from schema definition
const User = mongoose.model("User", UserSchema);

// Exports
module.exports = {
    User
};



