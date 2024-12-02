const express = require("express");
const { saveResponses } = require("../controllers/responseController");


const router = express.Router();



// Responses routes
router.post('/:topic', saveResponses);



module.exports = router;
