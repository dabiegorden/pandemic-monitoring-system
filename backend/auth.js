const express = require("express");
const bcrypt = require("bcrypt");
const db = require("./db");
const dotenv = require("dotenv");
const { sendWelcomeEmail } = require("./emailService");
const { sendWelcomeSMS } = require("./sms-service");

const router = express.Router();
dotenv.config();

// Sign Up Route
router.post("/signup", async (req, res) => {
  const { name, email, password, phone_number } = req.body;

  try {
    // Check if user already exists
    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existingUser.length > 0) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the database with phone number
    await db.query(
      "INSERT INTO users (name, email, password, phone_number) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, phone_number]
    );

    // Send welcome communications in parallel
    const emailPromise = sendWelcomeEmail(email, name);

    // Only send SMS if phone number is provided
    let smsPromise = Promise.resolve();
    if (phone_number) {
      smsPromise = sendWelcomeSMS(phone_number, name);
    }

    // Wait for both email and SMS to be sent
    Promise.all([emailPromise, smsPromise])
      .then(() => {
        res.status(201).json({
          message: "User created successfully and welcome messages sent",
        });
      })
      .catch((error) => {
        console.error("Error sending welcome messages:", error);
        res.status(201).json({
          message:
            "User created successfully, but some welcome messages could not be sent",
        });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Sign In Route
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const [user] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (user.length === 0) {
      return res.status(404).json({ error: "Invalid email or password" });
    }

    // Compare the password
    const validPassword = await bcrypt.compare(password, user[0].password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Store user info in session
    req.session.user = {
      id: user[0].id,
      name: user[0].name,
      email: user[0].email,
      phone_number: user[0].phone_number,
      isAuthenticated: true,
    };

    res.json({ message: "Login successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Logout Route
router.post("/logout", (req, res) => {
  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to logout" });
    }
    res.clearCookie("connect.sid"); // Clear the session cookie
    res.json({ message: "User logged out successfully" });
  });
});

// Get current user route
router.get("/me", (req, res) => {
  if (req.session.user && req.session.user.isAuthenticated) {
    // Return user info without sensitive data
    return res.json({
      id: req.session.user.id,
      name: req.session.user.name,
      email: req.session.user.email,
      phone_number: req.session.user.phone_number,
    });
  }
  res.status(401).json({ error: "Not authenticated" });
});

// Update user profile route (to add or update phone number)
router.put("/profile", async (req, res) => {
  if (!req.session.user || !req.session.user.isAuthenticated) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const { name, phone_number } = req.body;
  const userId = req.session.user.id;

  try {
    // Update user profile
    await db.query("UPDATE users SET name = ?, phone_number = ? WHERE id = ?", [
      name,
      phone_number,
      userId,
    ]);

    // Update session data
    req.session.user.name = name;
    req.session.user.phone_number = phone_number;

    res.json({
      message: "Profile updated successfully",
      user: {
        id: userId,
        name,
        email: req.session.user.email,
        phone_number,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
