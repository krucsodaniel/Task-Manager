const express = require("express");
const router = express.Router();

const userController = require("./user.controller");

router.post("/", (req, res, next) => {
  return userController.createUser(req, res, next);
});

module.exports = router;
