const mongoose = require("mongoose");

const AdSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    image: {
        type: String,
        require: true,
    },
    available_balance: {
        type: Number,
        require: true,
        default: 0,
    },
    tags : {
        type: [String],
    },
    org_id: {
        type: String,
        require: true,
    },
    org_name: {
        type: String,
        require: true,
    },
    embedding: {
        type: [Number]
    },
    impression: {
        type: Number,
        default: 0,
    }
});

const Ad = mongoose.model("Ad", AdSchema);

module.exports = Ad;