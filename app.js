const express = require("express");
const { getTopics } = require("./controllers/topicsControllers");

const app = express();

app.get("/api/topics", getTopics);

module.exports = app;
