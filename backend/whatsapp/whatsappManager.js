const {
  formatDateTime,
  calculateTotalQuantity,
  formatAmountWithoutSymbol,
  formatName,
} = require("../utils/helper");

const PDFDocument = require("pdfkit");
const fs = require("fs");

const {
  sendWhatsAppMessageTemplate,
  sendWhatsAppMessageWithDocument,
} = require("./whatsappService");

function constructSummaryData(bookingDetails) {
  if (!bookingDetails) {
    throw new Error("Invalid arguments");
  }
  const messageData = {
    name: bookingDetails.details.name,
    bookingId: bookingDetails.bookingId,
    createdAt: formatDateTime(bookingDetails.createdAt),
    trialDate: bookingDetails.orderSummary.trialDate
      ? formatDateTime(bookingDetails.orderSummary.trialDate)
      : "-",
    deliveryDate: bookingDetails.orderSummary.deliveryDate
      ? formatDateTime(bookingDetails.orderSummary.deliveryDate)
      : "-",
    totalQuantity: calculateTotalQuantity(bookingDetails.orderSummary.items),
    totalPrice: `Rs.${formatAmountWithoutSymbol(
      bookingDetails.orderSummary.totalPrice
    )}`,
    orgName: process.env.ORG_NAME,
  };

  return messageData;
}

async function notifyBookingConfirmation(bookingData) {
  try {
    const data = constructSummaryData(bookingData);
    const phone = bookingData.details.phone;
    await sendWhatsAppMessageTemplate(
      phone,
      data,
      process.env.TEMPLATE_ORDER_CONFIRM,
      process.env.LOCALE_EN
    );
  } catch (error) {
    console.log("Notify Booking Summary Error", error);
    return false;
  }
}

function constructPaymentData({ txnInfo, bookingInfo }) {
  if (!txnInfo || !bookingInfo) {
    throw new Error("Invalid arguments");
  }
  const messageData = {
    customerName: bookingInfo.details.name,
    amountPaid: `Rs.${formatAmountWithoutSymbol(txnInfo.amountPaid)}`,
    bookingId: bookingInfo.bookingId,
    txnDate: formatDateTime(txnInfo.date),
    orgName: process.env.ORG_NAME,
  };

  return messageData;
}

async function notifyPaymentConfirmation(txnData) {
  try {
    const data = constructPaymentData(txnData);
    const phone = txnData.bookingInfo.details.phone;
    await sendWhatsAppMessageTemplate(
      phone,
      data,
      process.env.TEMPLATE_PAYMENT_CONFIRM,
      process.env.LOCALE_EN_US
    );
  } catch (error) {
    console.log("Notify Payment Summary Error", error);
    return false;
  }
}

