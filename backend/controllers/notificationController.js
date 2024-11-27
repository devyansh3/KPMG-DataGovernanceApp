const storeUserService = require("../services/storeUserService");
const bookingService = require("../services/bookingService");
const transactionService = require("../services/transactionService");
const { getCurrentDateInString } = require("../utils/helper");
const { notifyDailyStoreSummaryPdf } = require("../whatsapp/whatsappManager");

exports.notifyDailyStoreSummary1 = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const storeUser = {
      storeId: req.user.activeStoreUser.storeId,
      userId: {
        _id: req.user._id,
        username: req.user.username,
        phone: req.user.phone,
      },
    };
    const analyticsData = await notifySummaryForStoreUser(
      storeUser,
      startDate,
      endDate
    );

    res.status(200).send(analyticsData);
  } catch (err) {
    res.status(500).send("Failed to send data");
  }
};

exports.notifyDailyStoreSummary = async (req, res) => {
  try {
    const currentDate = getCurrentDateInString();
    console.log("CURR DATE", currentDate);
    const adminStoreUsers = await storeUserService.getStoreUsersWithAdminRole();
    // console.log("ADMINS", adminStoreUsers);
    await executeWithDelay(adminStoreUsers, currentDate, 1000);
    res.status(200).send("OK");
  } catch (err) {
    console.error("Error initiating summary notifications:", err);
    res.status(500).send("Failed to send data", err);
  }
};

const executeWithDelay = async (storeUsers, currentDate, delay) => {
  for (let i = 0; i < storeUsers.length; i++) {
    await new Promise((resolve) => setTimeout(resolve, delay));

    console.log(
      `Store: ${storeUsers[i].storeId.area} ; User: ${storeUsers[i].userId.phone}`
    );
    notifySummaryForStoreUser(storeUsers[i], currentDate, currentDate).catch(
      (err) => {
        console.error(
          `Error processing store user ${storeUsers[i].userId._id},  store ${storeUsers[i].storeId._id}:`,
          err
        );
      }
    );
  }
};

const notifySummaryForStoreUser = async (storeUser, startDate, endDate) => {
  try {
    const { storeId, userId } = storeUser;
    const bookings = await bookingService.getBookingsForStoreInADateRange(
      storeId._id,
      startDate,
      endDate
    );
    const transactions =
      await transactionService.getTransactionsByStoreInADateRange(
        storeId._id,
        startDate,
        endDate
      );
    const analytics = {
      bookings,
      transactions,
      storeUser,
      today: startDate,
    };
    const analyticsData = await notifyDailyStoreSummaryPdf(analytics);

    return analyticsData;
  } catch (err) {
    console.log(err);
  }
};
