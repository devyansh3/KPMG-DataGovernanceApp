// models/counter.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CounterSchema = new Schema({
    storeId: { type: Schema.Types.ObjectId, required: true, unique: true },
    booking: { type: Number, required: true, default: 0 },
    customer: { type: Number, required: true, default: 0 },
    transaction: { type: Number, required: true, default: 0 }
}, {
    timestamps: true
});

CounterSchema.index({ storeId: 1 }, { unique: true });

module.exports = mongoose.model('Counter', CounterSchema);
