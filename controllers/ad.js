const {Connection, PublicKey, Transaction, LAMPORTS_PER_SOL, Keypair, SystemProgram, sendAndConfirmTransaction } = require("@solana/web3.js");
const bs58 = require('bs58');
// const {base58_to_binary} =  import("base58-js");
require("dotenv").config();


const Ad = require("../models/ad");
const { AppUser } = require("../models/user");

const PARENT_PRIVATE_KEY = process.env.ADMIN_PRIVATE_KEY;
const PARENT_PUBLIC_KEY = process.env.ADMIN_PUBLIC_KEY;


// Connect to solana dev net
const connection = new Connection("https://api.devnet.solana.com")


async function createAd(req, res) {
  console.log("ads created");

  // Destructuring all the data
  const { name, image, available_balance, tags, org_id, org_name, embedding } =
    req.body;

  console.log(req.body);

  // Basic checks
  if (org_id !== req.userID) {
    console.log("org_id does not matched");
    return res.status(403).json({
      message: "unauthorized",
    });
  }

  if (req.query.user_type !== "publisher_org") {
    console.log("user type does not matched");
    return res.status(403).json({
      message: "unauthorized",
    });
  }

  try {
    const publishAd = await Ad.create({
      name,
      image,
      available_balance,
      tags,
      org_id,
      org_name,
      embedding,
    });

    console.log(publishAd);
    return res.json(publishAd);
  } catch (e) {
    console.log("Err occurred while creating ad", e.errmsg);
  }

  return res.json({ err: "error occurred" });
}


async function rechargeAd(req, res) {
  /**
   * Takes ad_id and organization_id and then fund ad campaigns
   */

  const { org_id, ad_id } = req.body;

  console.log(req.body);

  // Basic checks
  if (org_id !== req.userID) {
    console.log("org_id does not matched");
    return res.status(403).json({
      message: "unauthorized",
    });
  }

  if (req.query.user_type !== "publisher_org") {
    console.log("user type does not matched");
    return res.status(403).json({
      message: "unauthorized",
    });
  }

  // Checking existence and Funding ad
  try {
    const adExists = await Ad.findOne({
      org_id,
      _id: ad_id,
    });

    if (adExists) {
      // TODO: Connect to solana and take payment

      // TODO: increment balance by amount specified in db

      // TODO: Might want to put ad in advance vector store(may be) after payment and setup mongo db trigger/on ad search to remove ad from vector db if bal is low

      return res.json({ msg: "funded successfully" });
    }
  } catch (e) {
    console.log("Ad does not exist ", e.errmsg);
    return res.json({ err: "Ad not found" });
  }

  return res.sendStatus(500);
}


async function getRandomAd(req, res) {
  console.log("getting a random ad");

  const {api_key} = req.query;
  // console.log(req.query.api_key);

  try{
    // Check if api_key exists and fetch wallet address
    const app_creator = await AppUser.findOne({_id: api_key});
    
    const {id, wallet_address} = app_creator;

    if (id != api_key) {
      console.log("invalid api key");
      return res.status(403).json({
        message: "unauthorized",
      });
    }

    // TODO: Make payment to wallet_address from out account
    // console.log("Payee address -> ",wallet_address);

    // console.log("Connected to network -> ",await connection.getVersion());

    const payer = new PublicKey(PARENT_PUBLIC_KEY);
    // const currentBalance = await connection.getBalance(payer);

    // console.log(`Payer address -> ${payer.toBase58()} | balance -> ${currentBalance/LAMPORTS_PER_SOL} SOL`);
 
    const secretkey = bs58.default.decode(PARENT_PRIVATE_KEY);

    // Genrating public key with private one
    const payerKeyPair = Keypair.fromSecretKey(secretkey);
    
    // console.log(payerKeyPair);

    const transcation = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: payer,
        toPubkey: new PublicKey(wallet_address),
        lamports: 100000
      })
    );

  
    const signature = await sendAndConfirmTransaction(
      connection,
      transcation,
      [payerKeyPair],
    );


    console.log(signature)

  }catch(e){
    console.log("Err occurred during payout -> ", e);
    return res.status(500).json({
      message: "failed to make payment",
    });
  }

  try {
    let adExists = await Ad.find({_id:"66dc8ba19469461a934c37a3", available_balance: { $gt: 0.0001 }});


    const curr_bal = parseInt(adExists[0]?.available_balance) - 0.0001;
    const id = adExists[0]?._id;

    adExists = await Ad.findOneAndUpdate(
      { _id: id }, // Query to find the document by _id
      { $set: { available_balance: curr_bal } }, // Update operation to set available_balance
      { new: true } // Option to return the updated document
    );


    // Only sending the image data as of now
    return res.json({ image: adExists.image });
  } catch (e) {
    console.log("Err while finding -> ", e);
  }

  return res.sendStatus(500);
}

module.exports = {
  createAd,
  getRandomAd,
  rechargeAd,
};
