const express = require("express");
const login = require("./routes/login");
const topics = require("./routes/topics");
const subtopics = require("./routes/subtopics");

const app = express();

app.use("/login", login);
app.use("/topics", topics)
app.use("/subtopics", subtopics);

module.exports = app;