const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "india_geo_db",
  password: "Meghana@123",
  port: 5432,
});

module.exports = pool;