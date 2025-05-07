const twilio = require("twilio");
const dotenv = require("dotenv");
dotenv.config();

// Initialize Twilio client with credentials
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/**
 * Send welcome SMS to a new user
 * @param {string} phoneNumber - User's phone number in E.164 format (e.g., +1234567890)
 * @param {string} name - User's name
 * @returns {Promise} - Twilio message promise
 */
const sendWelcomeSMS = async (phoneNumber, name) => {
  try {
    const message = await client.messages.create({
      body: `Welcome to the CUG real-time pandemic monitoring system, ${name}! Thank you for signing up. Stay informed with real-time updates through our system.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    console.log(`Welcome SMS sent to ${phoneNumber}, SID: ${message.sid}`);
    return message;
  } catch (error) {
    console.error("Error sending welcome SMS:", error);
    throw error;
  }
};

/**
 * Send news notification SMS to a user
 * @param {string} phoneNumber - User's phone number in E.164 format
 * @param {string} newsTitle - Title of the news
 * @param {string} newsDescription - Brief description of the news
 * @returns {Promise} - Twilio message promise
 */
const sendNewsNotificationSMS = async (
  phoneNumber,
  newsTitle,
  newsDescription
) => {
  try {
    // Truncate description if too long for SMS
    const truncatedDesc =
      newsDescription.length > 100
        ? `${newsDescription.substring(0, 97)}...`
        : newsDescription;

    const message = await client.messages.create({
      body: `ALERT: New pandemic update - ${newsTitle}\n\n${truncatedDesc}\n\nCheck the app for more details.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    console.log(
      `News notification SMS sent to ${phoneNumber}, SID: ${message.sid}`
    );
    return message;
  } catch (error) {
    console.error("Error sending news notification SMS:", error);
    throw error;
  }
};

/**
 * Send bulk SMS notifications to multiple users
 * @param {Array} users - Array of user objects with phone_number property
 * @param {string} newsTitle - Title of the news
 * @param {string} newsDescription - Brief description of the news
 * @returns {Promise} - Promise that resolves when all messages are sent
 */
const sendBulkNewsNotifications = async (users, newsTitle, newsDescription) => {
  try {
    const promises = users
      .filter((user) => user.phone_number) // Only send to users with phone numbers
      .map((user) =>
        sendNewsNotificationSMS(user.phone_number, newsTitle, newsDescription)
      );

    await Promise.all(promises);
    console.log(`Bulk SMS notifications sent to ${promises.length} users`);
  } catch (error) {
    console.error("Error sending bulk SMS notifications:", error);
    throw error;
  }
};

module.exports = {
  sendWelcomeSMS,
  sendNewsNotificationSMS,
  sendBulkNewsNotifications,
};
