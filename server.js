const HTTP = require("http");
const app = require("./src/middleware");

const db = require("./src/models");
const Role = db.role;

HTTP.createServer(app).listen(3000, async () => {
  console.log("Server is runing!");

  await db.sequelize
    .sync({ force: false, logging: false })
    .then(() => {
      console.log("Database connected!");
      // initial();
    })
    .catch((err) => {
      console.log("Database not connected! >>>", err);
    });
});

function initial() {
  Role.create({
    id: 1,
    name: "user",
  });

  Role.create({
    id: 2,
    name: "moderator",
  });

  Role.create({
    id: 3,
    name: "admin",
  });
}
