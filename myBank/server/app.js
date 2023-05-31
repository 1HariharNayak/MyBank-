const express = require("express");
const cors = require("cors");
const app = express();
const bankRoutes  = require("../Routes/bank.Routes");

app.use(express.json());
app.use(cors());
app.use(cors({ orign: true }));

app.use("/mybank", bankRoutes);

module.exports = app;
