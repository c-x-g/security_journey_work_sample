const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;
const SECRET = process.env.SECRET || "top-secret";
const path = require("path");
const db = require("./database.json");

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Route for root (optional if using index.html as default)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/user", (req, res) => {
  const { name } = req.query;
  if (name && name in db["Users"]) {
    res.json(db["Users"][name]);
  } else {
    res.json({ id: -1 });
  }
});

app.get("/documents", (req, res) => {
  const { name } = req.query;
  // get token here from headers
  console.log(req.headers);
  const bearerToken = req.headers["authorization"];
  console.log(bearerToken);
  if (name && name in db) {
    res.json(db[name]);
  if (name && name in db["Documents"]) {
    res.json(db["Documents"][name]);
  // get token here from headers
  const bearerToken = req.headers["authorization"];
  if (name && name in db["Documents"]) {
    res.json(db["Documents"][name]);
  } else {
    res.status(400).json({ error: "please provide a valid username" });
  }
});

app.get("/token", (req, res) => {
  const { name } = req.query;
  res.json({ token: `${name}-${SECRET}` });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
