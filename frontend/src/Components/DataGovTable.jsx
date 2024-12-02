import React, { useState, useEffect } from "react";
import axios from "axios";

const DataGovTable = () => {
  const [questionsData, setQuestionsData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});

  useEffect(() => {
    // Fetch data governance questions on component mount
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
    const updatedResponses = { ...responses };
    updatedResponses[currentQuestionIndex] = {
      ...updatedResponses[currentQuestionIndex],
      answer: option,
    };
    setResponses(updatedResponses);
  };

  const handleTextAreaChange = (field, value) => {
    const updatedResponses = { ...responses };
    if (!updatedResponses[currentQuestionIndex])
      updatedResponses[currentQuestionIndex] = {};
    updatedResponses[currentQuestionIndex][field] = value;
    setResponses(updatedResponses);
  };

  const handleNext = () => {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < questionsData.length) {
      setCurrentQuestionIndex(nextIndex);
    } else {
      console.log("Quiz Finished. Responses: ", responses);
      alert("Quiz Completed. Thank you!");
    }
  };

  if (questionsData.length === 0) {
    return <p>Loading questions...</p>;
  }

  const currentQuestion = questionsData[currentQuestionIndex];
  const userAnswer = responses[currentQuestionIndex]?.answer;

  return (
    <div className="p-5 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800">
        Data Governance Questionnaire
      </h1>
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
            value={userAnswer || ""}
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
                value={responses[currentQuestionIndex]?.explanation || ""}
                onChange={(e) =>
                  handleTextAreaChange("explanation", e.target.value)
                }
              />
            </div>

            {currentQuestion.subQuestions.map((subQuestion) => (
              <div key={subQuestion._id} className="mt-6">
                <h3 className="text-sm font-semibold">
                  {subQuestion.question}
                </h3>
                <textarea
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  rows="2"
                  placeholder="Your answer here..."
                  value={
                    responses[currentQuestionIndex]?.[
                      `sub_${subQuestion.id}`
                    ] || ""
                  }
                  onChange={(e) =>
                    handleTextAreaChange(
                      `sub_${subQuestion.id}`,
                      e.target.value
                    )
                  }
                />
              </div>
            ))}
          </>
        )}

        <button
          className="mt-5 bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700"
          onClick={handleNext}
        >
          {currentQuestionIndex + 1 < questionsData.length ? "Next" : "Finish"}
        </button>
      </div>
    </div>
  );
};

export default DataGovTable;
