const transactionDAO = require("../dao/transactionDAO");
const bookingDAO = require("../dao/bookingDAO");
const CounterDao = require("../dao/CounterDao");
const { getCustomerById } = require("./customerService");
const { notifyPaymentConfirmation } = require("../whatsapp/whatsappManager");
const mongoose = require("mongoose");

const counterDao = new CounterDao();

exports.getTransactionsByStoreInADateRange = async (
  storeId,
  startDate,
  endDate
) => {
  try {
    // Fetch all transactions from transactionDAO
    const transactions =
      await transactionDAO.getTransactionsByStoreAndDateRange(
        storeId,
        startDate,
        endDate
      );

    // Return the fetched transactions
    return transactions;
  } catch (error) {
    throw new Error("Error fetching transactions: " + error.message);
  }
};

exports.getTransactionsByStore = async (storeId) => {
  try {
    const txns = await transactionDAO.getTransactionsByStoreId(storeId);
    return txns;
  } catch (error) {
    throw new Error("Error fetching transactions: " + error.message);
  }
};

exports.getTransactionsByBookingId = async (bookingId) => {
  return await transactionDAO.getTransactionsByBookingId(bookingId);
};

exports.createTransactionAndUpdateBooking = async (
  bookingId,
  transactionData
) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction(); // Begin a new transaction

    const { store, amountPaid, settledAmount, tax } = transactionData;

    if (!store) {
      throw new Error("Store ID is required to create a transaction.");
    }

    const transactionCounter = await counterDao.updateCounter(
      store._id,
      "transaction",
      session // Pass the session here
    );
    const transactionId = `INV-${transactionCounter}`;
    transactionData.transactionId = transactionId;

    // Get the booking by ID within the session
    const booking = await bookingDAO.getBookingById(bookingId, session); // Pass session here
    if (!booking) {
      throw new Error("Booking not found");
    }

    // Create a new transaction within the session
    const newTxn = await transactionDAO.createTransaction({
      ...transactionData,
      booking: bookingId,
      storeId: store._id,
      bookingInfo: {
        id: booking.bookingId,
        items: booking.orderSummary.items,
        totalPrice: booking.orderSummary.totalPrice,
        createdAt: booking.createdAt,
      },
    }, session);

    const bookingUpdates = {
      "orderSummary.amountPaid": booking.orderSummary.amountPaid + amountPaid,
      "orderSummary.settledAmount": booking.orderSummary.settledAmount + settledAmount,
      "orderSummary.tax": tax, // Adding tax details
    };

    // Update the booking with the new values within the session
    const updatedBooking = await bookingDAO.updateBooking(
      bookingId,
      bookingUpdates,
      { new: true, session } // Pass the session here
    );

    await notifyPaymentConfirmation({
      txnInfo: newTxn,
      bookingInfo: updatedBooking,
    });

    await session.commitTransaction(); // Commit the transaction
    return newTxn._id;
  } catch (error) {
    await session.abortTransaction(); // Roll back if any error occurs
    throw error;
  } finally {
    session.endSession(); // End the session
  }
};



// Service to get transactions by customer ID
exports.getTransactionsByCustomerId = async (customerId) => {
  return await transactionDAO.getTransactionsByCustomerId(customerId);
};

// Function to delete transactions by booking ID
exports.deleteTransactionsByBookingId = async (bookingId) => {
  try {
    // Get all transactions associated with the booking ID
    const transactions = await transactionDAO.getTransactionsByBookingId(
      bookingId
    );

    // Delete each transaction
    for (const transaction of transactions) {
      await transactionDAO.deleteTransaction(transaction._id);
    }
  } catch (error) {
    console.error("Error deleting transactions by booking ID:", error);
    throw error;
  }
};

// Function to delete transactions by booking ID
exports.getTransactionByStoreAndTransactionId = async (
  storeId,
  transactionId
) => {
  try {
    const transaction =
      await transactionDAO.getTransactionByStoreAndTransactionId(
        storeId,
        transactionId
      );
    return transaction;
  } catch (error) {
    throw new Error("Error fetching transactions: " + error.message);
  }
};
