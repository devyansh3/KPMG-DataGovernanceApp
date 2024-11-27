const bookingService = require("../services/bookingService");
const { getUpcomingDeliveriesForStore } = require("../services/bookingService");
const { STATUS_CODES } = require("../utils/constants");

exports.createBooking = async (req, res) => {
  try {
    const bookingData = req.body;
    const { storeId } = req.params;
    const store = req.user.activeStoreUser.storeId; // Get the store object
    console.log("store", store, storeId)

    const newBooking = await bookingService.createNewBooking(bookingData, store);

    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Function to update a booking by ID
exports.updateBooking = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    const updatedBooking = await bookingService.updateBooking(id, updateData);
    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json(updatedBooking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Function to update a bookingstatus by ID
exports.updateBookingStatus = async (req, res) => {
  const { id } = req.params;
  console.log("ID", id);
  try {
    const nextStatus = await bookingService.updateBookingStatus(id);
    if (!nextStatus) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json(nextStatus);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Function to cancel a booking by ID
exports.cancelBooking = async (req, res) => {
  const { id } = req.params;
  try {
    await bookingService.cancelBooking(id);
    res.status(200).json(true);
  } catch (err) {
    res.status(400).json(false);
  }
};

// Function to get all bookings for a store
exports.getBookingsForStore = async (req, res) => {
  const { storeId } = req.params;
  try {
    const result = await bookingService.getBookingsForStore(storeId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Function to get all bookings for a store
exports.getBookingsForStoreInADateRange = async (req, res) => {
  const { storeId } = req.params;
  const { startDate, endDate } = req.query;
  try {
    const result = await bookingService.getBookingsForStoreInADateRange(
      storeId,
      startDate,
      endDate
    );

    if (result === null) {
      return res.status(STATUS_CODES.NO_CONTENT).json({
        message:
          "No bookings found for this store within the specified date range.",
      });
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUpcomingDeliveries = async (req, res) => {
  const { storeId } = req.params;
  const { startDate, endDate } = req.query; // Expecting date range from query params

  let start = new Date(startDate).toISOString();
  let end = new Date(endDate).toISOString();
  console.log(start + end);

  try {
    const upcomingDeliveries = await getUpcomingDeliveriesForStore(
      storeId,
      start,
      end
    );
    res.json(upcomingDeliveries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUpcomingTrials = async (req, res) => {
  const { storeId } = req.params;
  const { startDate, endDate } = req.query; // Expecting date range from query params

  let start = new Date(startDate).toISOString();
  let end = new Date(endDate).toISOString();
  console.log(start + end);

  try {
    const upcomingDeliveries = await bookingService.getUpcomingTrialsForStore(
      storeId,
      start,
      end
    );
    res.json(upcomingDeliveries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Function to get a booking by ID
exports.getBookingById = async (req, res) => {
  const { id } = req.params;
  try {
    const booking = await bookingService.getBookingById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Fetch bookings by customer ID
exports.getBookingsByCustomerId = async (req, res) => {
  const { storeId, customerId } = req.params;
  try {
    const bookings = await bookingService.getBookingsByCustomerId(
      storeId,
      customerId
    );
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Function to get the count of bookings for trial and/or delivery dates
exports.getBookingsCountByDates = async (req, res) => {
  const { storeId } = req.params;
  const { trialDate, deliveryDate } = req.query;

  try {
    // Call the service function to get the counts for the trial and/or delivery dates
    const counts = await bookingService.getBookingsCountByDates(
      storeId,
      trialDate,
      deliveryDate
    );

    // Send the counts in the response
    res.json(counts);
  } catch (error) {
    console.error("Error in getBookingsCountByDates controller:", error);
    res.status(500).json({ message: error.message });
  }
};

// Function to get the count of bookings for trial and/or delivery dates
exports.getBookingsOrdersOnSpecificDate = async (req, res) => {
  const { storeId } = req.params;
  const { date } = req.query;

  try {
    const result = await bookingService.getBookingsOrdersOnSpecificDate(
      storeId,
      date
    );
    res.json(result);
  } catch (error) {
    console.error("Error in getBookingsCountByDates controller:", error);
    res.status(500).json({ message: error.message });
  }
};

// Function to get a booking by bookingId
exports.getBookingByBookingId = async (req, res) => {
  const { storeId, bookingId } = req.params;
  try {
    let booking = await bookingService.getBookingByBookingId(
      storeId,
      bookingId
    );
    if (!booking) {
      booking = null;
    }
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
