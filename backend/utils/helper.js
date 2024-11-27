const moment = require("moment-timezone");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

exports.formatResponse = (status, data, message = "") => {
  return { status, data, message };
};

exports.ObjectId = (id) => {
  return new mongoose.Types.ObjectId(id);
};

exports.calculateTotalQuantity = (items) => {
  return items.reduce((total, item) => total + (item.quantity || 0), 0);
};

exports.formatName = (name) => {
  return name
    .trim()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};
exports.formatAmountWithoutSymbol = (amount) => {
  if (amount === undefined || amount === null) {
    return "N/A"; // Or return a default value or empty string
  }
  return (
    "Rs." +
    amount
      .toLocaleString("en", {
        currency: "INR",
      })
      .replace(/(\D)(\d)/, "$1$2")
  );
};

exports.formatDateTime = (dateString) => {
  // Check if the dateString is valid
  if (!dateString) return "-";

  // Convert the date string to IST
  const dateIST = moment(dateString).tz("Asia/Kolkata");

  // Format the date and time in IST
  return dateIST.format("MMM D, YYYY");
};

exports.convertToUTCForRange = (
  startDate,
  endDate,
  timezone = "Asia/Kolkata"
) => {
  const startOfDayUTC = moment
    .tz(startDate, timezone)
    .startOf("day")
    .utc()
    .toDate(); // Start of the day (00:00:00)
  const endOfDayUTC = moment.tz(endDate, timezone).endOf("day").utc().toDate(); // End of the day (23:59:59)

  return { startOfDayUTC, endOfDayUTC };
};

exports.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const encryptPassword = await bcrypt.hash(password, salt);
  return encryptPassword;
};

exports.getCurrentDateInString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Adding 1 as months are zero-based
  const day = String(today.getDate()).padStart(2, "0"); // Pads with '0' if day is single digit
  const endDate = `${year}-${month}-${day}`;

  console.log(endDate); // Example output: "2024-10-20"
  return endDate;
};
