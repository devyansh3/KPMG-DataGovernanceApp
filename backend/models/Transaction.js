// models/Transaction.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
    transactionId: { type: String, required: true, unique: true },
    booking: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
    bookingInfo: {
        id: { type: String, required: true },
        items: [{ name: String, quantity: Number, price: Number }],
        totalPrice: Number,
        createdAt: { type: Date, default: Date.now }
    },
    customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    amountPaid: { type: Number, required: true },
    settledAmount: { type: Number, default: 0 }, // Settled amount if any
    tax: {
        type: {
            type: String,
            enum: ['inclusive', 'exclusive'],
            default: null
        },
        value: { type: Number, default: 0 }
    },
    paymentType: { type: String },
    date: { type: Date, default: Date.now }
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;