const generateAnalyticsPDF = (analyticsData, path) => {
  return new Promise((resolve, reject) => {
    const {
      totalSales,
      totalCollections,
      bookingOrders,
      itemsSold,
      storeName,
      currentDate,
    } = analyticsData;

    let doc;
    let writeStream;
    try {
      doc = new PDFDocument({ margin: 5 }); // Initialize pdfkit document
      writeStream = fs.createWriteStream(path);
      doc.pipe(writeStream); // Pipe the document to a writable stream

      let y = 30; // Initial y position
      const offset = 15; // Offset between lines
      const startX = 40; // Initial X position
      let fullPageWidth = doc.page.width;
      let pageHeight = doc.page.height;

      const formatText = (isBold = false, isTitle = false) => {
        doc.fontSize(isTitle ? 12 : 10);
        doc.font(isBold ? "Helvetica-Bold" : "Helvetica");
      };

      const printText = (text, xPos, yPos, nextLine = true) => {
        doc.text(text, xPos, yPos);
        if (nextLine) y += offset;
      };

      const checkSpaceAndAddPage = (printTableHeaderCallback = null) => {
        if (y + offset >= pageHeight - 40) {
          doc.addPage();
          y = 30; // Reset y position on the new page
          printHeader(); // Reprint the header

          // If there's a callback (e.g., reprint table headers), invoke it
          if (printTableHeaderCallback) {
            printTableHeaderCallback();
          }
        }
      };

      const printHeader = () => {
        formatText(true, false);
        printText(storeName, startX, y, false);
        formatText(true, true);
        printText("STORE SUMMARY", fullPageWidth / 2 - 50, y, false);
        formatText(true, false);
        printText(`Date: ${currentDate}`, fullPageWidth - 150, y);
        doc
          .moveTo(startX, y + 10)
          .lineTo(fullPageWidth - startX, y + 10)
          .stroke();
        y += offset + 10;
      };

      const printSummary = () => {
        checkSpaceAndAddPage();
        formatText(true, false);
        printText(`SALES: ${totalSales.amount}`, startX, y, false);
        printText(
          `COLLECTION: ${totalCollections.amount}`,
          fullPageWidth - 180,
          y
        );
        printText(`ORDERS: ${totalSales.count}`, startX, y, false);
        printText(
          `INVOICES: ${totalCollections.count}`,
          fullPageWidth - 180,
          y
        );
        doc
          .moveTo(startX, y + 10)
          .lineTo(fullPageWidth - startX, y + 10)
          .stroke();
        y += offset + 10;
      };

      const printBookingOrders = () => {
        checkSpaceAndAddPage();
        formatText(true, false);
        printText("BOOKING ORDERS", fullPageWidth / 2 - 50, y);

        const printTableHeader = () => {
          formatText(true, false);
          printText("Order ID", startX, y, false);
          printText("Customer", startX + 150, y, false);
          printText("Amount", startX + 340, y, false);
          y += offset;
          doc
            .moveTo(startX, y)
            .lineTo(fullPageWidth - startX, y)
            .stroke();
          y += offset;
          formatText(false, false);
        };

        printTableHeader();
        formatText(false, false);
        bookingOrders.forEach((order) => {
          printText(order.id, startX, y, false);
          printText(order.customerName, startX + 150, y, false);
          printText(`${order.amount}`, startX + 340, y);

          // Check for page overflow and add a new page if needed
          checkSpaceAndAddPage(printTableHeader);
        });

        doc
          .moveTo(startX, y + 10)
          .lineTo(fullPageWidth - startX, y + 10)
          .stroke();
        y += offset + 10;
      };

      const printItemsSold = () => {
        checkSpaceAndAddPage();
        formatText(true, false);
        printText("ITEMS SOLD", fullPageWidth / 2 - 50, y);

        const printTableHeader = () => {
          formatText(true, false);
          printText("S.No", startX, y, false);
          printText("Item", startX + 150, y, false);
          printText("Quantity", startX + 340, y, false);
          y += offset;
          doc
            .moveTo(startX, y)
            .lineTo(fullPageWidth - startX, y)
            .stroke();
          y += offset;
          formatText(false, false);
        };

        printTableHeader();

        let totalItems = 0;

        itemsSold.forEach((item, index) => {
          printText(`${index + 1}.`, startX, y, false);
          printText(item.itemName, startX + 150, y, false);
          printText(`${item.quantity} pcs`, startX + 340, y);
          totalItems += item.quantity;

          // Check for page overflow and add a new page if needed
          checkSpaceAndAddPage(printTableHeader);
        });

        formatText(true, false);
        printText("TOTAL", startX + 150, y, false);
        printText(`${totalItems} pcs`, startX + 340, y);
        doc
          .moveTo(startX, y + 10)
          .lineTo(fullPageWidth - startX, y + 10)
          .stroke();
        y += offset + 10;
      };

      // Print the PDF sections
      printHeader();
      printSummary();
      printBookingOrders();
      printItemsSold();
      // Finalize the PDF
      doc.end();

      writeStream.on("finish", () => {
        resolve();
      });

      // Handle stream errors
      writeStream.on("error", (err) => {
        reject(err);
      });
    } catch (error) {
      reject(error);
    } finally {
      writeStream.on("close", () => {
        fs.unlink(path, (err) => {
          if (err) {
            console.error(`Error deleting file: ${err.message}`);
          }
        });
      });
    }
  });
};

