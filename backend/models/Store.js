const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storeSchema = new Schema({
    name: { type: String, required: true },
    pincode: { type: String, required: true },
    address: { type: String, required: true },
    area: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Store', storeSchema);
