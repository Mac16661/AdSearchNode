const express = require("express");

const { getRandomAd, createAdv2, getPublishedAds} = require("../controllers/ad");
const {appAuthMiddleware} = require("../services/authMiddleware");

const router = express.Router();

router.get("/", getRandomAd); 
router.post("/v2/create", appAuthMiddleware, createAdv2);
router.get("/v2/getPublishedAds", appAuthMiddleware, getPublishedAds);


module.exports = router;