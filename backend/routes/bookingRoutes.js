const express = require("express");
const passport = require("passport");
const {
  updateBooking,
  getBookingsForStore, // Ensure this is correct
  createBooking,
  getBookingById,
  getBookingsByCustomerId,
  getUpcomingDeliveries,
  getUpcomingTrials,
  getBookingsForStoreInADateRange,
  cancelBooking,
  getBookingByBookingId,
  getBookingsOrdersOnSpecificDate,
  updateBookingStatus,
} = require("../controllers/bookingController");
const { locationPermission } = require("../middleware/ownerPermission");
const {
  AddActiveStoreToRequest,
} = require("../middleware/addActiveFactoryToRequest");

const router = express.Router();

// Create a new booking (POST should stay first as it's unique)
router.post(
  "/:storeId",
  passport.authenticate("jwt", { session: false }),
  AddActiveStoreToRequest,
  locationPermission,
  createBooking
);

// Get a booking by bookingId (make this specific path first)
router.get(
  "/:storeId/bookingId/:bookingId",
  passport.authenticate("jwt", { session: false }),
  AddActiveStoreToRequest,
  locationPermission,
  getBookingByBookingId
);

// Move Booking to next status
router.get(
  "/:storeId/updateStatus/:id",
  passport.authenticate("jwt", { session: false }),
  AddActiveStoreToRequest,
  locationPermission,
  updateBookingStatus
);

// Fetch bookings by customer ID (specific path before general)
router.get(
  "/customer/:storeId/:customerId",
  passport.authenticate("jwt", { session: false }),
  AddActiveStoreToRequest,
  locationPermission,
  getBookingsByCustomerId
);

// Route to get the count of bookings for trial and/or delivery dates
router.get(
  "/:storeId/check-availability",
  passport.authenticate("jwt", { session: false }),
  AddActiveStoreToRequest,
  locationPermission,
  getBookingsOrdersOnSpecificDate
);

// Get all bookings for a store in a date range
router.get(
  "/sales/:storeId",
  passport.authenticate("jwt", { session: false }),
  AddActiveStoreToRequest,
  getBookingsForStoreInADateRange
);

// Fetch upcoming deliveries for a store
router.get(
  "/:storeId/upcoming-deliveries",
  passport.authenticate("jwt", { session: false }),
  AddActiveStoreToRequest,
  locationPermission,
  getUpcomingDeliveries
);

// Fetch upcoming trials for a store
router.get(
  "/:storeId/upcoming-trials",
  passport.authenticate("jwt", { session: false }),
  AddActiveStoreToRequest,
  locationPermission,
  getUpcomingTrials
);

// Get a booking by ID (general route for booking by ID)
router.get(
  "/:storeId/:id",
  passport.authenticate("jwt", { session: false }),
  AddActiveStoreToRequest,
  locationPermission,
  getBookingById
);

// Get all bookings for a store (most general route)
router.get(
  "/:storeId",
  passport.authenticate("jwt", { session: false }),
  AddActiveStoreToRequest,
  getBookingsForStore
);

// Cancel a booking by ID (specific route for cancellation)
router.put(
  "/:storeId/:id/cancel",
  passport.authenticate("jwt", { session: false }),
  AddActiveStoreToRequest,
  locationPermission,
  cancelBooking
);

// Update a booking by ID (general route for updating a booking)
router.put(
  "/:storeId/:id",
  passport.authenticate("jwt", { session: false }),
  AddActiveStoreToRequest,
  locationPermission,
  updateBooking
);

module.exports = router;
