const nodemailer = require("nodemailer")
const dotenv = require("dotenv")
dotenv.config()

// Create a transporter using Gmail service with credentials from environment variables
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

// Function to send a professional welcome email
const sendWelcomeEmail = async (email, name) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Welcome to CUG Real-Time Pandemic Monitoring System",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to CUG Pandemic Monitoring</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 40px 30px; text-align: center;">
            <div style="background-color: #ffffff; width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
              <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                <span style="color: white; font-size: 20px; font-weight: bold;">🏥</span>
              </div>
            </div>
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">Welcome to CUG</h1>
            <p style="color: #e0e7ff; margin: 10px 0 0; font-size: 16px; font-weight: 400;">Real-Time Pandemic Monitoring System</p>
          </div>
          
          <!-- Main Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #1e293b; margin: 0 0 20px; font-size: 24px; font-weight: 600;">Hello ${name}! 👋</h2>
            
            <p style="color: #475569; line-height: 1.6; margin: 0 0 20px; font-size: 16px;">
              Thank you for joining our pandemic monitoring community. We're excited to have you on board and committed to keeping you informed with real-time health updates and critical information.
            </p>
            
            <!-- Features Section -->
            <div style="background-color: #f1f5f9; border-radius: 12px; padding: 25px; margin: 25px 0;">
              <h3 style="color: #1e293b; margin: 0 0 15px; font-size: 18px; font-weight: 600;">What you can expect:</h3>
              <ul style="color: #475569; margin: 0; padding-left: 20px; line-height: 1.8;">
                <li style="margin-bottom: 8px;">📊 Real-time pandemic data and statistics</li>
                <li style="margin-bottom: 8px;">🚨 Instant email alerts for critical updates</li>
                <li style="margin-bottom: 8px;">📈 Comprehensive trend analysis and insights</li>
                <li style="margin-bottom: 8px;">🌍 Global and local health monitoring</li>
                <li style="margin-bottom: 8px;">🔬 Latest research and prevention guidelines</li>
              </ul>
            </div>
            
            <!-- Call to Action -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="#" style="display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3); transition: all 0.3s ease;">
                Access Your Dashboard
              </a>
            </div>
            
            <p style="color: #64748b; line-height: 1.6; margin: 25px 0 0; font-size: 14px; text-align: center;">
              Stay vigilant, stay informed, and stay safe. Together, we can monitor and respond to health challenges effectively.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f8fafc; padding: 25px 30px; border-top: 1px solid #e2e8f0;">
            <div style="text-align: center;">
              <p style="color: #64748b; margin: 0 0 10px; font-size: 14px; font-weight: 600;">
                CUG Real-Time Pandemic Monitoring System
              </p>
              <p style="color: #94a3b8; margin: 0; font-size: 12px; line-height: 1.5;">
                This email was sent to ${email}. If you have any questions, please contact our support team.
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log("Professional welcome email sent successfully: " + info.response)
  } catch (error) {
    console.error("Error sending welcome email: ", error)
  }
}

module.exports = { sendWelcomeEmail }
