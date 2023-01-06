const express = require("express");
const dotenv = require("dotenv");

const app = express();
const routes = require("./routes");

// Set up Global configuration access
dotenv.config();

require("./database");

const cors = require("cors");

app.use(cors({
    origin: '*'
}));
app.use(express.json());
app.use(routes);

let PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});