const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    bookingId: { type: String, required: true, unique: true },
    customer: { type: Schema.Types.ObjectId, ref: 'Customer' },
    storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
    measurements: [
        {
            type: { type: String },
            data: { type: mongoose.Schema.Types.Mixed }
        }
    ],
    selectedItems: [String],
    orderSummary: {
        items: [{ name: String, quantity: Number, price: Number, key: Number, _id: false }],
        taxRate: Number,
        trialDate: { type: Date, default: null },
        trialTime: { type: String, required: false },
        deliveryDate: { type: Date, default: null },
        deliveryTime: { type: String, required: false },
        totalPrice: Number,
        balance: Number, // remove  balance
        amountPaid: { type: Number, default: 0 }, // Amount paid so far
        settledAmount: { type: Number, default: 0 }, // Amount settled
        tax: {
            type: {
                type: String,
                enum: ['inclusive', 'exclusive'],
                default: null
            },
            value: { type: Number, default: 0 }
        },
    },
    details: {
        name: String,
        email: String,
        city: String,
        phone: String,
        address: String,
    },
    isBalanceSettled: { type: Boolean, default: false },
    status: {
        type: String,
        required: true,
        enum: ['Open', 'Trial Done', 'Delivery Done', 'Draft', 'Cancelled']
    },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
});



module.exports = mongoose.model('Booking', bookingSchema);
