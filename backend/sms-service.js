const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

/**
 * Helper to format phone numbers for Arkesel (E.164 without '+')
 * @param {string} phone - E.164 format (e.g., +233545123456)
 * @returns {string}
 */
const formatPhoneNumber = (phone) => phone.replace("+", "");

/**
 * Send welcome SMS to a new user via Arkesel (V1 API)
 * @param {string} phoneNumber - E.164 format (e.g., +233XXXXXXXXX)
 * @param {string} name - User's name
 */
const sendWelcomeSMS = async (phoneNumber, name) => {
  const formattedNumber = formatPhoneNumber(phoneNumber);
  const message = `Welcome to the CUG real-time pandemic monitoring system, ${name}! Stay informed with real-time updates.`;

  const url = `https://sms.arkesel.com/sms/api?action=send-sms&api_key=${process.env.ARK_API_KEY}&to=${formattedNumber}&from=${process.env.ARK_SENDER_NAME}&sms=${encodeURIComponent(message)}`;

  try {
    const response = await axios.get(url);
    console.log(`Welcome SMS sent to ${phoneNumber}:`, response.data);
    return response.data;
  } catch (error) {
    console.error("Arkesel SMS error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Send news notification SMS to a user
 * @param {string} phoneNumber - E.164 format
 * @param {string} newsTitle
 * @param {string} newsDescription
 */
const sendNewsNotificationSMS = async (phoneNumber, newsTitle, newsDescription) => {
  const formattedNumber = formatPhoneNumber(phoneNumber);
  const shortDescription =
    newsDescription.length > 100
      ? `${newsDescription.slice(0, 97)}...`
      : newsDescription;

  const message = `ALERT: ${newsTitle}\n${shortDescription}\nCheck the app for more.`;
  const url = `https://sms.arkesel.com/sms/api?action=send-sms&api_key=${process.env.ARK_API_KEY}&to=${formattedNumber}&from=${process.env.ARK_SENDER_NAME}&sms=${encodeURIComponent(message)}`;

  try {
    const response = await axios.get(url);
    console.log(`News SMS sent to ${phoneNumber}:`, response.data);
    return response.data;
  } catch (error) {
    console.error("Arkesel news SMS error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Send bulk SMS to multiple users
 * @param {Array} users - List of users with `phone_number`
 * @param {string} title
 * @param {string} description
 */
const sendBulkNewsNotifications = async (users, title, description) => {
  try {
    const results = await Promise.all(
      users
        .filter((u) => u.phone_number)
        .map((u) =>
          sendNewsNotificationSMS(u.phone_number, title, description)
        )
    );

    console.log(`Bulk SMS sent to ${results.length} users`);
    return results;
  } catch (error) {
    console.error("Bulk Arkesel SMS error:", error.message || error);
    throw error;
  }
};

module.exports = {
  sendWelcomeSMS,
  sendNewsNotificationSMS,
  sendBulkNewsNotifications,
};
