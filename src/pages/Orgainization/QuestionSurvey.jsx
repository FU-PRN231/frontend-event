import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Select,
  Card,
  Typography,
  Space,
  Divider,
  Tooltip,
} from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { getAllEvent } from "../../api/eventApi";
import { insertSurveyForm } from "../../api/surveyApi";

const { Option } = Select;
const { Title, Text } = Typography;

const QuestionSurvey = () => {
  const [form] = Form.useForm();
  const [events, setEvents] = useState([]);
  const user = useSelector((state) => state.user.user || {});

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const eventsData = await getAllEvent(1, 100);
      setEvents(eventsData.result.items);
    } catch (error) {
      message.error("Lỗi khi tải danh sách sự kiện: " + error.message);
    }
  };

  const handleSubmit = async (values) => {
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
            ratingMax: question.ratingMax,
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
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg">
      <Title level={2} className="text-center mb-6">
        Tạo Biểu Mẫu Khảo Sát
      </Title>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Space direction="vertical" size="large" className="w-full">
          <Form.Item
            name="name"
            label="Tên khảo sát"
            rules={[{ required: true, message: "Vui lòng nhập tên khảo sát" }]}
          >
            <Input placeholder="Nhập tên khảo sát" />
          </Form.Item>

          <Form.Item
            name="eventId"
            label="Sự kiện"
            rules={[{ required: true, message: "Vui lòng chọn sự kiện" }]}
          >
            <Select placeholder="Chọn sự kiện">
              {events.map((event) => (
                <Option key={event.id} value={event.id}>
                  {event.title}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Divider>Danh sách câu hỏi</Divider>

          <Form.List name="questionDetailRequests">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Card key={key} className="mb-4" size="small">
                    <Space direction="vertical" className="w-full">
                      <Form.Item
                        {...restField}
                        name={[name, "question"]}
                        rules={[
                          { required: true, message: "Vui lòng nhập câu hỏi" },
                        ]}
                      >
                        <Input placeholder="Nhập câu hỏi" />
                      </Form.Item>
                      <Space>
                        <Form.Item
                          {...restField}
                          name={[name, "answerType"]}
                          rules={[
                            {
                              required: true,
                              message: "Chọn loại câu trả lời",
                            },
                          ]}
                        >
                          <Select
                            placeholder="Chọn loại câu trả lời"
                            style={{ width: 200 }}
                          >
                            <Option value={0}>Chữ</Option>
                            <Option value={1}>Đánh giá</Option>
                            <Option value={2}>Ngày</Option>
                          </Select>
                        </Form.Item>
                        <Form.Item
                          shouldUpdate={(prevValues, curValues) =>
                            prevValues.questionDetailRequests[name]
                              ?.answerType !==
                            curValues.questionDetailRequests[name]?.answerType
                          }
                        >
                          {({ getFieldValue }) =>
                            getFieldValue([
                              "questionDetailRequests",
                              name,
                              "answerType",
                            ]) === 1 && (
                              <Form.Item
                                {...restField}
                                name={[name, "ratingMax"]}
                                label="Điểm tối đa"
                                rules={[
                                  {
                                    required: true,
                                    message: "Nhập điểm tối đa",
                                  },
                                ]}
                              >
                                <InputNumber min={1} max={10} />
                              </Form.Item>
                            )
                          }
                        </Form.Item>
                      </Space>
                    </Space>
                    <Tooltip title="Xóa câu hỏi">
                      <Button
                        type="text"
                        danger
                        icon={<MinusCircleOutlined />}
                        onClick={() => remove(name)}
                        style={{ position: "absolute", top: 5, right: 5 }}
                      />
                    </Tooltip>
                  </Card>
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
              Tạo biểu mẫu
            </Button>
          </Form.Item>
        </Space>
      </Form>
    </Card>
  );
};

export default QuestionSurvey;
