import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa"; // Import FontAwesome trash icon
import { getAllEvent } from "../../api/eventApi";
import { insertSurveyForm } from "../../api/surveyApi";

const QuestionSurvey = () => {
  const [formData, setFormData] = useState({
    name: "",
    eventId: "",
    createdBy: "",
    questionDetailRequests: [
      {
        no: "",
        question: "",
        answerType: null,
        ratingMax: null,
      },
    ],
  });
  const [selectedEventId, setSelectedEventId] = useState("");
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    try {
      const eventsData = await getAllEvent(1, 100);
      setEvents(eventsData.result.items);
    } catch (error) {
      console.error("Lỗi khi tải danh sách sự kiện:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleInputChange = (event, index) => {
    const { name, value } = event.target;
    if (index !== undefined) {
      const updatedQuestions = [...formData.questionDetailRequests];
      updatedQuestions[index][name] = value;
      setFormData({ ...formData, questionDetailRequests: updatedQuestions });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleQuestionChange = (index, event) => {
    const { name, value } = event.target;
    const updatedQuestions = [...formData.questionDetailRequests];
    updatedQuestions[index][name] = value;
    setFormData({ ...formData, questionDetailRequests: updatedQuestions });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await insertSurveyForm(formData);
      console.log("Biểu mẫu khảo sát đã được thêm thành công:", result);
    } catch (error) {
      console.error("Lỗi khi thêm biểu mẫu khảo sát:", error);
    }
  };

  const handleEventChange = (e) => {
    const selectedId = e.target.value;
    setSelectedEventId(selectedId);
  };

  const handleDeleteQuestion = (index) => {
    const updatedQuestions = [...formData.questionDetailRequests];
    updatedQuestions.splice(index, 1);
    setFormData({ ...formData, questionDetailRequests: updatedQuestions });
  };

  return (
    <div className="w1/2 max-w-4xl mx-auto p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Tên Khảo Sát:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter survey name"
              required
            />
          </label>
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="event"
          >
            Sự kiện
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="event"
            name="event"
            value={selectedEventId}
            onChange={handleEventChange}
          >
            <option value="">Chọn sự kiện</option>
            {events &&
              events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title}
                </option>
              ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Người Tạo:
            <input
              type="text"
              name="createdBy"
              value={formData.createdBy}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter creator's name"
              required
            />
          </label>
        </div>

        {/* Question Detail Fields */}
        {formData.questionDetailRequests.map((question, index) => (
          <div key={index} className="mb-4">
            {/* Delete Button with Trash Icon */}

            <label className="block text-gray-700 text-sm font-bold mb-2">
              Câu hỏi #{index + 1}:
              <input
                type="text"
                name="question"
                value={question.question}
                onChange={(event) => handleQuestionChange(index, event)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Nhập câu hỏi"
                required
              />{" "}
              <button
                type="button"
                onClick={() => handleDeleteQuestion(index)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-end"
              >
                <FaTrash className="inline-block mr-2" />
              </button>
            </label>

            <label className="block text-gray-700 text-sm font-bold mb-2">
              Hình thức trả lời:
              <select
                name="answerType"
                value={question.answerType || ""}
                onChange={(event) => handleQuestionChange(index, event)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
                <option value="">Select Answer Type</option>
                <option value="TEXT">Text</option>
                <option value="RATING">Rating</option>
                <option value="DATE">Date</option>
              </select>
            </label>

            {question.answerType === "RATING" && (
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Đánh gia tối đa:
                <input
                  type="number"
                  name="ratingMax"
                  value={question.ratingMax || ""}
                  onChange={(event) => handleQuestionChange(index, event)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Đánh giá tối đa"
                  required
                />
              </label>
            )}
          </div>
        ))}

        <div className="mb-4">
          <button
            type="button"
            onClick={() =>
              setFormData({
                ...formData,
                questionDetailRequests: [
                  ...formData.questionDetailRequests,
                  { no: formData.questionDetailRequests.length },
                ],
              })
            }
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Thêm Câu Hỏi
          </button>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Thêm Câu Hỏi
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuestionSurvey;
