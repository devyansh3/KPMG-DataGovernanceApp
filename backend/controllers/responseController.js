const { saveResponses } = require("../services/responseService");

exports.saveResponses = async (req, res) => {
    try {
        const responseData = req.body;
        const newResponse = await saveResponses(responseData);
        res.status(201).json(newResponse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
