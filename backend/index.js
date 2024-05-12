const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const UserModel = require("./models/Users");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(
  "mongodb+srv://rahmannnnn:ghani123@ekeris.uv559ut.mongodb.net/ekeris"
);

app.get("/user", (req, res) => {});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  UserModel.findOne({
    username: username,
  }).then((user) => {
    if (user) {
      if (user.password === password) {
        res.json({
          username,
        });
      } else {
        res.status(403).json({
          error:
            "Maaf, kata sandi Anda salah. Silakan periksa kembali kata sandi Anda.",
        });
      }
    } else {
      res.status(403).json({ error: "Username tidak ditemukan." });
    }
  });
});

app.listen(3001, () => {
  console.log("server is running");
});
