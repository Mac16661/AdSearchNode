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

// Creating Schema from schema definition
const AppUser = mongoose.model("AppUser", ApplicationCreatorSchema);
const OrgUser = mongoose.model("OrgUser", OrganizationSchema)

// Exports
module.exports = {
    AppUser,
    OrgUser,
};



