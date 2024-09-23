const mongoose = require("mongoose");

// Application creator schema definition
const ApplicationCreatorSchema = new mongoose.Schema({
    name: {
        type:String,
    },
    app_category: {
        type: String,
    },
    wallet_address: {
        type: String,
        require: true,
        unique: true,
    },
});

// TODO: Organization schema definition 
const OrganizationSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    org_category : {
        type: String,
    },
    wallet_address: {
        type: String,
        require: true,
        unique: true,
    },
})

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
const AppUser = mongoose.model("AppUser", ApplicationCreatorSchema);
const OrgUser = mongoose.model("OrgUser", OrganizationSchema);
const User = mongoose.model("User", UserSchema);

// Exports
module.exports = {
    AppUser,
    OrgUser,
    User
};



