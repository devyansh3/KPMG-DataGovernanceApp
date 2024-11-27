const { addQuestion, getQuestions } = require("../services/questionService");

exports.addQuestion = async (req, res) => {
    try {
        const topic = req.params.topic;
        const questionData = req.body;
        const newQuestion = await addQuestion(topic, questionData);
        res.status(201).json(newQuestion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getQuestions = async (req, res) => {
    try {
        const topic = req.params.topic;
        const questions = await getQuestions(topic);
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
