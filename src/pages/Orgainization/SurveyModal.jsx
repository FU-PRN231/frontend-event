import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { getAccountById } from "../../api/accountApi";
import { getAllEvent } from "../../api/eventApi";
import { getAllSurveys, insertSurveyForm } from "../../api/surveyApi";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";

const SurveyModal = () => {
  const [surveys, setSurveys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingSurvey, setIsCreatingSurvey] = useState(false);
  const [name, setName] = useState("");
  const [questions, setQuestions] = useState([
    { no: "", question: "", answerType: "", ratingMax: "" },
  ]);
  const [submitResult, setSubmitResult] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [accountDetails, setAccountDetails] = useState({});
  const [isLoadingAccountDetails, setIsLoadingAccountDetails] = useState(false);

  const fetchAccountDetails = async (accountId) => {
    try {
      setIsLoadingAccountDetails(true);
      const account = await getAccountById(accountId);
      return account;
    } catch (error) {
      console.error("Error fetching account details:", error);
      return null;
    } finally {
      setIsLoadingAccountDetails(false);
    }
  };

  useEffect(() => {
    fetchSurveys();
    fetchEvents();
  }, []);

  const fetchSurveys = async () => {
    setIsLoading(true);
    try {
      const data = await getAllSurveys();
      setSurveys(data.result || []);

      const creatorIds = data.result.map((survey) => survey.createBy);
      const accountsPromises = creatorIds.map((id) => getAccountById(id));
      const accountsData = await Promise.all(accountsPromises);

      const accountDetailsMap = {};
      accountsData.forEach((account) => {
        accountDetailsMap[account.id] = account;
      });

      setAccountDetails(accountDetailsMap);
    } catch (error) {
      console.error("Error fetching surveys:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const eventsData = await getAllEvent(1, 100);
      setEvents(eventsData.result.items);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleCreateSurvey = async (e) => {
    e.preventDefault();
    setIsCreatingSurvey(true);
    try {
      const formData = {
        name,
        eventId: selectedEventId,
        createBy: "string",
        questionDetailRequests: questions,
      };

      const response = await insertSurveyForm(formData);

      if (response && response.isSuccess) {
        setSubmitResult(response);
        fetchSurveys();
        setName("");
        setSelectedEventId("");
        setQuestions([{ no: "", question: "", answerType: "", ratingMax: "" }]);
      } else {
        console.error("Error creating survey:", response);
        if (response && response.messages) {
          console.error("Validation errors:", response.messages);
        } else if (!response) {
          setSubmitResult(null);
        }
      }
    } catch (error) {
      console.error("Error creating survey:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
      }
    } finally {
      setIsCreatingSurvey(false);
    }
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    const newQuestion = {
      no: questions.length,
      question: "",
      answerType: 0,
      ratingMax: 0,
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  if (isLoading) {
    return <LoadingComponent isLoading={true} />;
  }

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-3xl font-bold mb-4">Surveys</h2>
      <div className="flex">
        <div className="w-1/2 pr-4">
          <div className="grid grid-cols-1 gap-4">
            {surveys.map((survey) => (
              <div
                key={survey.id}
                className="border p-4 rounded-lg shadow-lg mb-4"
              >
                <h3 className="text-lg font-bold">{survey.survey.name}</h3>
                <p className="text-sm text-gray-600">
                  Created by:{" "}
                  {accountDetails[survey.survey.createBy]?.name || "Unknown"}
                </p>
                <p className="text-sm text-gray-600">
                  Event:{" "}
                  {events.find((event) => event.id === survey.survey.eventId)
                    ?.title || "Unknown Event"}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="w-1/2 pl-4">
          <div className="border border-gray-300 p-6 rounded-lg">
            <h2 className="text-3xl font-bold mb-4">Create New Survey</h2>
            <form onSubmit={handleCreateSurvey}>
              <div className="mb-4">
                <label
                  htmlFor="surveyName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Survey Name:
                </label>
                <input
                  type="text"
                  id="surveyName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="event"
                >
                  Select Event
                </label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="event"
                  name="event"
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                >
                  <option value="">Select Event</option>
                  {events &&
                    events.map((event) => (
                      <option key={event.id} value={event.id}>
                        {event.title}
                      </option>
                    ))}
                </select>
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-bold mb-2">Questions:</h3>
                {questions.map((question, index) => (
                  <div key={index} className="mb-2 flex items-center">
                    <label
                      htmlFor={`question-${index}`}
                      className="block text-sm font-medium text-gray-700 mr-2"
                    >
                      Question{index + 1}:
                    </label>
                    <input
                      type="text"
                      id={`question-${index}`}
                      value={question.question}
                      onChange={(e) =>
                        handleQuestionChange(index, "question", e.target.value)
                      }
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeQuestion(index)}
                      className="ml-2 inline-flex items-center px-2.5 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <FontAwesomeIcon icon={faTimes} className="h-3 w-3" />
                      <span className="ml-1">Remove</span>
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={addQuestion}
                  className="mt-2 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add Question
                </button>
                <button
                  type="submit"
                  disabled={isCreatingSurvey}
                  className="mt-2 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {isCreatingSurvey ? "Creating Survey..." : "Create Survey"}
                </button>
              </div>
            </form>
            {submitResult && (
              <div className="mt-4">
                <p className="text-sm font-medium">
                  Submission Result:{" "}
                  <span
                    className={`${
                      submitResult.isSuccess ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {submitResult.isSuccess ? "Success" : "Failed"}
                  </span>
                </p>
                {submitResult.messages.map((message, index) => (
                  <p key={index} className="text-sm text-gray-600">
                    {message}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyModal;
