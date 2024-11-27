import React, { useState } from "react";

const questionsData = [
  {
    id: 1,
    question:
      "Are Data governance functions currently performed for at least one project?",
    description:
      "Data Governance Functions refers to Data Governed processes...",
    marks: 1,
    subQuestions: [
      {
        id: 1.1,
        question: "Is there any Policy defined for specific Project?",
      },
      {
        id: 1.2,
        question: "Is there any Ownership defined for various systems used?",
      },
    ],
  },
  {
    id: 2,
    question:
      "Is there a review process established to evaluate and improve data?",
    description: "Review process involves getting feedback...",
    marks: 2,
    subQuestions: [
      {
        id: 2.1,
        question:
          "Is there any community within the organization to review the DG Process?",
      },
      { id: 2.2, question: "Does Data Governance follow defined Policies?" },
    ],
  },
  {
    id: 3,
    question: "Is data security actively monitored within the organization?",
    description:
      "This involves monitoring access control, audits, and user management...",
    marks: 3,
    subQuestions: [
      {
        id: 3.1,
        question: "Are data breach protocols in place?",
      },
      { id: 3.2, question: "Is there an active incident response team?" },
    ],
  },
  {
    id: 4,
    question:
      "Does your organization have a centralized data catalog system in place?",
    description:
      "A data catalog system helps in centralizing data discovery processes...",
    marks: 4,
    subQuestions: [
      {
        id: 4.1,
        question: "Is the data catalog updated regularly?",
      },
      { id: 4.2, question: "Are users trained to use the data catalog?" },
    ],
  },
];

const DataGovTable = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});

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
              <div key={subQuestion.id} className="mt-6">
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

        {userAnswer === "No" && (
          <p className="mt-4 text-red-600">
            Quiz has ended. Thank you for your responses.
          </p>
        )}
      </div>

      {userAnswer === "Yes" && (
        <button
          className="mt-5 bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700"
          onClick={handleNext}
        >
          {currentQuestionIndex + 1 < questionsData.length ? "Next" : "Finish"}
        </button>
      )}
    </div>
  );
};

export default DataGovTable;
