const Ad = require("../models/ad");

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

  try {
    const adExists = await Ad.find({});

    return res.json({ adExists });
  } catch (e) {
    console.log("Err while finding -> ", e.errmsg);
  }

  return res.sendStatus(400);
}

module.exports = {
  createAd,
  getRandomAd,
  rechargeAd,
};
