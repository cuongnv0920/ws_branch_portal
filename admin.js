const express = require("express");

const app = express();
const port = 5000;

const root = require("path").join(__dirname, "src/admin");

app.use(express.static(root));

app.get("*", (req, res) => {
  res.sendFile("index.html", { root });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
