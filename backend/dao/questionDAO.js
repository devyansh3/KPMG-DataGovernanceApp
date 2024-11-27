const Questions = require("../models/Questions");

exports.createQuestion = async (questionData) => {
    const question = new Questions(questionData);
    return await question.save();
};

exports.findQuestionsByTopic = async (topic) => {
    return await Question.find({ topic });
};
