const { createResponse } = require("../dao/responseDAO");

exports.saveResponses = async (responseData) => {
    return await createResponse(responseData);
};
