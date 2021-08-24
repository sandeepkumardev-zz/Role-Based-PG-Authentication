const controller = require("../controllers/user.controller");
const { isModerator, isAdmin, verifyToken } = require("../middleware/authJwt");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/all", controller.allAccess);

  app.get("/user", controller.userBoard);

  app.get("/mod", [verifyToken, isModerator], controller.moderatorBoard);

  app.get("/admin", [verifyToken, isAdmin], controller.adminBoard);
};
