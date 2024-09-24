const express = require("express");

const {createAd, getRandomAd, rechargeAd, createAdv2, getPublishedAds} = require("../controllers/ad");
const {appAuthMiddleware, orgAuthMiddleware} = require("../services/authMiddleware");

const router = express.Router();

router.get("/", getRandomAd); // Should add authMiddleware 
router.post("/create",  orgAuthMiddleware, createAd);
router.post("/recharge", orgAuthMiddleware, rechargeAd);
router.post("/v2/create",  createAdv2);
router.get("/v2/getPublishedAds", getPublishedAds);


module.exports = router;