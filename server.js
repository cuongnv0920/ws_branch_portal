const express = require("express");

const app = express();
const port = 5000 || process.env.port;
const mongoose = require("mongoose");
const cors = require("cors");
const categoryRoute = require("./routes/category.route");
const roomRoute = require("./routes/room.route");
const linkRoute = require("./routes/link.route");
const levelRoute = require("./routes/level.route");
const userRoute = require("./routes/user.route");
const marginRoute = require("./routes/margin.route");
const exchangeRateRoute = require("./routes/exchageRate.route");
const newsRoute = require("./routes/news.route");
const commentRoute = require("./routes/comment.route");

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
app.use("/room", roomRoute);
app.use("/link", linkRoute);
app.use("/level", levelRoute);
app.use("/user", userRoute);
app.use("/margin", marginRoute);
app.use("/exchangeRate", exchangeRateRoute);
app.use("/news", newsRoute);
app.use("/comment", commentRoute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
