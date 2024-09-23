/*

*/

const express = require("express");

const {
  handleRegisterAppCreator,
  handleRegisterOrganization,
  handleRegister,
  getUserProfile,
  saveUserProfile
} = require("../controllers/user");

const router = express.Router();

// Routes
router.post("/registerAppCreator", handleRegisterAppCreator);
router.post("/registerOrganization", handleRegisterOrganization);
router.post("/v2/register", handleRegister);
router.get("/v2/getProfile", getUserProfile);
router.post("/v2/saveProfile", saveUserProfile);

// Export routes
module.exports = router;
