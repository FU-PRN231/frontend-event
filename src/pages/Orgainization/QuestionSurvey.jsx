import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Form, Input, Select, Button, message, DatePicker } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { getAllEvent } from "../../api/eventApi";
import { insertSurveyForm } from "../../api/surveyApi";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
const { Option } = Select;

const QuestionSurvey = () => {
  const [form] = Form.useForm();
  const [events, setEvents] = useState([]);
  const user = useSelector((state) => state.user.user || {});
  const [isLoading, setIsLoading] = useState(false);
  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const eventsData = await getAllEvent(1, 100);
      setEvents(eventsData.result.items);
    } catch (error) {
      message.error("Lỗi khi tải danh sách sự kiện: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      const data = {
        name: values.name,
        eventId: values.eventId,
        createBy: user.id,
        questionDetailRequests: values.questionDetailRequests.map(
          (question, index) => ({
            no: index + 1,
            question: question.question,
            answerType: question.answerType,
            ratingMax: question.answerType === 1 ? question.ratingMax : null,
          })
        ),
      };
      const response = await insertSurveyForm(data);
      if (response?.isSuccess) {
        message.success("Thêm biểu mẫu khảo sát thành công");
        form.resetFields();
      }
    } catch (error) {
      message.error("Lỗi khi thêm biểu mẫu khảo sát: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <LoadingComponent isLoading={isLoading} />
      <h3 className="mb-6 text-primary text-center font-bold text-2xl">
        Tạo biểu mẫu khảo sát
      </h3>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="name"
          label="Tên khảo sát"
          rules={[{ required: true, message: "Vui lòng nhập tên khảo sát" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="eventId"
          label="Sự kiện"
          rules={[{ required: true, message: "Vui lòng chọn sự kiện" }]}
        >
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
                <div key={key} className="bg-gray-50 p-4 mb-4 rounded-lg">
                  <Form.Item
                    {...restField}
                    name={[name, "question"]}
                    label="Câu hỏi"
                    rules={[
                      { required: true, message: "Vui lòng nhập câu hỏi" },
                    ]}
                  >
                    <Input placeholder="Nhập câu hỏi" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "answerType"]}
                    label="Chọn loại câu trả lời"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn loại câu trả lời",
                      },
                    ]}
                  >
                    <Select placeholder="Chọn loại câu trả lời">
                      <Option value={0}>Văn bản</Option>
                      <Option value={1}>Đánh giá</Option>
                      <Option value={2}>Ngày</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, curValues) =>
                      prevValues.questionDetailRequests?.[name]?.answerType !==
                      curValues.questionDetailRequests?.[name]?.answerType
                    }
                  >
                    {({ getFieldValue }) => {
                      const answerType = getFieldValue([
                        "questionDetailRequests",
                        name,
                        "answerType",
                      ]);
                      if (answerType === 0 || answerType === 2) {
                        return null;
                      } else
                        return (
                          <Form.Item
                            {...restField}
                            name={[name, "ratingMax"]}
                            label="Số điểm tối đa"
                            hidden={
                              true
                                ? (answerType === 0 && answerType === 2) ||
                                  answerType == null
                                : false
                            }
                          >
                            {answerType === 1 ? <Input type="number" /> : <></>}
                          </Form.Item>
                        );
                    }}
                  </Form.Item>
                  <Button
                    onClick={() => remove(name)}
                    icon={<MinusCircleOutlined />}
                    className="mt-2"
                    danger
                  >
                    Xóa câu hỏi
                  </Button>
                </div>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Thêm câu hỏi
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
            Tạo biểu mẫu khảo sát
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default QuestionSurvey;
