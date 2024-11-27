// services/customerService.js
const customerDAO = require("../dao/customerDAO");
const bookingDAO = require("../dao/bookingDAO");
const transactionDAO = require("../dao/transactionDAO");
const CounterDao = require("../dao/CounterDao");
const bookingService = require("./bookingService");

const counterDao = new CounterDao();

// Function to create a new customer
exports.createCustomer = async (customerData, session) => {
  try {
    // Extract storeId from the storeIds array in customerData
    const storeId = customerData.storeIds[0];

    // Ensure storeId is present
    if (!storeId) {
      throw new Error("storeId is required to create a customer.");
    }

    // Generate custom customer ID
    let customerId = await counterDao.updateCounter(
      storeId,
      "customer",
      session
    );
    customerId = `CUST-${customerId}`;

    // Assign the generated customerId to the customerData
    customerData.customerId = customerId;

    // Create customer in the database
    return await customerDAO.createCustomer(customerData, session);
  } catch (error) {
    console.error("Error in createCustomer:", error.message || error);
    throw error;
  }
};

// Function to get a customer by ID
exports.getCustomerById = async (customerId) => {
  return await customerDAO.getCustomerById(customerId);
};

// Function to get a customer by phone number and store ID
exports.getCustomerByPhoneAndStoreId = async (phone, storeId) => {
  return await customerDAO.getCustomerByPhoneAndStoreId(phone, storeId);
};

// Function to get customers by store ID
exports.getCustomersByStoreId = async (storeId) => {
  try {
    // Fetch customers for the given store ID
    const customers = await customerDAO.getCustomersByStoreId(storeId);
    if (customers && customers.length === 0) {
      return [];
    }
    return customers;
  } catch (error) {
    console.error("Error in getCustomersByStoreId:", error);
    throw error;
  }
};

exports.getTotalCustomersCountbyStoreId = async (storeId) => {
  try {
    // Fetch customers for the given store ID
    return (customers = await customerDAO.getTotalCustomersCountbyStoreId(
      storeId
    ));
  } catch (error) {
    console.error("Error in getCustomersByStoreId:", error);
    throw error;
  }
};

// Function to delete a customer by ID
exports.deleteCustomer = async (customerId) => {
  try {
    const customer = await customerDAO.getCustomerById(customerId);
    if (!customer) {
      throw new Error("Customer not found");
    }

    // Delete all bookings and associated transactions for the customer
    await Promise.all(
      customer.bookingIds.map(async (bookingId) => {
        const booking = await bookingDAO.getBookingById(bookingId);
        if (booking) {
          await bookingDAO.deleteBooking(bookingId);
        }
      })
    );

    // Delete the customer
    await customerDAO.deleteCustomer(customerId);

    return { success: true };
  } catch (error) {
    console.error("Error in deleteCustomer:", error);
    throw error;
  }
};

exports.modifyCustomer = async (customerId, updatedData) => {
  return await customerDAO.updateCustomerById(customerId, updatedData);
};

exports.getCustomersWithActiveBalance = async (storeId) => {
  const customers = await customerDAO.getCustomersByStoreId(storeId);

  // Filter customers based on the balance being greater than 0
  // return in descending order of balance, and limit 10, create this function in dao layer
  const customersWithActiveBalance = customers.filter(
    (customer) => customer.balance > 0
  );

  return customersWithActiveBalance;
};

// Service function to update customer balance when a booking is deleted
exports.updateCustomerBalance = async (customerId, balanceAdjustment) => {
  try {
    // Fetch the customer by ID
    const customer = await customerDAO.getCustomerById(customerId);
    if (!customer) {
      throw new Error("Customer not found");
    }

    // Adjust the customer's balance
    customer.balance = (customer.balance || 0) - balanceAdjustment;

    // Save the updated customer
    await customerDAO.updateCustomerById(customerId, {
      balance: customer.balance,
    });

    return { success: true, balance: customer.balance };
  } catch (error) {
    console.error("Error in updateCustomerBalance:", error);
    throw error;
  }
};

exports.updateCustomerBalanceAfterTransaction = async (
  customerId,
  amountPaid,
  settledAmount
) => {
  try {
    // Get the customer by ID
    const customer = await customerDAO.getCustomerById(customerId);
    if (!customer) {
      console.warn(`Customer with ID ${customerId} not found.`);
      return null;
    }
    const currentBalance = customer.balance || 0;
    const newCustomerBalance = Math.max(
      0,
      currentBalance - amountPaid - settledAmount
    );
    await customerDAO.updateCustomerById(customerId, {
      balance: newCustomerBalance,
    });
  } catch (error) {
    console.error("Error in updateCustomerBalanceAfterTransaction:", error);
    throw error;
  }
};

// independent of date range, change api
exports.getCustomerCountByDateRange = async (storeId, startDate, endDate) => {
  try {
    const customers = await customerDAO.getCustomersByDateRange(
      storeId,
      startDate,
      endDate
    );
    return customers;
  } catch (error) {
    console.error("Error fetching customers by date range:", error);
    throw error;
  }
};

// Function to update customer measurements
exports.updateCustomerMeasurements = async (customerId, measurements) => {
  try {
    const customer = await customerDAO.getCustomerById(customerId);
    if (!customer) {
      throw new Error("Customer not found");
    }
    customer.measurements = measurements;
    return await customerDAO.updateCustomerById(customerId, customer);
  } catch (error) {
    console.error(
      "Error updating customer measurements:",
      error.message || error
    );
    throw error;
  }
};
