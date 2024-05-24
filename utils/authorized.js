const User = require("../models/User");

const authorized = async (req, res, next) => {
  console.log(req.headers.authorization.replace("Bearer ", ""));
  if (req.headers.authorization) {
    const user = await User.findOne({
      token: req.headers.authorization.replace("Bearer ", ""),
    }).select("account");
    console.log(user);
    if (user === null) {
      return res.json({ message: "non autorisé" });
    } else {
      req.user = user;
      console.log("ici" + user._id);
      return next();
    }
  } else {
    return res.json({ message: "non autorisé" });
  }
};

module.exports = authorized;
