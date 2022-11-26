const express = require("express");

const app = express();
const port = 5000 || process.env.port;
const mongoose = require("mongoose");
const cors = require("cors");
const categoryRoute = require("./routes/category.route");

// Connect database mongodb
const mongoURL =
  "mongodb://localhost:27017/ws_branch_portal" || process.env.mongoURL;
mongoose.connect(mongoURL).then(
  () => console.log("Database connection established"),
  (err) => console.log("Database connection unestablied, error occurred")
);

var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

// use routes
app.use("/category", categoryRoute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
