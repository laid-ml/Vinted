const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/User");
const router = express.Router();
const hash = require("../hash/hash");
const uid2 = require("uid2");
const dehash = require("../hash/dehash");

router.post("/user/signup", async (req, res) => {
  try {
    const findMail = await User.findOne({ email: req.body.email });
    console.log(findMail);
    if (findMail !== null) {
      return res.status(402).json({ message: "mail déja existant" });
    }
    const username = req.body.username;
    if (username.length < 3) {
      return res.status(400).json({ message: "taper un username " });
    }
    const salt1 = uid2(16);
    const token1 = uid2(20);
    const hashUser = hash(req.body.password, salt1);
    // renseigner nouvelle utilisateur
    const newuser = new User({
      account: {
        avatar: {},
        username: req.body.username,
      },
      email: req.body.email,
      newsletter: req.body.newsletter,
      token: token1,
      hash: hashUser,
      salt: salt1,
    });
    // sauvegarde le nouvelle utilisateur
    await newuser.save();
    // renvoie l'objet du nouvel utilisateur
    const idUser = await User.find({ email: req.body.email });
    console.log(idUser);
    res.status(200).json({
      message: {
        _id: idUser.id,
        token: token1,
        account: {
          username: req.body.username,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/user/login", async (req, res) => {
  //   verifie si le mail existe
  const findMail = await User.findOne({ email: req.body.email });
  if (findMail === null) {
    res.status(400).json({ message: "password ou email incorect" });
  }
  console.log(findMail);
  //   teste le mot de passe
  const testPassword = dehash(req.body.password, findMail.salt, findMail.hash);
  if (testPassword) {
    return res.status(200).json({
      message: {
        _id: findMail.id,
        token: findMail.token,
        account: {
          username: findMail.account.username,
        },
      },
    });
  } else {
    return res.status(400).json({ message: "password ou email incorect" });
  }
});

module.exports = router;
