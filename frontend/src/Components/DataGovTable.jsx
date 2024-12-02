import React, { useState, useEffect } from "react";
import axios from "axios";

const DataGovTable = () => {
  const [questionsData, setQuestionsData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [quizEnded, setQuizEnded] = useState(false); // New state to track quiz completion

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:2001/questions/data-governance"
        );
        setQuestionsData(response.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
        alert("Failed to fetch questions. Please try again later.");
      }
    };

    fetchQuestions();
  }, []);

  const handleOptionChange = (option) => {
    const updatedResponses = [...responses];
    updatedResponses[currentQuestionIndex] = {
      questionId: questionsData[currentQuestionIndex].id,
      answerType: option,
      answer: "",
      subAnswers: [],
    };
    setResponses(updatedResponses);

    if (option === "No") {
      submitResponses(updatedResponses);
      setQuizEnded(true); // Mark quiz as ended
    }
  };

  const handleTextAreaChange = (field, value, subQuestionId = null) => {
    const updatedResponses = [...responses];
    const currentResponse = updatedResponses[currentQuestionIndex] || {
      questionId: questionsData[currentQuestionIndex].id,
      answerType: "",
      answer: "",
      subAnswers: [],
    };

    if (subQuestionId) {
      const subAnswerIndex = currentResponse.subAnswers.findIndex(
        (sub) => sub.subQuestionId === subQuestionId
      );
      if (subAnswerIndex >= 0) {
        currentResponse.subAnswers[subAnswerIndex].answer = value;
      } else {
        currentResponse.subAnswers.push({ subQuestionId, answer: value });
      }
    } else if (field === "answer") {
      currentResponse.answer = value;
    }

    updatedResponses[currentQuestionIndex] = currentResponse;
    setResponses(updatedResponses);
  };

  const handleNext = () => {
    if (currentQuestionIndex + 1 < questionsData.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      submitResponses(responses);
      setQuizEnded(true); // Mark quiz as ended when "Finish" is clicked
    }
  };

  const submitResponses = async (finalResponses) => {
    const payload = {
      userId: "64a1c5d7f1c4a90e6b1e5678",
      topic: "data-governance",
      answers: finalResponses.map((response) => ({
        questionId: response.questionId,
        answerType: response.answerType,
        answer: response.answer,
        subAnswers: response.subAnswers,
      })),
    };

    try {
      await axios.post(
        "http://localhost:2001/responses/data-governance",
        payload
      );
      alert("Responses submitted successfully! Quiz ended.");
    } catch (error) {
      console.error("Error submitting responses:", error);
      alert("Failed to submit responses. Please try again.");
    }
  };

  if (questionsData.length === 0) {
    return <p>Loading questions...</p>;
  }

  const currentQuestion = questionsData[currentQuestionIndex];
  const userAnswer = responses[currentQuestionIndex]?.answerType || "";

  return (
    <div className="p-5 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800">
        Data Governance Questionnaire
      </h1>
      {quizEnded ? (
        <p className="mt-5 text-green-600 font-semibold">
          Quiz ended. Responses submitted successfully!
        </p>
      ) : (
        <div className="mt-5 bg-white shadow-md rounded-lg p-5">
          <h2 className="text-xl font-semibold">{currentQuestion.question}</h2>
          <p className="text-sm text-gray-600 mt-2">
            {currentQuestion.description}
          </p>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Select your answer:
            </label>
            <select
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={userAnswer}
              onChange={(e) => handleOptionChange(e.target.value)}
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          {userAnswer === "Yes" && (
            <>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Explain your answer:
                </label>
                <textarea
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  rows="3"
                  value={responses[currentQuestionIndex]?.answer || ""}
                  onChange={(e) =>
                    handleTextAreaChange("answer", e.target.value)
                  }
                />
              </div>

              {currentQuestion.subQuestions.map((subQuestion) => (
                <div key={subQuestion.id} className="mt-6">
                  <h3 className="text-sm font-semibold">
                    {subQuestion.question}
                  </h3>
                  <textarea
                    className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    rows="2"
                    placeholder="Your answer here..."
                    value={
                      responses[currentQuestionIndex]?.subAnswers.find(
                        (sub) => sub.subQuestionId === subQuestion.id
                      )?.answer || ""
                    }
                    onChange={(e) =>
                      handleTextAreaChange(
                        "subAnswers",
                        e.target.value,
                        subQuestion.id
                      )
                    }
                  />
                </div>
              ))}
            </>
          )}

          {!quizEnded && (
            <button
              className="mt-5 bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700"
              onClick={handleNext}
            >
              {currentQuestionIndex + 1 < questionsData.length
                ? "Next"
                : "Finish"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DataGovTable;
