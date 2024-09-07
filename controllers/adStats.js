const {Stats} = require("../models/adStats");

async function getAdStats(req, res) {
    console.log("getting ads stats for api_key -> ",req.userID);

    if(!req.query.user_type) return  res.status(401).json({ message: 'User type missing' });

    const app_id = req.userID;

    // TODO: Need to fix form here
    if(req.query.user_type === "app_creator"){
        try{
            const appAdsStats = await Stats.findOne({ app_id:app_id });

            console.log(appAdsStats.data);
        }catch(e){
            console.log("Err while fetching ad statistics", e.errmsg);
        }
        
    }else{
        const orgAdsStats = await Stats.find({ org_id:req.userID });
    }
   

    return res.json({message: "array of ads"});
}

module.exports = {
    getAdStats
};