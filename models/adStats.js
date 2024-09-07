const mongoose = require("mongoose");

// Create schema definition
const adStats = new mongoose.Schema({
    app_id: String,
    org_id: String,
    feedback: String,
    sentiment: Number,
    org_name: String,
    app_name: String,
    ad_name: String,
})

// Create model 
const Stats = mongoose.model("AdStat", adStats);

// Export schema
module.exports = Stats;