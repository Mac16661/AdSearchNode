/**
 * User sign-in/sign-up and basic profile controllers 
 */
const nacl = require("tweetnacl");
const jwt = require("jsonwebtoken");
const { PublicKey } = require("@solana/web3.js");
require("dotenv").config();

const { User } = require("../models/user");

JWT_SECRET_APP = process.env.JWT_SECRET_APP;

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
    console.log("error occurred ", e);
    return res.status(500).json({
      message: "Internal server error",
    });
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
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function saveUserProfile(req, res) {
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
    
    // console.log(result);
    res.json(result);
  } catch (error) {
    console.error("Error occurred:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}


module.exports = {
  handleRegister,
  getUserProfile,
  saveUserProfile
};
