const Questions = require("../models/Questions");

exports.createQuestion = async (questionData) => {
    console.log("q data", questionData)
    const question = new Questions(questionData);
    return await question.save();
};

exports.findQuestionsByTopic = async (topic) => {
    return await Questions.find({ topic });
};
