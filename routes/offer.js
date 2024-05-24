const express = require("express");
const router = express.Router();
const Offer = require("../models/Offer1");
const User = require("../models/User");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2; // On n'oublie pas le `.v2` à la fin
const authorized = require("../utils/authorized");

// Données à remplacer avec les vôtres :
cloudinary.config({
  cloud_name: "dhze1xjvj",
  api_key: "849312477857733",
  api_secret: "BlcE5ZC9cX7WcmU3zSnrsCMjsnI",
});

const convertToBase64 = (file) => {
  return `data:${file.mimetype};base64,${file.data.toString("base64")}`;
};

router.post("/offer/publish", fileUpload(), authorized, async (req, res) => {
  try {
    const newoffer = new Offer({
      product_details: [
        {
          MARQUE: req.body.MARQUE,
        },
        {
          TAILLE: req.body.TAILLE,
        },
        {
          ETAT: req.body.ETAT,
        },
        {
          COULEUR: req.body.COULEUR,
        },
        {
          EMPLACEMENT: req.body.EMPLACEMENT,
        },
      ],
      product_name: req.body.product_name,

      product_description: req.body.product_description,
      product_price: req.body.product_price,

      owner: req.user,
    });
    const folder = "/vinted/" + newoffer.id;
    const pictureupload = await cloudinary.uploader.upload(
      convertToBase64(req.files.picture),
      {
        folder: folder,
      }
    );
    newoffer.product_image = pictureupload.secure_url;
    await newoffer.save();

    res.json({
      message: newoffer,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

router.patch("/offer/publish", authorized, fileUpload, async (req, res) => {
  const offerId = await Offer.findOne(req.body.id);
});

router.get("/offer", async (req, res) => {
  let limit = 5;
  let page = 1;

  req.query.title = "" || req.query.title;

  page = req.query.page || page;

  req.query.price_min = req.query.price_min || "0";

  req.query.price_max = req.query.price_max || "10000";
  if (req.query.sort) {
    req.query.sort = { product_price: req.query.sort.replace("price-", "") };
  }

  const resultatPage = await Offer.find({
    product_name: new RegExp(req.query.title, "i"),

    product_price: { $gte: req.query.price_min, $lte: req.query.price_max },
  })
    .limit(limit)
    .skip(limit * (page - 1))
    .sort(req.query.sort || {});

  res.json(resultatPage);
});

router.get("/offers:id", async (req, res) => {
  const offersid = await Offer.findOne({ _id: req.params.id });
  res.json({ message: offersid });
});

module.exports = router;
