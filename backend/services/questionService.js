const { createQuestion, findQuestionsByTopic } = require("../dao/questionDAO");

exports.addQuestion = async (topic, questionData) => {
    questionData.topic = topic;
    return await createQuestion(questionData);
};

exports.getQuestions = async (topic) => {
    return await findQuestionsByTopic(topic);
};
