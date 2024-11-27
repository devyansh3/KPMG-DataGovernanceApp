const express = require("express");
const { addQuestion, getQuestions } = require("../controllers/questionController");


const router = express.Router();



// Questions routes
router.post('/questions/:topic', addQuestion);
router.get('/questions/:topic', getQuestions);



module.exports = router;
