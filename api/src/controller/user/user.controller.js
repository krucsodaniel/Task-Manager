const createError = require("http-errors");
const userService = require("./user.service");
const logger = require("../../config/logger");

exports.createUser = async (req, res, next) => {
  const email = req.body["email"];
  const password = req.body["password"];
  const nickName = req.body["nickName"];

  try {
    const user = await userService.createUser(email, password, nickName);
    res.status(201).send(user);
    logger.debug(
      `${new Date().toUTCString()}, METHOD: ${req.method}, path:${
        req.originalUrl
      }` + " New user created successfully"
    );
  } catch (error) {
    logger.error(error);
    return next(new createError.InternalServerError("User could not created"));
  }
};
