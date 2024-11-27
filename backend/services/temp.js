const axios = require('axios');

// Access Token from your Meta App (this should be generated via the WhatsApp API dashboard)
const accessToken = 'YOUR_ACCESS_TOKEN';

// Your WhatsApp Business Phone Number ID (found in your app settings on the Meta dashboard)
const phoneNumberId = 'YOUR_PHONE_NUMBER_ID';

// Recipients list
const recipients = [
    { phone: 'recipient_phone_number_1' },  // E.g., +11234567890
    { phone: 'recipient_phone_number_2' },  // E.g., +10987654321
    // Add more recipients here
];

// Send WhatsApp message
// async function sendWhatsAppMessage(phoneNumber, messageText) {
//     const url = https://graph.facebook.com/v17.0/${phoneNumberId}/messages;

//     const payload = {
//         messaging_product: 'whatsapp',
//         to: phoneNumber,
//         type: 'text',
//         text: {
//             body: messageText,
//         },
//     };

//     try {
//         const response = await axios.post(url, payload, {
//             headers: {
//                 Authorization: Bearer ${ accessToken },
//             'Content-Type': 'application/json',
//             },
// });



// Message to be sent
const messageText = 'Hello! This is a message sent from our WhatsApp API integration.';

// Loop through each recipient and send the message
recipients.forEach((recipient) => {
    sendWhatsAppMessage(recipient.phone, messageText);
});