const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subQuestionSchema = new Schema({
    id: { type: String, required: true },
    question: { type: String, required: true },
});

const questionSchema = new Schema({
    id: { type: Number, required: true },
    question: { type: String, required: true },
    description: { type: String },
    marks: { type: Number, required: true },
    subQuestions: [subQuestionSchema], // Array of sub-questions
    topic: { type: String, required: true }, // For identifying the topic (e.g., "Data Governance")
});

module.exports = mongoose.model('Question', questionSchema);
