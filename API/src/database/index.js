const Sequelize = require("sequelize");
const configDB = require("../config/database");

const User = require("../models/User");
const Topic = require("../models/Topic");
const Subtopic = require("../models/Subtopic");

const connection = new Sequelize(configDB);

User.init(connection);
Topic.init(connection);
Subtopic.init(connection);

module.exports = connection;