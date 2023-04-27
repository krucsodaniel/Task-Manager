const User = require("../../models/user.model");

exports.createUser = (email, password, nickName) => {
  const user = new User({ email, password, nickName, lists: [] });
  return user.save();
};
