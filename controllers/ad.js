const {
  Connection,
  PublicKey,
  Transaction,
  LAMPORTS_PER_SOL,
  Keypair,
  SystemProgram,
  sendAndConfirmTransaction,
} = require("@solana/web3.js");
const bs58 = require("bs58");
const axios = require("axios");
const { ObjectId } = require("bson");
require("dotenv").config();

const Ad = require("../models/ad");
const { AppUser } = require("../models/user");

const PARENT_PRIVATE_KEY = process.env.ADMIN_PRIVATE_KEY;
const PARENT_PUBLIC_KEY = process.env.ADMIN_PUBLIC_KEY;

// Connect to solana dev net
const connection = new Connection("https://api.devnet.solana.com");

async function createAd(req, res) {
  console.log("ads created");

  // Destructuring all the data
  const { name, image, available_balance, tags, org_id, org_name, signature } =
    req.body;

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

  // Verify transaction and then proceed
  // console.log(req.body);
  

  // // TODO: Need to work from here
  // try {
  //   console.log("Signature -> ", signature);
  //   const transaction = await connection.getTransaction(signature, {
  //     // commitment: 'confirmed',
  //     maxSupportedTransactionVersion: 1,
  //   });

  //   console.log("Transaction -> ", transaction);

  //   if (
  //     (transaction?.meta?.postBalances[1] ?? 0) -
  //       (transaction?.meta?.preBalances[1] ?? 0) !==
  //     100000000
  //   ) {
  //     return res.status(411).json({
  //       message: "Transaction signature/amount incorrect",
  //     });
  //   }

  //   if (
  //     transaction?.transaction.message.getAccountKeys().get(1)?.toString() !==
  //     PARENT_PUBLIC_KEY
  //   ) {
  //     return res.status(411).json({
  //       message: "Transaction sent to wrong address",
  //     });
  //   }
  // } catch (e) {
  //   console.log(e);
  // }

  //TODO: Additional check if Txn is not form user address
  // if (
  //   transaction?.transaction.message.getAccountKeys().get(0)?.toString() !==
  //   user?.address
  // ) {
  //   return res.status(411).json({
  //     message: "Transaction sent to wrong address",
  //   });
  // }

  // Create embedding
  let embedding;
  try {
    const data = {
      text: name,
    };

    const response = await axios.post(
      "http://127.0.0.1:5000/text-to-embedding",
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // console.log(response.data);
    // return res.json(response.data)
    embedding = response.data[0];
    // console.log(embedding)
  } catch (e) {
    console.log("Err while fetching embeddings", e);
    return res.json({ err: "error occurred" });
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

    // console.log(publishAd);
    return res.json(publishAd);
  } catch (e) {
    console.log("Err occurred while creating ad", e);
  }

  return res.json({ err: "error occurred" });
}

// TODO: Need to verify the transaction and then only proceed
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
    console.log("Ad does not exist ", e);
    return res.json({ err: "Ad not found" });
  }

  return res.sendStatus(500);
}

async function getRandomAd(req, res) {
  console.log(new Date().toLocaleTimeString(), "getting a random ad");

  const { api_key } = req.query;
  var fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
  // console.log(fullUrl)
  // console.log(req.query);

  api_key_object = new ObjectId("66d9601d1d03b7fbc16746c1");
  // console.log(typeof(api_key_object))
  try {
    // Check if api_key exists and fetch wallet address
    const app_creator = await AppUser.findOne({ id: api_key_object });

    // console.log(app_creator)
    const { id, wallet_address } = app_creator;
    // console.log(_id)
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
        lamports: 100000,
      })
    );

    const signature = await sendAndConfirmTransaction(connection, transcation, [
      payerKeyPair,
    ]);

    console.log(signature);
  } catch (e) {
    console.log("Err occurred during payout -> ", e);
    return res.status(500).json({
      message: "failed to make payment",
    });
  }

  try {
    // let adExists = await Ad.find({_id:"66e2c260eef0f0c52abc9479", available_balance: { $gt: 0.1 }});

    let adExists = await Ad.aggregate([
      { $match: { available_balance: { $gt: 0.1 } } },
      { $sample: { size: 1 } },
    ]);

    console.log(adExists);

    const curr_bal = parseInt(adExists[0]?.available_balance) - 0.0001;
    const curr_impression = parseInt(adExists[0]?.impression) + 1;
    const id = adExists[0]?._id;

    // console.log(curr_bal);
    // console.log(curr_impression, "->", typeof(curr_impression))
    if (curr_bal < 0) {
      return res.sendStatus(500);
    }

    adExists = await Ad.findOneAndUpdate(
      { id: id }, // Query to find the document by _id
      { $set: { available_balance: curr_bal, impression: curr_impression } }, // Update operation to set available_balance
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
