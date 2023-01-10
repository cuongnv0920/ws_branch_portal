const express = require("express");

const app = express();
const port = 3000;

const root = require("path").join(__dirname, "src/user/build");

app.use(express.static(root));

app.get("*", (req, res) => {
  res.sendFile("index.html", { root });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
