const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/BlogDB");
const db = mongoose.connection;

db.on(
  "error",
  console.error.bind(console, "Error in connecting MongoDB :: Database ")
);

db.once("open", () => {
  console.log(`Successfully connected to MongoDB :: Database `);
});

module.exports = db;