async function constructStoreSummaryPdfData({
  transactions,
  bookings,
  storeUser,
  today,
}) {
  if (!transactions || !bookings || !storeUser) {
    throw new Error("Invalid arguments");
  }
  const prepareSalePayload = (bookings) => {
    const obj = {
      totalSales: {
        amount: 0,
        count: bookings.length,
      },
      bookingOrders: [],
    };

    bookings.forEach((booking) => {
      const orderAmount = booking.orderSummary.totalPrice;
      obj.bookingOrders.push({
        id: booking.bookingId,
        customerName: formatName(booking.customer.name),
        amount: formatAmountWithoutSymbol(orderAmount),
      });
      obj.totalSales.amount += orderAmount;
    });

    obj.totalSales.amount = formatAmountWithoutSymbol(obj.totalSales.amount);

    return obj;
  };

  const prepareItemsPayload = (bookings) => {
    const itemMap = bookings.reduce((acc, booking) => {
      booking.orderSummary.items.forEach((item) => {
        const itemName = item.name.toLowerCase();
        if (acc[itemName]) {
          acc[itemName] += item.quantity;
        } else {
          acc[itemName] = item.quantity;
        }
      });
      return acc;
    }, {});
    const itemsArray = Object.keys(itemMap).map((name) => ({
      itemName: formatName(name),
      quantity: itemMap[name],
    }));
    return itemsArray;
  };

  const prepareCollectionPayload = (transactions) => {
    const totalCollectionsValue = transactions.reduce(
      (acc, txn) => acc + txn.amountPaid,
      0
    );
    const totalCollections = {
      amount: formatAmountWithoutSymbol(totalCollectionsValue),
      count: transactions.length,
    };

    return totalCollections;
  };

  const salePayload = prepareSalePayload(bookings);
  const itemsPayload = prepareItemsPayload(bookings);
  const collectionsPayload = prepareCollectionPayload(transactions);

  const summary = {
    storeName: storeUser.storeId.area,
    username: storeUser.userId.username,
    currentDate: formatDateTime(today),
    totalSales: salePayload.totalSales,
    totalCollections: collectionsPayload,
    bookingOrders: salePayload.bookingOrders,
    itemsSold: itemsPayload,
  };
  const filename = `${storeUser.storeId.name}_${storeUser.storeId.area}_${today}_Report.pdf`;
  const path = `./pdfs/${filename}`;
  await generateAnalyticsPDF(summary, path);

  return [path, filename, summary];
}

function constructStoreSummaryMessageData({ storeUser, today }) {
  const messageData = {
    username: storeUser.userId.username,
    date: formatDateTime(today),
    storeName: storeUser.storeId.name,
    storeArea: storeUser.storeId.area,
  };
  return messageData;
}

async function notifyDailyStoreSummaryPdf(analytics) {
  try {
    const [path, filename, summaryData] = await constructStoreSummaryPdfData(
      analytics
    );
    const messageData = constructStoreSummaryMessageData(analytics);
    const phone = analytics.storeUser.userId.phone;
    const status = await sendWhatsAppMessageWithDocument(
      path,
      filename,
      phone,
      messageData,
      process.env.TEMPLATE_DAILY_SUMMARY,
      process.env.LOCALE_EN_US
    );
    return summaryData;
  } catch (error) {
    console.log("Notify Payment Summary Error", error);
    return false;
  }
}

module.exports = {
  notifyBookingConfirmation,
  notifyPaymentConfirmation,
  notifyDailyStoreSummaryPdf,
};
