const dotenv = require("dotenv");

// Set up Global configuration access
dotenv.config();

module.exports = {
    dialect: "mysql",
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB,
    define: {
        timestamp: true,
        underscored: true
    }
};