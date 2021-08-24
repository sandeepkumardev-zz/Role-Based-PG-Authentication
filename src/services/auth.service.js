const db = require("../models");
const config = require("../config/auth.config");
const { user: User, role: Role, refreshToken: RefreshToken } = db;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

let services = {};

services.createToken = async ({ requestToken }) => {
  if (requestToken == null) {
    return {
      data: null,
      message: "Refresh Token is required!",
      success: false,
    };
  }

  let dbToken = await RefreshToken.findOne({ where: { token: requestToken } });

  if (!dbToken) {
    return {
      data: null,
      message: "Refresh token is not in database!",
      success: false,
    };
  }

  if (RefreshToken.verifyExpiration(dbToken)) {
    RefreshToken.destroy({ where: { id: dbToken.id } });

    return {
      data: null,
      message: "Refresh token was expired. Please make a new signin request",
      success: false,
    };
  }

  const user = await dbToken.getUser();
  let newAccessToken = jwt.sign({ id: user.id }, config.secret, {
    expiresIn: config.jwtExpiration,
  });

  return {
    data: {
      accessToken: newAccessToken,
      refreshToken: dbToken.token,
    },
    message: "Successfully created!",
    success: true,
  };
};

services.findOne = async ({ username, password }) => {
  const user = await User.findOne({ where: { username: username } });

  if (!user) {
    return { data: null, message: "User Not found.", success: false };
  }

  var passwordIsValid = bcrypt.compareSync(password, user.password);

  if (!passwordIsValid) {
    return { data: null, message: "Invalid Password!", success: false };
  }

  var token = jwt.sign({ id: user.id }, config.secret, {
    expiresIn: config.jwtExpiration,
  });

  let refreshToken = await RefreshToken.createToken(user);

  var authorities = [];

  const roles = await user.getRoles();

  if (roles) {
    for (let i = 0; i < roles.length; i++) {
      authorities.push("ROLE_" + roles[i].name.toUpperCase());
    }

    return {
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token,
        refreshToken: refreshToken,
      },
      message: "Successfully Signed In!",
      success: true,
    };
  }
};

services.create = async ({ username, password, roles }) => {
  const user = await User.create({
    username: username,
    password: bcrypt.hashSync(password, 12),
  });

  if (roles) {
    const isRole = await Role.findAll({
      where: {
        name: roles,
      },
    });

    const isSet = await user.setRoles(isRole);
    if (isSet) {
      return {
        data: null,
        message: "User was registered successfully!",
        success: true,
      };
    }
  } else {
    // user role = 1
    const isSet = await user.setRoles([1]);
    if (isSet) {
      return {
        data: null,
        message: "User was registered successfully!",
        success: true,
      };
    }
  }
};

module.exports = services;
