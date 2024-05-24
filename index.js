const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());
mongoose.connect(process.env.MONGODB_URI);

// import de mes routes
const userRoutes = require("./routes/user");
const offerRoutes = require("./routes/offer");

// appel de mes routes
app.use(userRoutes);
app.use(offerRoutes);
app.all("*", (req, res) => {
  res.status(400).json({ message: "vous étes perdu" });
});

app.listen(process.env.PORT, () => {
  console.log("server started");
});
