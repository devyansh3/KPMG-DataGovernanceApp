const bookingDAO = require("../dao/bookingDAO");
const CounterDao = require("../dao/CounterDao");
const customerDAO = require("../dao/customerDAO");
const { BOOKING_STATUS } = require("../utils/constants");
const customerService = require("./customerService");
const mongoose = require("mongoose");
const { formatName } = require("../utils/helper");

const counterDao = new CounterDao();

exports.createNewBooking = async (bookingData, store) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const {
      details,
      measurements,
      orderSummary,
      selectedItems,
      status,
      createdBy,
    } = bookingData;
    const { name, email, phone, city, address } = details;

    // Check if customer exists for the store
    let customer = await customerService.getCustomerByPhoneAndStoreId(
      phone,
      store._id,
      session
    );
    if (!customer) {
      const newCustomerData = {
        name: formatName(name),
        email,
        phone,
        city,
        address,
        storeIds: [store._id],
        measurements,
      };
      customer = await customerService.createCustomer(newCustomerData, session);
    } else {
      Object.assign(customer, {
        ...customer, // Preserve existing fields
        ...details, // Overwrite with new details
        measurements, // Overwrite measurements
      });
      if (!customer.storeIds.includes(store._id)) {
        customer.storeIds.push(store._id);
      }
      await customer.save({ session });
    }

    // Generate custom booking ID based on store area
    const areaPrefix = store.area
      ? store.area.substring(0, 3).toUpperCase()
      : "STORE";
    const bookingCounter = await counterDao.updateCounter(
      store._id,
      "booking",
      session
    );
    const bookingId = `${areaPrefix}-${bookingCounter}`;

    const totalPrice = bookingData.orderSummary.items?.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );

    // Create booking object
    const newBookingData = {
      bookingId, // Use dynamic booking ID
      measurements: measurements.map((m) => ({
        type: m.type,
        data: m.data,
      })),
      selectedItems,
      orderSummary: {
        items: orderSummary.items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          key: item.key,
        })),
        trialDate: orderSummary.trialDate
          ? new Date(orderSummary.trialDate)
          : null,
        trialTime: orderSummary.trialTime ? orderSummary.trialTime : null,
        deliveryDate: orderSummary.deliveryDate
          ? new Date(orderSummary.deliveryDate)
          : null,
        deliveryTime: orderSummary.deliveryTime
          ? orderSummary.deliveryTime
          : null,
        totalPrice,
        images: orderSummary.images,
        amountPaid: 0,
        settledAmount: 0,
        tax: { type: null, value: 0 },
      },
      details: { name, email, phone, address, city },
      status,
      createdBy,
      storeId: store._id,
      customer: customer._id,
    };

    const newBooking = await bookingDAO.createBooking(newBookingData, session);
    await session.commitTransaction();
    return newBooking;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

