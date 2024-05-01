const express = require("express");
const PORT = 8080;
const app = express();
const cors = require("cors");
const db = require("./config/mongoose");

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

app.use("/", require("./routes"));

app.listen(PORT, (error) => {
  if (error) {
    console.log(`Error in connecting server at PORT :: ${PORT}`);
    return;
  }
  console.log(`Successfully connected to server at PORT :: ${PORT}`);
});
