const Customer = require("../models/Customer");
const moment = require("moment-timezone");
const { convertToUTCForRange } = require("../utils/helper");

// Function to create a new customer
exports.createCustomer = async (customerData, session) => {
  const newCustomer = new Customer(customerData);
  return await newCustomer.save({ session });
};
// Function to get a customer by phone number and store ID
exports.getCustomerByPhoneAndStoreId = async (phone, storeId) => {
  try {
    const customer = await Customer.findOne({ phone });
    // If no customer is found, return null instead of throwing an error
    if (!customer) {
      return null;
    }
    return customer;
  } catch (error) {
    console.error("Error in getCustomerByPhoneAndStoreId:", error);
    throw new Error("Failed to fetch customer by phone number");
  }
};

// Function to get a customer by ID
exports.getCustomerById = async (customerId) => {
  return await Customer.findById(customerId);
};

// Function to get a customer by email
exports.getCustomerByEmail = async (email) => {
  return await Customer.findOne({ email });
};

// Function to get customers by store ID
exports.getCustomersByStoreId = async (storeId) => {
  try {
    const customers = await Customer.find({ storeIds: storeId }).sort({
      createdAt: -1,
    });
    return customers.length === 0 ? [] : customers;
  } catch (error) {
    throw new Error("Failed to fetch customers by store ID");
  }
};

// Function to update customer measurements
exports.updateCustomerMeasurements = async (customerId, measurements) => {
  try {
    // Fetch the current customer data
    const customer = await customerDAO.getCustomerById(customerId);
    if (!customer) {
      throw new Error("Customer not found");
    }

    // Update only the measurements field
    customer.measurements = measurements;

    // Save the updated customer data
    return await customerDAO.updateCustomerById(customerId, customer);
  } catch (error) {
    console.error(
      "Error updating customer measurements:",
      error.message || error
    );
    throw error;
  }
};

// Function to update customer by ID
exports.updateCustomerById = async (customerId, updatedData, session = null) => {
  const updatedCustomer = await Customer.findByIdAndUpdate(
    customerId,
    updatedData,
    { new: true, session } // Include session if provided
  );
  if (updatedCustomer) {
    return true;
  }
  throw new Error("Failed transaction");
};

// Function to get customers by store ID and date range
exports.getTotalCustomersCountbyStoreId = async (storeId) => {
  // Use the utility function to convert dates to UTC
  try {
    const customers = await Customer.countDocuments({ storeIds: storeId });
    return customers;
  } catch (error) {
    throw new Error("Failed to fetch customers by store ID");
  }
};

// Function to get customers by store ID and date range
exports.getCustomersByDateRange = async (storeId, startDate, endDate) => {
  // Use the utility function to convert dates to UTC
  const { startOfDayUTC, endOfDayUTC } = convertToUTCForRange(
    startDate,
    endDate
  );
  // Return customers where storeId is within the storeIds array
  return await Customer.countDocuments({
    storeIds: storeId,
    createdAt: {
      $gte: startOfDayUTC,
      $lte: endOfDayUTC,
    },
  });
};

// Function to delete a customer by ID
exports.deleteCustomer = async (customerId) => {
  return await Customer.findByIdAndDelete(customerId);
};

// In your customerDAO
exports.updateCustomer = async (customerId, updateData) => {
  return await Customer.findByIdAndUpdate(customerId, updateData, {
    new: true,
  });
};
