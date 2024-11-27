const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

const WHATSAPP_API_TOKEN = process.env.USER_ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const VERSION = process.env.API_VERSION;
const ENABLE_CUSTOMER_WHATSAPP =
  process.env.ENABLE_CUSTOMER_WHATSAPP === "true";
const ENABLE_ADMIN_WHATSAPP = process.env.ENABLE_ADMIN_WHATSAPP === "true";

function constructWhatsAppPayloadForTemplate(
  phone,
  payloadData,
  template,
  locale
) {
  const parameters = Object.values(payloadData).map((value) => ({
    type: "text",
    text: value,
  }));
  return {
    messaging_product: "whatsapp",
    to: `91${phone}`,
    type: "template",
    template: {
      name: template,
      language: {
        code: locale,
      },
      components: [
        {
          type: "body",
          parameters: parameters,
        },
      ],
    },
  };
}

function constructWhatsAppPayloadForTemplateWithDocument(
  payloadData,
  locale,
  template,
  phone,
  filename,
  documentId
) {
  console.log("PAYLOAD", payloadData);
  const parameters = Object.values(payloadData).map((value) => ({
    type: "text",
    text: value,
  }));
  return {
    messaging_product: "whatsapp",
    to: `91${phone}`,
    type: "template",
    template: {
      name: template,
      language: {
        code: locale,
      },
      components: [
        {
          type: "header", // The header expects a document
          parameters: [
            {
              type: "document", // Specify the document as the header
              document: {
                id: documentId, // The document ID obtained from the API upload
                filename: filename, // The filename (e.g., "Daily_Sales_Summary.pdf")
              },
            },
          ],
        },
        {
          type: "body",
          parameters: parameters,
        },
      ],
    },
  };
}

// Function to send the WhatsApp message using the constructed payload
async function sendWhatsAppMessageTemplate(
  phone,
  payloadData,
  template,
  locale
) {
  console.log("sendWhatsAppMessageTemplate called with params:", {
    phone: phone,
    payloadData: payloadData,
    template: template,
    locale: locale,
  });
  // Construct the WhatsApp message payload
  const payload = constructWhatsAppPayloadForTemplate(
    phone,
    payloadData,
    template,
    locale
  );
  console.log("Request Body:", payload);
  if (!ENABLE_CUSTOMER_WHATSAPP) {
    console.log("Whatsapp Service Disabled in Environment");
    return;
  }
  try {
    // Make the API request to WhatsApp
    const response = await axios.post(
      `https://graph.facebook.com/${VERSION}/${PHONE_NUMBER_ID}/messages`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("WhatsApp message sent:", response.data);
  } catch (error) {
    console.error(
      "Error sending WhatsApp message:",
      error.response ? error.response.data : error.message
    );
    if (error.response) {
      console.log("Status Code:", error.response.status);
    }
    throw new Error(error);
  }
}

// Function to upload the PDF to WhatsApp Cloud API
const uploadPDFToWhatsApp = async (filePath) => {
  const form = new FormData();
  form.append("file", fs.createReadStream(filePath));
  form.append("messaging_product", "whatsapp");

  const response = await axios.post(
    `https://graph.facebook.com/${VERSION}/${PHONE_NUMBER_ID}/media`,
    form,
    {
      headers: {
        Authorization: `Bearer ${WHATSAPP_API_TOKEN}`,
        ...form.getHeaders(),
      },
    }
  );
  console.log("UPLOAD RES", response.data);
  return response.data.id;
};

// Function to send the PDF via WhatsApp Cloud API
const sendPDFToUser = async (
  payloadData,
  locale,
  template,
  phone,
  filename,
  documentId
) => {
  // Construct the WhatsApp message payload
  const payload = constructWhatsAppPayloadForTemplateWithDocument(
    payloadData,
    locale,
    template,
    phone,
    filename,
    documentId
  );

  const response = await axios.post(
    `https://graph.facebook.com/${VERSION}/${PHONE_NUMBER_ID}/messages`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${WHATSAPP_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
  console.log("MESS RES", response.data);
};

// Endpoint to receive user data, generate PDF, and send via WhatsApp
async function sendWhatsAppMessageWithDocument(
  documentPath,
  filename,
  phone,
  messageData,
  template,
  locale
) {
  try {
    if (!ENABLE_ADMIN_WHATSAPP) {
      console.log("Whatsapp Service Disabled for Admin in Environment");
      return false;
    }
    // Upload the PDF to WhatsApp Cloud API and get the document ID
    const documentId = await uploadPDFToWhatsApp(documentPath);
    // Send the PDF to the user via WhatsApp Cloud API
    await sendPDFToUser(
      messageData,
      locale,
      template,
      phone,
      filename,
      documentId
    );
    return true;
    // Respond with success
  } catch (error) {
    console.error(error);
    return false;
  } finally {
    // Clean up the generated PDF after sending
    // fs.unlinkSync(pdfPath);
  }
}

module.exports = {
  sendWhatsAppMessageTemplate,
  sendWhatsAppMessageWithDocument,
};
