const mongoose = require("mongoose");
const Counter = require("../models/Counter");

class CounterDao {
    async updateCounter(storeId, counterType, session) {
        if (!storeId || !counterType) {
            throw new Error('storeId and counterType are required.');
        }

        const query = { storeId: new mongoose.Types.ObjectId(storeId) };
        const update = { $inc: { [counterType]: 1 } };
        const options = { new: true, upsert: true };

        // Pass the session to ensure it's part of the transaction
        const counter = await Counter.findOneAndUpdate(query, update, { ...options, session });

        return counter[counterType];
    }


    async delete(filter = {}) {
        try {
            let result = await Counter.deleteMany(filter);
            return result;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = CounterDao;
