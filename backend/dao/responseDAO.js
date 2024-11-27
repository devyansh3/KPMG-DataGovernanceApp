const Response = require("../models/Response");

exports.createResponse = async (responseData) => {
    const response = new Response(responseData);
    return await response.save();
};
