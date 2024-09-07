/*

*/

const express = require("express");

const {handleRegisterAppCreator, handleRegisterOrganization} = require("../controllers/user");

const router = express.Router();

// Routes
router.post("/registerAppCreator", handleRegisterAppCreator);
router.post("/registerOrganization", handleRegisterOrganization);

// Export routes
module.exports = router;