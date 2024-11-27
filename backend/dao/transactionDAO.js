// dao/transactionDAO.js
const Transaction = require("../models/Transaction");
const { convertToUTCForRange } = require("../utils/helper");
const mongoose = require("mongoose");

// Function to create a new transaction
exports.createTransaction = async (transactionData, session) => {
  const newTransaction = new Transaction(transactionData);
  return await newTransaction.save({ session }); // Save within the session
};

exports.getTransactionsByStoreAndDateRange = async (
  storeId,
  startDate,
  endDate
) => {
  try {
    const { startOfDayUTC, endOfDayUTC } = convertToUTCForRange(
      startDate,
      endDate
    );
    const transactions = await Transaction.find({
      storeId: storeId,
      date: {
        $gte: startOfDayUTC,
        $lte: endOfDayUTC,
      },
    }).sort({ date: 1 });
    return transactions;
  } catch (error) {
    console.error("Error in getTransactionsByStoreAndDateRange:", error);
    throw error;
  }
};

// Function to get transactions by booking ID
exports.getTransactionsByBookingId = async (bookingId) => {
  try {
    const transactions = await Transaction.find({ booking: bookingId });
    if (transactions.length === 0) {
      return []; // Return an empty array if no transactions found
    }
    return transactions;
  } catch (error) {
    console.error("Error in getTransactionsByBookingId:", error);
    throw error;
  }
};

// Function to get a transaction by ID
exports.getTransactionById = async (transactionId) => {
  return await Transaction.findById(transactionId);
};

// Function to get transactions by customer ID
exports.getTransactionsByCustomerId = async (customerId) => {
  return await Transaction.find({ customer: customerId });
};

// Function to delete a transaction by ID
exports.deleteTransaction = async (transactionId) => {
  return await Transaction.findByIdAndDelete(transactionId);
};

// Function to get transactions by customer ID
exports.getTransactionByStoreAndTransactionId = async (
  storeId,
  transactionId
) => {
  return await Transaction.findOne({
    storeId,
    _id: transactionId,
  }).populate("customer");
};

// Function to get transactions by store ID
exports.getTransactionsByStoreId = async (storeId) => {
  try {
    const transactions = await Transaction.find({ storeId })
      .populate("customer", "name")
      .sort({ date: -1 });
    if (transactions.length === 0) {
      return [];
    }
    return transactions;
  } catch (error) {
    console.error("Error in getTransactionsByStoreId:", error);
    throw error;
  }
};
