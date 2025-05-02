const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;
const path = require("path");
const db = require("./database.json");

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Route for root (optional if using index.html as default)
app.get("/", (req, res) => {
  return res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/user", (req, res) => {
  const { name } = req.query;
  if (name && name in db["Users"]) {
    return res.json(db["Users"][name]);
  } else {
    return res.json({ id: -1 });
  }
});

app.get("/documents", (req, res) => {
  const { name } = req.query;
  if (name && name in db["Documents"]) {
    return res.json(db["Documents"][name]);
  } else {
    return res.status(400).json({ error: "please provide a valid username" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
