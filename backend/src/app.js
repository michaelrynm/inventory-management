const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());

const apiRoutes = require("./routes");
app.use(cors());
app.get("/hello", (req, res) => res.send("hello world"));
app.use("/api", apiRoutes);

module.exports = app;
