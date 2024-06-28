import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Form, Input, Select, Button, message } from "antd";
import { getAllEvent } from "../../api/eventApi";
import { insertSurveyForm } from "../../api/surveyApi";

const { Option } = Select;

const QuestionSurvey = () => {
  const [form] = Form.useForm();
  const [events, setEvents] = useState([]);
  const user = useSelector((state) => state.user.user || {});
  const fetchEvents = async () => {
    try {
      const eventsData = await getAllEvent(1, 100);
      setEvents(eventsData.result.items);
    } catch (error) {
      message.error("Lỗi khi tải danh sách sự kiện: " + error.message);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSubmit = async (values) => {
    try {
      console.log(values);
      const data = {
        name: values.name,
        eventId: values.eventId,
        createBy: user.id, // Assuming 'user' is defined and accessible in the scope
        questionDetailRequests: values.questionDetailRequests.map(
          (question, index) => ({
            no: index + 1,
            question: question.question,
            answerType: question.answerType,
            ratingMax: question.ratingMax,
          })
        ),
      };
      const response = await insertSurveyForm(data);
      if (response?.isSuccess) {
        message.success("Thêm biểu mẫu khảo sát thành công");
      }
    } catch (error) {
      message.error("Lỗi khi thêm biểu mẫu khảo sát: " + error.message);
    }
  };

  return (
    <div className="w-1/2 max-w-4xl mx-auto p-4">
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="eventId" label="Event" rules={[{ required: true }]}>
          <Select>
            {events.map((event) => (
              <Option key={event.id} value={event.id}>
                {event.title}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.List name="questionDetailRequests">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} style={{ marginBottom: 8 }}>
                  <Form.Item
                    {...restField}
                    name={[name, "question"]}
                    rules={[{ required: true, message: "Missing question" }]}
                  >
                    <Input placeholder="Question" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "answerType"]}
                    rules={[{ required: true, message: "Missing answer type" }]}
                  >
                    <Select placeholder="Select answer type">
                      <Option value={0}>Type 0</Option>
                      <Option value={1}>Type 1</Option>
                      {/* Add more types as needed */}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "ratingMax"]}
                    rules={[{ required: true, message: "Missing rating max" }]}
                  >
                    <Input placeholder="Rating Max" type="number" />
                  </Form.Item>
                  <Button onClick={() => remove(name)} type="danger">
                    Remove
                  </Button>
                </div>
              ))}
              <Button type="dashed" onClick={() => add()} block>
                Add Question
              </Button>
            </>
          )}
        </Form.List>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default QuestionSurvey;
