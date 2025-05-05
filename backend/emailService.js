const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

// Create a transporter using Gmail service with credentials from environment variables
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email from environment variables
    pass: process.env.EMAIL_PASSWORD, // App-specific password or email password
  },
});

// Function to send a welcome email
const sendWelcomeEmail = async (email, name) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender's email
    to: email, // Recipient's email
    subject: "Welcome to the CUG real-time pandemic monitoring system", // Email subject
    html: ` 
      <h1>Welcome, ${name}!</h1>
      <p>Thank you for signing up. We are glad to have you on board. Stay active for real-time updates through our system!</p>
      <p>Best regards,<br>CUG real-time pandemic monitoring system.</p>
    `, // Email body (HTML format)
  };

  try {
    // Await the result of sending the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully: " + info.response);
  } catch (error) {
    console.error("Error sending email: ", error);
  }
};

module.exports = { sendWelcomeEmail };
