const express = require("express");

const {createAd, getRandomAd, rechargeAd} = require("../controllers/ad");
const {appAuthMiddleware, orgAuthMiddleware} = require("../services/authMiddleware");

const router = express.Router();

router.get("/", getRandomAd); // Should add authMiddleware 
router.post("/create",  orgAuthMiddleware, createAd);
router.post("/recharge", orgAuthMiddleware, rechargeAd);


module.exports = router;