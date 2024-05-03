const mongoose = require("mongoose");
require("dotenv").config();
const BlogDB = process.env.DB;
mongoose.connect(BlogDB);
const db = mongoose.connection;

db.on(
  "error",
  console.error.bind(console, "Error in connecting MongoDB :: Database ")
);

db.once("open", () => {
  console.log(`Successfully connected to MongoDB :: Database `);
});

module.exports = db;
