import { Button, Form, Input, Select, message } from "antd";
import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { getAllEvent } from "../../api/eventApi";
import { insertSurveyForm } from "../../api/surveyApi";

const { Option } = Select;

const QuestionSurvey = () => {
  const [formData, setFormData] = useState({
    name: "",
    eventId: "",
    createdBy: "",
    questionDetailRequests: [
      {
        no: "",
        question: "",
        answerType: "",
        ratingMax: "",
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
      message.error("Lỗi khi tải danh sách sự kiện: " + error.message);
    }
  };

  const User = useSelector((state) => state.user.user || {});
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

  const handleSubmit = async () => {
    try {
      const result = await insertSurveyForm(formData);
      message.success("Biểu mẫu khảo sát đã được thêm thành công");
    } catch (error) {
      message.error("Lỗi khi thêm biểu mẫu khảo sát: " + error.message);
    }
  };

  const handleEventChange = (value) => {
    setSelectedEventId(value);
  };

  const handleDeleteQuestion = (index) => {
    const updatedQuestions = [...formData.questionDetailRequests];
    updatedQuestions.splice(index, 1);
    setFormData({ ...formData, questionDetailRequests: updatedQuestions });
  };

  return (
    <div className="w1/2 max-w-4xl mx-auto p-4">
      <Form
        onFinish={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        layout="vertical"
      >
        <Form.Item label="Tên Khảo Sát" required>
          <Input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter survey name"
          />
        </Form.Item>

        <Form.Item label="Sự kiện" required>
          <Select
            value={selectedEventId}
            onChange={handleEventChange}
            placeholder="Chọn sự kiện"
          >
            {events.map((event) => (
              <Option key={event.id} value={event.id}>
                {event.title}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Người Tạo" required>
          <Input
            name="createdBy"
            defaultValue={User.id}
            onChange={handleInputChange}
            placeholder="Enter creator's name"
          />
        </Form.Item>

        {formData.questionDetailRequests.map((question, index) => (
          <div key={index} className="mb-4">
            <Form.Item
              label={`Câu hỏi #${index + 1}`}
              required
              style={{ position: "relative" }}
            >
              <Input
                name="question"
                value={question.question}
                onChange={(event) => handleQuestionChange(index, event)}
                placeholder="Nhập câu hỏi"
              />
              <Button
                type="danger"
                icon={<FaTrash />}
                onClick={() => handleDeleteQuestion(index)}
                style={{ position: "absolute", top: 0, right: 0 }}
              />
            </Form.Item>

            <Form.Item label="Hình thức trả lời" required>
              <Select
                name="answerType"
                value={question.answerType}
                onChange={(value) =>
                  handleQuestionChange(index, {
                    target: { name: "answerType", value },
                  })
                }
                placeholder="Select Answer Type"
              >
                <Option value="TEXT">Text</Option>
                <Option value="RATING">Rating</Option>
                <Option value="DATE">Date</Option>
              </Select>
            </Form.Item>

            {question.answerType === "RATING" && (
              <Form.Item label="Đánh giá tối đa" required>
                <Input
                  type="number"
                  name="ratingMax"
                  value={question.ratingMax}
                  onChange={(event) => handleQuestionChange(index, event)}
                  placeholder="Đánh giá tối đa"
                />
              </Form.Item>
            )}
          </div>
        ))}

        <Form.Item>
          <Button
            type="dashed"
            onClick={() =>
              setFormData({
                ...formData,
                questionDetailRequests: [
                  ...formData.questionDetailRequests,
                  { no: formData.questionDetailRequests.length + 1 },
                ],
              })
            }
            block
          >
            Thêm Câu Hỏi
          </Button>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Tạo
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default QuestionSurvey;
