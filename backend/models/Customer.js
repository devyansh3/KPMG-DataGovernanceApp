// models/Customer.js
const mongoose = require('mongoose');

const measurementSchema = new mongoose.Schema({
    type: { type: String },
    data: { type: mongoose.Schema.Types.Mixed }
});

const customerSchema = new mongoose.Schema({
    customerId: { type: String, required: true, },
    name: { type: String },
    phone: { type: String, required: true, unique: true },
    city: { type: String },
    email: { type: String },
    address: { type: String },
    storeIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true }],
    balance: { type: Number, default: 0 },  // New field to store cumulative balance
    measurements: [measurementSchema], // New field to store measurements
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Customer', customerSchema);
