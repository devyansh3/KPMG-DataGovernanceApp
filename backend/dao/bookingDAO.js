const Bookings = require("../models/Bookings");
const { convertToUTCForRange } = require("../utils/helper");

// Function to create a new Bookings
exports.createBooking = async (bookingData, session) => {
  const newBooking = new Bookings(bookingData);
  return await newBooking.save({ session });
};

// Function to get all bookings for a store within a date range
exports.getBookingsForStoreInADateRange = async (
  storeId,
  startDate,
  endDate
) => {
  // Use the utility function to convert dates to UTC
  const { startOfDayUTC, endOfDayUTC } = convertToUTCForRange(
    startDate,
    endDate
  );

  // Query bookings for the store in the adjusted date range
  const bookings = await Bookings.find({
    storeId,
    createdAt: { $gte: startOfDayUTC, $lte: endOfDayUTC },
    status: { $ne: "Cancelled" },
  })
    .populate("customer")
    .sort({ createdAt: 1 });

  return bookings;
};

// Function to update a Booking by ID
exports.updateBooking = async (id, updateData, options = {}) => {
  return await Bookings.findByIdAndUpdate(id, updateData, {
    new: true,
    ...options,
    session: options.session,
  });
};

// Function to delete a Bookings by ID
exports.deleteBooking = async (id) => {
  return await Bookings.findByIdAndDelete(id);
};

// Function to get all bookings for a store
exports.getBookingsForStore = async (storeId) => {
  try {
    const bookings = await Bookings.find({ storeId })
      .populate("customer", "name phone")
      .sort({ createdAt: -1 });
    if (!bookings || bookings.length === 0) {
      return [];
    }
    return bookings;
  } catch (error) {
    console.error("Error in getBookingsForStore:", error);
    throw error;
  }
};

exports.getUpcomingDeliveriesForStore = async (storeId, startDate, endDate) => {
  try {
    // Convert startDate and endDate to Date objects if they are not already
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Fetch bookings within the specified date range based on deliveryDate in orderSummary
    const bookings = await Bookings.find({
      storeId,
      "orderSummary.deliveryDate": { $gte: start, $lte: end }, // Filtering by deliveryDate within the range
    }).populate("customer"); // Ensure related data is populated

    return bookings;
  } catch (error) {
    console.error("Error in getUpcomingDeliveriesForStore:", error);
    throw error;
  }
};

exports.getUpcomingTrailsForStore = async (storeId, startDate, endDate) => {
  try {
    // Convert startDate and endDate to Date objects if they are not already
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Fetch bookings within the specified date range based on deliveryDate in orderSummary
    const bookings = await Bookings.find({
      storeId,
      "orderSummary.trialDate": { $gte: start, $lte: end }, // Filtering by deliveryDate within the range
    }).populate("customer"); // Ensure related data is populated

    return bookings;
  } catch (error) {
    console.error("Error in getUpcomingTrialsForStore:", error);
    throw error;
  }
};

// Function to get a booking by ID and populate customer and transaction data
exports.getBookingById = async (id, session = null) => {
  try {
    // Fetch booking details with populated customer, using the session if provided
    const query = Bookings.findById(id).populate("customer");

    if (session) {
      query.session(session); // Apply the session to the query
    }

    const booking = await query;

    if (!booking) {
      return null; // Return null if booking is not found
    }

    // Check if customer exists and override booking details
    if (booking.customer) {
      booking.details = {
        ...booking.details,
        name: booking.customer?.name,
        phone: booking.customer?.phone,
        city: booking.customer?.city,
        email: booking.customer?.email,
        address: booking.customer?.address,
      };
    }

    return booking;
  } catch (error) {
    console.error("Error in getBookingById:", error);
    throw error;
  }
};

// Fetch bookings by customer ID
exports.getBookingsByCustomerId = async (storeId, customerId) => {
  try {
    const bookings = await Bookings.find({
      storeId,
      customer: customerId,
    }).populate("customer");
    // Ensure transactions are populated
    return bookings;
  } catch (error) {
    console.error("Error in getBookingsByCustomerId:", error);
    throw error;
  }
};

// Function to get total bookings count
exports.getTotalBookingsCount = async (storeId) => {
  try {
    return await Bookings.countDocuments({ storeId });
  } catch (error) {
    console.error("Error in getTotalBookingsCount:", error);
    throw error;
  }
};

// Function to get bookings count per month
exports.getMonthlyBookingsCount = async (storeId) => {
  try {
    const bookingsPerMonth = await Bookings.aggregate([
      { $match: { storeId } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } }, // Sort by month
    ]);

    return bookingsPerMonth;
  } catch (error) {
    console.error("Error in getMonthlyBookingsCount:", error);
    throw error;
  }
};

// DAO function to get the count of bookings based on the date type
exports.getBookingsCountByDate = async (storeId, dateType, date) => {
  const queryField =
    dateType === "trialDate"
      ? "orderSummary.trialDate"
      : "orderSummary.deliveryDate";

  try {
    const count = await Bookings.countDocuments({
      storeId,
      [queryField]: new Date(date),
    });
    return count;
  } catch (error) {
    console.error("Error in getBookingsCountByDate:", error);
    throw error;
  }
};

exports.getBookingsOrdersOnSpecificDate = async (storeId, isTrial, date) => {
  try {
    const queryField = isTrial
      ? "orderSummary.trialDate"
      : "orderSummary.deliveryDate";
    const orders = await Bookings.find({
      storeId,
      [queryField]: date,
      status: { $ne: "Cancelled" }, // Exclude cancelled bookings
    });
    return orders;
  } catch (error) {
    console.error("Error in getBookingsOrdersOnSpecificDate:", error);
    throw error;
  }
};

exports.getBookingByBookingId = async (storeId, bookingId) => {
  try {
    // Find the booking by storeId and bookingId
    return await Bookings.findOne({ storeId, bookingId });
  } catch (error) {
    throw new Error(error.message);
  }
};