exports.updateBooking = async (id, updateData) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const booking = await bookingDAO.getBookingById(id, session); // Pass the session here
    if (!booking) {
      throw new Error("Booking not found");
    }

    // Update booking details
    for (const key in updateData) {
      booking[key] = updateData[key];
    }

    // Update trial and delivery dates if provided
    if (updateData.orderSummary) {
      booking.orderSummary.trialDate = updateData.orderSummary.trialDate
        ? new Date(updateData.orderSummary.trialDate)
        : booking.orderSummary.trialDate;
      booking.orderSummary.deliveryDate = updateData.orderSummary.deliveryDate
        ? new Date(updateData.orderSummary.deliveryDate)
        : booking.orderSummary.deliveryDate;
    }

    booking.orderSummary.totalPrice = booking.orderSummary.items?.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );

    // Update customer details and measurements if they have changed
    if (updateData.details || updateData.measurements) {
      const customer = await customerDAO.getCustomerById(
        booking.customer,
        session
      );
      if (customer) {
        let needsUpdate = false;

        // Update customer details if they have changed
        if (updateData.details) {
          if (
            updateData.details.name &&
            updateData.details.name !== customer.name
          ) {
            customer.name = formatName(updateData.details.name);
            needsUpdate = true;
          }
          if (
            updateData.details.email &&
            updateData.details.email !== customer.email
          ) {
            customer.email = updateData.details.email;
            needsUpdate = true;
          }
          if (
            updateData.details.phone &&
            updateData.details.phone !== customer.phone
          ) {
            customer.phone = updateData.details.phone;
            needsUpdate = true;
          }
          if (
            updateData.details.address &&
            updateData.details.address !== customer.address
          ) {
            customer.address = updateData.details.address;
            needsUpdate = true;
          }
          if (
            updateData.details.city &&
            updateData.details.city !== customer.city
          ) {
            customer.city = updateData.details.city;
            needsUpdate = true;
          }

          // Update the booking's details object with the new values
          booking.details = {
            ...booking.details,
            ...updateData.details,
          };
        }
        // Update customer measurements if they have changed
        if (updateData.measurements) {
          customer.measurements = updateData.measurements;
          needsUpdate = true;
          // Update the booking's measurements object with the new values
          booking.measurements = updateData.measurements;
        }
        // Save updated customer only if there are changes
        if (needsUpdate) {
          await customerDAO.updateCustomerById(
            booking.customer,
            customer,
            session
          ); // Pass the session here
        }
      }
    }
    // Update the booking in the database
    await bookingDAO.updateBooking(id, booking, { session }); // Pass the session here
    await session.commitTransaction();
    return booking;
  } catch (error) {
    console.error("Error in updateBooking:", error);
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

exports.updateBookingStatus = async (id, session = null) => {
  try {
    const booking = await bookingDAO.getBookingById(id, session);
    if (!booking) {
      throw new Error("Booking not found");
    }
    let nextStatus = "";
    if (booking.status === BOOKING_STATUS.OPEN) {
      nextStatus = BOOKING_STATUS.TRIAL_DONE;
    } else if (booking.status === BOOKING_STATUS.TRIAL_DONE) {
      nextStatus = BOOKING_STATUS.DELIVERY_DONE;
    }
    if (nextStatus) {
      booking.status = nextStatus;
      await bookingDAO.updateBooking(id, booking, { session });
      return nextStatus;
    }
    throw new Error("No valid Status found");
  } catch (error) {
    console.error("Error in updateBookingStatus:", error);
    throw error;
  }
};

// Function to cancel a booking by ID
exports.cancelBooking = async (id) => {
  try {
    const booking = await bookingDAO.getBookingById(id);
    if (!booking) {
      throw new Error("Booking not found");
    }
    booking.status = "Cancelled";
    await bookingDAO.updateBooking(id, booking, {});
    return true;
  } catch (error) {
    console.error("Error in cancelBooking:", error);
    throw error;
  }
};

// Function to get all bookings for a store
exports.getBookingsForStore = async (storeId) => {
  return await bookingDAO.getBookingsForStore(storeId);
};

// Function to get all bookings for a store in a date range
exports.getBookingsForStoreInADateRange = async (
  storeId,
  startDate,
  endDate
) => {
  try {
    const bookings = await bookingDAO.getBookingsForStoreInADateRange(
      storeId,
      startDate,
      endDate
    );

    if (!bookings || bookings.length === 0) {
      return []; // Return null if no bookings found
    }

    return bookings;
  } catch (err) {
    console.error("Error in getBookingsForStoreInADateRange:", err);
    throw err;
  }
};

exports.getUpcomingDeliveriesForStore = async (storeId, startDate, endDate) => {
  try {
    return await bookingDAO.getUpcomingDeliveriesForStore(
      storeId,
      startDate,
      endDate
    );
  } catch (error) {
    console.error("Error in getUpcomingDeliveriesForStore:", error);
    throw error;
  }
};

exports.getUpcomingTrialsForStore = async (storeId, startDate, endDate) => {
  try {
    return await bookingDAO.getUpcomingTrailsForStore(
      storeId,
      startDate,
      endDate
    );
  } catch (error) {
    console.error("Error in getUpcomingTrialsForStore:", error);
    throw error;
  }
};

// Function to get a booking by ID
exports.getBookingById = async (id) => {
  try {
    // Fetch booking details with populated customer
    const booking = await bookingDAO.getBookingById(id);
    if (!booking) {
      throw new Error("Booking not found");
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
    const bookings = await bookingDAO.getBookingsByCustomerId(
      storeId,
      customerId
    );
    return bookings;
  } catch (error) {
    console.error("Error in getBookingsByCustomerId:", error);
    throw error;
  }
};

exports.getTotalBookingsCount = async (req, res) => {
  try {
    const storeId = req.params.storeId;
    const totalBookings = await bookingService.getTotalBookingsCount(storeId);
    res.status(200).json({ totalBookings });
  } catch (error) {
    res.status(500).json({ message: "Error fetching total bookings count" });
  }
};

// Get monthly bookings count
exports.getMonthlyBookingsCount = async (req, res) => {
  try {
    const storeId = req.params.storeId;
    const bookingsPerMonth = await bookingService.getMonthlyBookingsCount(
      storeId
    );
    res.status(200).json({ bookingsPerMonth });
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings per month" });
  }
};

// Function to get the count of bookings for trial and/or delivery dates
exports.getBookingsCountByDates = async (storeId, trialDate, deliveryDate) => {
  try {
    const result = {};
    if (trialDate) {
      const trialCount = await bookingDAO.getBookingsCountByDate(
        storeId,
        "trialDate",
        trialDate
      );
      result.trialCount = trialCount;
    }
    if (deliveryDate) {
      const deliveryCount = await bookingDAO.getBookingsCountByDate(
        storeId,
        "deliveryDate",
        deliveryDate
      );
      result.deliveryCount = deliveryCount;
    }
    return result;
  } catch (error) {
    console.error("Error in getBookingsCountByDates:", error);
    throw error;
  }
};

// Function to get the orders of bookings for trial and/or delivery date
exports.getBookingsOrdersOnSpecificDate = async (storeId, date) => {
  try {
    const result = {};

    if (date) {
      const trialOrders = await bookingDAO.getBookingsOrdersOnSpecificDate(
        storeId,
        true,
        new Date(date)
      );
      result.trials = {
        orders: trialOrders,
        count: trialOrders.length,
      };

      const deliveryOrders = await bookingDAO.getBookingsOrdersOnSpecificDate(
        storeId,
        false,
        new Date(date)
      );
      result.deliveries = {
        orders: deliveryOrders,
        count: deliveryOrders.length,
      };
    }
    return result;
  } catch (error) {
    console.error("Error in getBookingsOrdersOnSpecificDate:", error);
    throw error;
  }
};

exports.getBookingByBookingId = async (storeId, bookingId) => {
  try {
    return await bookingDAO.getBookingByBookingId(storeId, bookingId);
  } catch (error) {
    throw new Error(error.message);
  }
};
