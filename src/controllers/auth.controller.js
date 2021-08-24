const services = require("../services/auth.service");
const responseTransformer = require("../middleware/responseTransformer");

exports.signup = async (req, res) => {
  const { username, password, roles } = req.body;
  try {
    const result = await services.create({ username, password, roles });
    responseTransformer(res, result.data, result.message, result.success);
  } catch (error) {
    responseTransformer(res, null, "Failed to Sign Up!", false);
  }
};

exports.signin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await services.findOne({ username, password });
    responseTransformer(res, result.data, result.message, result.success);
  } catch (error) {
    responseTransformer(res, null, "Failed to Sign In!", false);
  }
};

exports.refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;
  try {
    const result = await services.createToken({ requestToken });
    responseTransformer(res, result.data, result.message, result.success);
  } catch (error) {
    responseTransformer(res, null, "Failed to create refresh token!", false);
  }
};

exports.changePswd = async (req, res) => {
  const { newPassword } = req.body;
  const userId = req.userId;
  try {
    const result = await services.changePswd({ userId, newPassword });
    responseTransformer(res, result.data, result.message, result.success);
  } catch (error) {
    responseTransformer(res, null, "Failed to change password!", false);
  }
};

exports.forgetPswd = async (req, res) => {
  const { username, newPassword } = req.body;
  try {
    const result = await services.forgetPswd({ username, newPassword });
    responseTransformer(res, result.data, result.message, result.success);
  } catch (error) {
    responseTransformer(res, null, "Failed to create new password!", false);
  }
};
