const express = require("express");

const {appAuthMiddleware} = require("../services/authMiddleware");
const {getAdStats} = require("../controllers/adStats");

const router = express.Router();

router.get("/getStats", appAuthMiddleware, getAdStats);

module.exports = router;