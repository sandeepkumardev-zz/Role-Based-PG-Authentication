const express = require("express");
const cors = require("cors");

const app = express();

let corsOrigin = {
  origin: "http://localhost:3000",
};

app.use(cors(corsOrigin));
app.use(express.json());

app.get("/", (req, res) => {
  res.json("Welcome JI");
});

require("../routes/auth.routes")(app);
require("../routes/user.routes")(app);

app.use(require("./responseTransformer"));

module.exports = app;
