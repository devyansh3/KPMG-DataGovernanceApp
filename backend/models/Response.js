const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const responseSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    topic: { type: String, required: true }, // E.g., "Data Governance"
    answers: [
        {
            questionId: { type: Number, required: true },
            answer: { type: String },
            subAnswers: [
                {
                    subQuestionId: { type: String, required: true },
                    answer: { type: String },
                }
            ],
        }
    ],
    submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Response', responseSchema);
