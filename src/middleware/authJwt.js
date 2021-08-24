const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../models");
const responseTransformer = require("./responseTransformer");
const User = db.user;
const { TokenExpiredError } = jwt;

const catchError = (err, res) => {
  if (err instanceof TokenExpiredError) {
    return responseTransformer(
      res,
      null,
      "Unauthorized! Access Token was expired!",
      false
    );
  }

  return responseTransformer(res, null, "Unauthorized!", false);
};

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return responseTransformer(res, null, "No token provided!", false);
  }

  jwt.verify(token, config.secret, (err, payload) => {
    if (err) {
      return catchError(err, res);
    }
    req.userId = payload.id;
    next();
  });
};

isAdmin = async (req, res, next) => {
  const user = await User.findByPk(req.userId);
  if (!user) {
    return responseTransformer(res, null, "No token provided!", false);
  }

  const roles = await user.getRoles();

  if (roles) {
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        next();
        return;
      }
    }
    return responseTransformer(res, null, "Require Admin Role!", false);
  }
};

isModerator = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "moderator") {
          next();
          return;
        }
      }

      return responseTransformer(res, null, "Require Moderator Role!", false);
    });
  });
};

isModeratorOrAdmin = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "moderator") {
          next();
          return;
        }

        if (roles[i].name === "admin") {
          next();
          return;
        }
      }

      return responseTransformer(
        res,
        null,
        "Require Moderator or Admin Role!",
        false
      );
    });
  });
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isModerator: isModerator,
  isModeratorOrAdmin: isModeratorOrAdmin,
};

module.exports = authJwt;
