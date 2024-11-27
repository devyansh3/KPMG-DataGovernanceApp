const express = require("express");
const passport = require("passport");

const router = express.Router();
const { sendEmailWithPdf } = require("../services/emailService");
const {
  notifyDailyStoreSummary,
} = require("../controllers/notificationController");
const { locationPermission } = require("../middleware/ownerPermission");
const {
  AddActiveStoreToRequest,
} = require("../middleware/addActiveFactoryToRequest");

router.post("/send-email", async (req, res) => {
  try {
    const { bookingData } = req.body;

    if (!bookingData) {
      throw new Error("No bookingData found in request body");
    }

    await sendEmailWithPdf(bookingData);
    res.status(200).send("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Failed to send email");
  }
});

router.get("/dailyStoreSummaryCron", notifyDailyStoreSummary);

router.get(
  "/:storeId/dailyStoreSummary",
  passport.authenticate("jwt", { session: false }),
  AddActiveStoreToRequest,
  locationPermission,
  notifyDailyStoreSummary
);

module.exports = router;
