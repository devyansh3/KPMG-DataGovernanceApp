const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const nodemailer = require('nodemailer');

async function generatePdf(bookingDetails) {
    console.log(JSON.stringify(bookingDetails) + "received booking details");

    const pdfDoc = await PDFDocument.create();
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const createPage = (pdfDoc) => {
        const page = pdfDoc.addPage();
        const { width, height } = page.getSize();
        return { page, width, height };
    };

    let { page, width, height } = createPage(pdfDoc);
    let yPosition = height - 50;
    const fontSize = 12;
    const lineHeight = 20;

    // Function to draw text on the page and handle pagination
    const drawText = (text, options) => {
        if (yPosition < 50) {
            ({ page, width, height } = createPage(pdfDoc));
            yPosition = height - 50;
        }
        page.drawText(text, options);
    };

    // Function to draw table rows with validation and handle pagination
    const drawRow = (columns) => {
        let xPosition = 50;
        columns.forEach((column) => {
            const text = column !== null && column !== undefined ? String(column) : 'N/A';
            drawText(text, {
                x: xPosition,
                y: yPosition,
                size: fontSize,
                font: helveticaFont,
                color: rgb(0, 0, 0),
            });
            xPosition += 150; // Adjust column width as needed
        });
        yPosition -= lineHeight;
    };

    // Add Application Name
    drawText('Tailorify', {
        x: 50,
        y: yPosition,
        size: 20,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    });

    yPosition -= 40;

    // Section 1: Selected Items
    drawText('Selected Items:', {
        x: 50,
        y: yPosition,
        size: fontSize,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    });

    yPosition -= lineHeight;
    drawRow(bookingDetails.selectedItems);

    yPosition -= lineHeight;

    // Section 2: Measurements
    bookingDetails.measurements.forEach((measurement) => {
        drawText(`${measurement.type}:`, {
            x: 50,
            y: yPosition,
            size: fontSize,
            font: helveticaFont,
            color: rgb(0, 0, 0),
        });

        yPosition -= lineHeight;
        Object.keys(measurement.data).forEach((key) => {
            drawRow([`${key}:`, measurement.data[key]]);
        });
        yPosition -= lineHeight;
    });

    yPosition -= lineHeight;

    // Section 3: Order Summary
    drawText('Order Summary:', {
        x: 50,
        y: yPosition,
        size: fontSize,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    });

    yPosition -= lineHeight;
    drawRow(['Item', 'Quantity', 'Price']);

    bookingDetails.orderSummary.items.forEach((item) => {
        drawRow([item.name, item.quantity?.toString() || 'N/A', `Rs ${item.price || 'N/A'}`]);
    });

    yPosition -= lineHeight;

    // Section 4: Customer Details
    drawText('Customer Details:', {
        x: 50,
        y: yPosition,
        size: fontSize,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    });

    yPosition -= lineHeight;
    drawRow(['Name:', bookingDetails.details.name || 'N/A']);
    drawRow(['Email:', bookingDetails.details.email || 'N/A']);
    drawRow(['Phone:', bookingDetails.details.phone || 'N/A']);
    drawRow(['Address:', bookingDetails.details.address || 'N/A']);

    yPosition -= lineHeight;

    // Section 5: Transaction Details
    drawText('Transaction Details:', {
        x: 50,
        y: yPosition,
        size: fontSize,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    });

    yPosition -= lineHeight;
    drawRow(['Total Price:', `Rs ${bookingDetails.transaction.totalPrice || 'N/A'}`]);
    drawRow(['Amount Paid:', `Rs ${bookingDetails.transaction.amountPaid || 'N/A'}`]);
    drawRow(['Balance Amount:', `Rs ${bookingDetails.transaction.balanceAmount || 'N/A'}`]);
    // drawRow(['Payment Type:', bookingDetails.transaction.paymentType || 'N/A']);

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
}

async function sendEmailWithPdf(bookingData) {
    try {
        // Generate the PDF
        const pdfBytes = await generatePdf(bookingData);

        // Create a transporter object using your SMTP server details
        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER, // Your Gmail user
                pass: process.env.EMAIL_PASS, // Your Gmail password
            },
            tls: {
                rejectUnauthorized: false // Disable TLS verification
            }
        });

        // Send email with PDF attachment
        let info = await transporter.sendMail({
            from: '"Your Store" <your-email@gmail.com>', // Sender address
            to: bookingData.details.email, // Receiver's email
            subject: 'Your Booking Details',
            text: 'Please find attached your booking details.',
            attachments: [
                {
                    filename: 'booking-details.pdf',
                    content: pdfBytes,
                    contentType: 'application/pdf',
                },
            ],
        });

        console.log('Message sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

module.exports = { sendEmailWithPdf };
