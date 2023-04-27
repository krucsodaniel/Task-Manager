const jwt = require("jsonwebtoken");

const User = require("../models/user.model");

exports.login = (req, res, next) => {
  if (!req.body["email"] || !req.body["password"]) {
    return res.status(400).send("Missing email or password");
  }

  User.findOne({ email: req.body["email"] })
    .then((user) => {
      if (!user || user.password !== req.body["password"]) {
        return res.status(404).send("Invalid email or password");
      }

      const accessToken = jwt.sign(
        {
          email: user.email,
          password: user.password,
          nickName: user.nickName,
        },
        process.env.ACCESS_TOKEN_SECRET_KEY,
        {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
      );
      let ownerId = user._id.toString();
      let userNickName = user.nickName;

      res.json({ accessToken, ownerId, userNickName });
    })
    .catch((err) => {
      res.status(500).send("Internal server error");
    });
};
