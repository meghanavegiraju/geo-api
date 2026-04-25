const express = require("express");
const pool = require("./db");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
app.use(cors());
app.use(express.json());


// 🔥 1. DEFINE MIDDLEWARE FIRST
const validateApiKey = async (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res.status(403).json({ error: "API key required" });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM api_keys WHERE api_key = $1",
      [apiKey]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ error: "Invalid API key" });
    }

    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 🔥 2. TEST API
app.get("/test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🔥 3. GENERATE API KEY (NO PROTECTION)
app.get("/generate-key", async (req, res) => {
  const apiKey = crypto.randomBytes(16).toString("hex");

  try {
    await pool.query(
      "INSERT INTO api_keys (api_key) VALUES ($1)",
      [apiKey]
    );

    res.json({ apiKey });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🔥 4. STATES
app.get("/states", validateApiKey, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT DISTINCT state FROM locations ORDER BY state"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🔥 5. DISTRICTS
app.get("/districts", validateApiKey, async (req, res) => {
  const { state } = req.query;

  if (!state) {
    return res.status(400).json({ error: "State is required" });
  }

  try {
    const result = await pool.query(
      "SELECT DISTINCT district FROM locations WHERE state = $1 ORDER BY district",
      [state]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🔥 6. SUBDISTRICTS
app.get("/subdistricts", validateApiKey, async (req, res) => {
  const { district } = req.query;

  if (!district) {
    return res.status(400).json({ error: "District is required" });
  }

  try {
    const result = await pool.query(
      "SELECT DISTINCT subdistrict FROM locations WHERE district = $1 ORDER BY subdistrict",
      [district]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🔥 7. VILLAGES
app.get("/villages", validateApiKey, async (req, res) => {
  const { subdistrict } = req.query;

  if (!subdistrict) {
    return res.status(400).json({ error: "Subdistrict is required" });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM locations WHERE subdistrict = $1 LIMIT 20",
      [subdistrict]
    );

    const formatted = result.rows.map(row => ({
      address: `${row.village}, ${row.subdistrict}, ${row.district}, ${row.state}, India`
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🔥 8. SEARCH
app.get("/search", validateApiKey, async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: "Search query is required" });
  }

  try {
    const result = await pool.query(
      `SELECT * FROM locations
       WHERE village ILIKE $1
       LIMIT 10`,
      [`${q}%`]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🔥 9. START SERVER
app.listen(5000, () => {
  console.log("Server running on port 5000");
});