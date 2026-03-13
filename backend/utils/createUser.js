const bcrypt = require("bcryptjs");
const pool = require("../db/db");

async function createUser() {
  try {
    const hash = await bcrypt.hash("pass123", 10);
    await pool.query(
      "INSERT INTO users (username, password_hash) VALUES ($1,$2)",
      ["admin@test.com", hash]
    );
    console.log("User created sucessfully: admin@test.com/pass123");
  } catch (err) {
    console.log("Error while creating user:", err.message);
  } finally {
    process.exit();
  }
}

createUser();