const db = require("../models");
const responseTransformer = require("./responseTransformer");
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateUsername = async (req, res, next) => {
  const user = await User.findOne({
    where: {
      username: req.body.username,
    },
  });

  if (user) {
    return responseTransformer(
      res,
      null,
      "Failed! Username is already in use!",
      false
    );
  }

  next();
};

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        return responseTransformer(
          res,
          null,
          "Failed! Role does not exist = " + req.body.roles[i],
          false
        );
      }
    }
  }

  next();
};

const verifySignUp = { checkDuplicateUsername, checkRolesExisted };

module.exports = verifySignUp;
