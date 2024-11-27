// routes/customerRoutes.js
const express = require("express");
const router = express.Router();
const customerService = require("../services/customerService");
const { STATUS_CODES } = require("../utils/constants");

router.post("/", async (req, res) => {
  try {
    const customer = await customerService.createCustomer(req.body);
    res.status(STATUS_CODES.CREATED).json(customer);
  } catch (error) {
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
});

router.get("/store/:storeId/phone/:phone", async (req, res) => {
  try {
    let customer = await customerService.getCustomerByPhoneAndStoreId(
      req.params.phone,
      req.params.storeId
    );
    if (!customer) {
      customer = null;
    }
    res.status(STATUS_CODES.OK).json(customer);
  } catch (error) {
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
});

router.get("/:customerId", async (req, res) => {
  try {
    const customer = await customerService.getCustomerById(
      req.params.customerId
    );
    res.status(STATUS_CODES.OK).json(customer);
  } catch (error) {
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
});

router.get("/email/:email", async (req, res) => {
  try {
    const customer = await customerService.getCustomerByEmail(req.params.email);
    res.status(STATUS_CODES.OK).json(customer);
  } catch (error) {
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
});

router.get("/store/:storeId", async (req, res) => {
  try {
    const customers = await customerService.getCustomersByStoreId(
      req.params.storeId
    );
    res.status(STATUS_CODES.OK).json(customers);
  } catch (error) {
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
});

router.get("/store/totalCustomers/:storeId", async (req, res) => {
  try {
    const count = await customerService.getTotalCustomersCountbyStoreId(
      req.params.storeId
    );
    res.status(STATUS_CODES.OK).json(count);
  } catch (error) {
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
});

router.get(
  "/store/:storeId/customers-with-active-balance",
  async (req, res) => {
    const { storeId } = req.params;

    try {
      const customers = await customerService.getCustomersWithActiveBalance(
        storeId
      );
      res.status(STATUS_CODES.OK).json(customers);
    } catch (error) {
      res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
);

router.put("/:customerId", async (req, res) => {
  try {
    const status = await customerService.modifyCustomer(
      req.params.customerId,
      req.body
    );
    res.status(STATUS_CODES.OK).json(status);
  } catch (error) {
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
});

router.get("/store/:storeId/date-range", async (req, res) => {
  const { storeId } = req.params;
  const { startDate, endDate } = req.query;

  try {
    const count = await customerService.getCustomerCountByDateRange(
      storeId,
      startDate,
      endDate
    );
    res.status(STATUS_CODES.OK).json(count);
  } catch (error) {
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
});

// Route to update customer measurements
router.put("/:customerId/measurements", async (req, res) => {
  try {
    const updatedCustomer = await customerService.updateCustomerMeasurements(
      req.params.customerId,
      req.body.measurements
    );
    res.status(STATUS_CODES.OK).json(updatedCustomer);
  } catch (error) {
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
});

module.exports = router;
