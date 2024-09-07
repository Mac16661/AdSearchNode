/**
 *
 */
const nacl = require("tweetnacl");
const jwt = require("jsonwebtoken");
const { Connection, PublicKey, Transaction } = require("@solana/web3.js");
require("dotenv").config();

const { AppUser, OrgUser } = require("../models/user");

JWT_SECRET_APP = process.env.JWT_SECRET_APP;
JWT_SECRET_ORG = process.env.JWT_SECRET_ORG; 


async function handleRegisterAppCreator(req, res) {
  /**
   * Application creator registration
   * returns:
   *      status code/success/err message
   */

  console.log("register application creator");

  // Destructuring data
  const { signature, wallet_address, name, app_category } = req.body;
  const message = new TextEncoder().encode("Get registered with ads-platform");

  // verify signature
  try {
    const result = nacl.sign.detached.verify(
      message,
      new Uint8Array(signature.data),
      new PublicKey(wallet_address).toBytes()
    );

    if (!result) {
      return res.status(411).json({
        message: "Incorrect signature",
      });
    }
  } catch (e) {
    console.log("err while verifying ->", e);
  }

  // Check if user already exists
  const existingUser = await AppUser.findOne({ wallet_address:wallet_address });

  if (existingUser) {
    // return jwt and api_key
    const token = jwt.sign(
      {
        userId: existingUser._id,
      },
      JWT_SECRET_APP
    );

    return res.json({ token: token, api_key: existingUser._id });
  } else {
    // Creating new user
    const newUser = await AppUser.create({
      name,
      app_category,
      wallet_address,
    });

    // create new user and then return jwt and api_key
    const token = jwt.sign(
      {
        userId: newUser._id,
      },
      JWT_SECRET_APP
    );

    return res.json({ token: token, api_key: newUser._id });
  }

  return res.send(500).json({ err: "err occurred" });
}

async function handleRegisterOrganization(req, res) {
  /**
   * Organization registration
   * returns:
   *      status code/success/err message
   */

  console.log("register organization");

  // ->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // Destructuring data
  const { signature, wallet_address, name, app_category } = req.body;
  const message = new TextEncoder().encode("Get registered with ads-platform");

  // verify signature
  try {
    const result = nacl.sign.detached.verify(
      message,
      new Uint8Array(signature.data),
      new PublicKey(wallet_address).toBytes()
    );

    if (!result) {
      return res.status(411).json({
        message: "Incorrect signature",
      });
    }
  } catch (e) {
    console.log("err while verifying ->", e);
  }

  // Check if user already exists
  const existingUser = await OrgUser.findOne({ wallet_address:wallet_address });

  if (existingUser) {
    // return jwt and api_key
    const token = jwt.sign(
      {
        userId: existingUser._id,
      },
      JWT_SECRET_ORG
    );

    return res.json({ token: token });
  } else {
    // Creating new user
    const newUser = await OrgUser.create({
      name,
      org_category,
      wallet_address,
    });

    // create new user and then return jwt and api_key
    const token = jwt.sign(
      {
        userId: newUser._id,
      },
      JWT_SECRET_ORG
    );

    return res.json({ token: token });
  }

  return res.send(500).json({ err: "err occurred" });
  // ->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
}

module.exports = {
  handleRegisterAppCreator,
  handleRegisterOrganization,
};
