import React, { useEffect, useState } from "react";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { getAllEvent } from "../../../api/eventApi";
import { insertSurveyForm } from "../../../api/surveyApi";

import LoadingComponent from "../../../components/LoadingComponent/LoadingComponent";
const SurveyForm = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [surveyForm, setSurveyForm] = useState({
    name: "",
    eventId: "",
    createBy: "",
    questionDetailRequests: [
      {
        no: 0,
        question: "",
        answerType: 0,
        ratingMax: 0,
      },
    ],
  });

  useEffect(() => {
    const fetchEvents = async () => {
      const data = await getAllEvent(1, 10);
      if (data) {
        setEvents(data.result.items);
      }
      setIsLoading(false);
    };

    fetchEvents();
  }, []);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setSurveyForm({ ...surveyForm, eventId: event.id });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setSurveyForm({ ...surveyForm, [name]: value });
  };

  const handleQuestionChange = (index, e) => {
    const { name, value } = e.target;
    const questions = [...surveyForm.questionDetailRequests];
    questions[index][name] = value;
    setSurveyForm({ ...surveyForm, questionDetailRequests: questions });
  };

  const addQuestion = () => {
    setSurveyForm({
      ...surveyForm,
      questionDetailRequests: [
        ...surveyForm.questionDetailRequests,
        {
          no: surveyForm.questionDetailRequests.length,
          question: "",
          answerType: 0,
          ratingMax: 0,
        },
      ],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await insertSurveyForm(surveyForm);
    if (result && result.isSuccess) {
      alert("Survey inserted successfully");
    } else {
      alert("Error inserting survey");
    }
  };

  if (isLoading) {
    return <LoadingComponent isLoading={true} />;
  }

  return (
    <div className="container mx-auto py-12">
      <h3 className="text-3xl font-bold mb-6">
        Select an Event to Create Survey
      </h3>
      <div className="grid grid-cols-3 gap-4">
        {events &&
          events.length > 0 &&
          events.map((event) => (
            <div
              key={event.id}
              className="border p-4 rounded-lg shadow-lg cursor-pointer"
              onClick={() => handleEventClick(event)}
            >
              <h4 className="text-xl font-bold">{event.name}</h4>
              <p className="text-sm">
                Date: {new Date(event.date).toLocaleDateString()}
              </p>
              <p className="text-sm">Location: {event.location}</p>
            </div>
          ))}
      </div>

      {selectedEvent && (
        <div className="mt-12">
          <h3 className="text-3xl font-bold mb-6">
            Create Survey for {selectedEvent.name}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Survey Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={surveyForm.name}
                onChange={handleFormChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            {surveyForm.questionDetailRequests.map((question, index) => (
              <div key={index} className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor={`question-${index}`}
                >
                  Question {index + 1}
                </label>
                <input
                  type="text"
                  name="question"
                  id={`question-${index}`}
                  value={question.question}
                  onChange={(e) => handleQuestionChange(index, e)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 mt-2"
                  htmlFor={`answerType-${index}`}
                >
                  Answer Type
                </label>
                <input
                  type="number"
                  name="answerType"
                  id={`answerType-${index}`}
                  value={question.answerType}
                  onChange={(e) => handleQuestionChange(index, e)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 mt-2"
                  htmlFor={`ratingMax-${index}`}
                >
                  Rating Max
                </label>
                <input
                  type="number"
                  name="ratingMax"
                  id={`ratingMax-${index}`}
                  value={question.ratingMax}
                  onChange={(e) => handleQuestionChange(index, e)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addQuestion}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
            >
              Add Question
            </button>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Submit Survey
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SurveyForm;
