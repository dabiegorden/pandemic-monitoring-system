// db.js
const mysql = require("mysql2/promise");

// Create a MySQL connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "pandemic_monitoring",
  port: process.env.DB_PORT || 3306,
});

// Test the connection (optional)
(async () => {
  try {
    const connection = await db.getConnection();
    console.log("Connected to the MySQL database successfully!");
    connection.release(); // Release the connection back to the pool
  } catch (error) {
    console.error("Error connecting to the MySQL database:", error);
  }
})();

module.exports = db;
