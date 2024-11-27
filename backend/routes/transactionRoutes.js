const express = require("express");
const router = express.Router();
const transactionService = require("../services/transactionService");
const {
  AddActiveStoreToRequest,
} = require("../middleware/addActiveFactoryToRequest");
const { locationPermission } = require("../middleware/ownerPermission");
const passport = require("passport");

// Get all transactions for a store in a date range
router.get(
  "/analytics/store/:storeId",
  passport.authenticate("jwt", { session: false }),
  AddActiveStoreToRequest,
  locationPermission,
  async (req, res) => {
    try {
      const { storeId } = req.params;
      const { startDate, endDate } = req.query;

      // Fetch all transactions in the date range
      const transactions =
        await transactionService.getTransactionsByStoreInADateRange(
          storeId,
          startDate,
          endDate
        );

      // Return transactions
      res.status(200).json(transactions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get all transactions for a store
router.get(
  "/store/:storeId",
  passport.authenticate("jwt", { session: false }),
  AddActiveStoreToRequest,
  locationPermission,
  async (req, res) => {
    try {
      const { storeId } = req.params;
      const transactions = await transactionService.getTransactionsByStore(
        storeId
      );
      res.status(200).json(transactions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get transactions by booking ID
router.get(
  "/booking/:storeId/:bookingId",
  passport.authenticate("jwt", { session: false }),
  AddActiveStoreToRequest,
  locationPermission,
  async (req, res) => {
    try {
      const { bookingId } = req.params;
      const transactions = await transactionService.getTransactionsByBookingId(
        bookingId
      );
      res.status(200).json(transactions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get Transaction for a store by Id
router.get(
  "/:storeId/txnId/:transactionId",
  passport.authenticate("jwt", { session: false }),
  AddActiveStoreToRequest,
  locationPermission,
  async (req, res) => {
    try {
      const { storeId, transactionId } = req.params;
      const transaction =
        await transactionService.getTransactionByStoreAndTransactionId(
          storeId,
          transactionId
        );
      res.status(200).json(transaction);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get transactions by customer ID
router.get(
  "/customer/:storeId/:customerId",
  passport.authenticate("jwt", { session: false }),
  AddActiveStoreToRequest,
  locationPermission,
  async (req, res) => {
    try {
      const { customerId } = req.params;
      const transactions = await transactionService.getTransactionsByCustomerId(
        customerId
      );
      res.status(200).json(transactions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.post(
  "/:storeId/:bookingId",
  passport.authenticate("jwt", { session: false }),
  AddActiveStoreToRequest,
  locationPermission,
  async (req, res) => {
    try {
      const { storeId, bookingId } = req.params;
      const transactionData = req.body;
      const store = req.user.activeStoreUser.storeId; // Get the store object
      transactionData.store = store;
      const txnId = await transactionService.createTransactionAndUpdateBooking(
        bookingId,
        transactionData
      );
      res.status(201).json(txnId);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
