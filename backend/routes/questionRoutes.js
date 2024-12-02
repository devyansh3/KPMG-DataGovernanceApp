const express = require("express");
const { addQuestion, getQuestions } = require("../controllers/questionController");


const router = express.Router();



// Questions routes
router.post('/:topic', addQuestion);
router.get('/:topic', getQuestions);



module.exports = router;
