const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;
const SECRET = process.env.SECRET || "top-secret";
const path = require("path");
const db = require("./database.json");

const decodeString = `^Bearer (\\w+)-${SECRET}$`;
const decodeRegex = new RegExp(decodeString);

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
    const token = createToken(name);
    return res.json({ ...db["Users"][name], token });
  } else {
    return res.json({ id: -1 });
  }
});

app.get("/documents", (req, res) => {
  const { name } = req.query;
  if (name && name in db["Documents"]) {
    // get token here from headers
    const token = req.headers["authorization"];
    if (!token)
      return res.status(401).json({
        error: "missing token",
      });
    const id = decodeToken(token);
    if (id === -1) {
      return res.status(401).send({ error: "invalid token" });
    }

    if (name && name in db["Documents"]) {
      const { OwnerId } = db["Documents"][name];
      if (id == OwnerId) {
        return res.json(db["Documents"][name]);
      } else {
        return res.status(403).json({ error: "access denied" });
      }
    } else {
      return res.status(400).json({ error: "invalid username" });
    }
  }
});

function createToken(name) {
  return `${name}-${SECRET}`;
}

function decodeToken(token) {
  const result = token.match(decodeRegex);
  if (!result || !(result[1] in db["Users"])) return -1;
  return db["Users"][result[1]].id;
}

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
