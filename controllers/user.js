/**
 *
 */
const nacl = require("tweetnacl");
const jwt = require("jsonwebtoken");
const { Connection, PublicKey, Transaction } = require("@solana/web3.js");
require("dotenv").config();

const { AppUser, OrgUser, User } = require("../models/user");
const { response } = require("express");

JWT_SECRET_APP = process.env.JWT_SECRET_APP;
JWT_SECRET_ORG = process.env.JWT_SECRET_ORG; 

async function handleRegister(req, res) {
  console.log("register user");

  // Destructuring data
  const { signature, wallet_address } = req.body;
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
  const existingUser = await User.findOne({ wallet_address:wallet_address });

  if (existingUser) {
    // return jwt and api_key
    const token = jwt.sign(
      {
        userId: existingUser._id,
      },
      JWT_SECRET_APP
    );

    return res.json({ token: token, api_key: existingUser._id, name: existingUser.name });
  } else {
    // Creating new user
    const newUser = await User.create({
      wallet_address,
    });

    // create new user and then return jwt and api_key
    const token = jwt.sign(
      {
        userId: newUser._id,
      },
      JWT_SECRET_APP
    );

    return res.json({ token: token, api_key: newUser._id, name: "Unknown" });
  }

  return res.send(500).json({ err: "err occurred" });
}

async function getUserProfile(req, res) {
  console.log("Fetching user profile");
  const userId = req.query.id;
  try{
    const existingUser = await User.findOne({ _id:userId });
    console.log(existingUser);
    res.json(existingUser)

  }catch(e) {
    console.log("Err occurred while getProfile -> " ,e);
  }
}

async function saveUserProfile(req, res) {

  // console.log(req.body);
  const {userId, formData} = req.body;

  const {Name,category, country, email, } = formData;

  try {
    const result = await User.findByIdAndUpdate(
      userId ,
      {
        $set: {
          name: Name,
          category: category,
          country: country,
          email: email,
        },
      },
      { new: true }
    );

    
    console.log(result);
    res.json(result);
  } catch (error) {
    console.error(error);
  }


}

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

    return res.json({ token: token, api_key: existingUser._id, name: existingUser.name });
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

    return res.json({ token: token, api_key: newUser._id, name: newUser.name });
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
  const { signature, wallet_address, name, org_category } = req.body;
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

    return res.json({ token: token, api_key: existingUser._id, name: existingUser.name });
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

    return res.json({ token: token, api_key: newUser._id, name: newUser.name });
  }

  return res.send(500).json({ err: "err occurred" });
  // ->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
}

module.exports = {
  handleRegisterAppCreator,
  handleRegisterOrganization,
  handleRegister,
  getUserProfile,
  saveUserProfile
};
