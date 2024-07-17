import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  DatePicker,
  Rate,
  Card,
  Typography,
  Space,
  Button,
  message,
  Select,
} from "antd";
import moment from "moment-timezone";
import { useSelector } from "react-redux";
import {
  addAnswerToSurvey,
  getAllSurveys,
  getSurveyById,
  insertSurveyForm,
} from "../../api/surveyApi";

const { Title, Text } = Typography;
const { Option } = Select;

const SurveyForm = () => {
  const [form] = Form.useForm();
  const user = useSelector((state) => state.user.user || {});
  const [surveyData, setSurveyData] = useState({});
  const [surveys, setSurveys] = useState([]);
  const [selectedSurveyId, setSelectedSurveyId] = useState(null);
  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      const response = await getAllSurveys();
      if (response?.isSuccess) {
        setSurveys(response.result);
      }
    } catch (error) {
      message.error("Failed to fetch surveys: " + error.message);
    }
  };

  const fetchSurveyById = async (id) => {
    try {
      const response = await getSurveyById(id);
      setSurveyData(response.result);
    } catch (error) {
      message.error("Failed to fetch survey details: " + error.message);
    }
  };

  const handleSurveySelect = (value) => {
    setSelectedSurveyId(value);
    fetchSurveyById(value);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    const formattedResponses = {
      accountId: user.id,
      surveyId: surveyData.survey.id,
      answerDetails: Object.entries(values).map(([key, value]) => {
        const question = surveyData.surveyQuestionDetails.find(
          (q) => q.id === key
        );
        return {
          surveyQuestionDetailId: key,
          textAnswer:
            question.answerType === 0 || question.answerType === 2
              ? value
              : null,
          rating: question.answerType === 1 ? value : null,
        };
      }),
    };

    console.log("Formatted responses:", formattedResponses);
    const response = await addAnswerToSurvey(formattedResponses);
    if (response?.isSuccess) {
      message.success(
        "Khảo sát đã được gửi đi, cảm ơn bạn đã tham gia khảo sát"
      );
    } else {
      message.error("Có lỗi xảy ra. Vui lòng submit lại");
    }
  };

  const renderQuestionInput = (question) => {
    switch (question.answerType) {
      case 0:
        return <Input placeholder="Nhập câu trả lời của bạn" />;
      case 1:
        return <Rate count={question.ratingMax || 5} />;
      case 2:
        return <DatePicker style={{ width: "100%" }} format={"dd/MM/YYYY"} />;
      default:
        return <Input placeholder="Nhập câu trả lời của bạn" />;
    }
  };

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Select
          style={{ width: "100%" }}
          placeholder="Chọn khảo sát"
          onChange={handleSurveySelect}
        >
          {surveys.map((survey) => (
            <Option key={survey.survey.id} value={survey.survey.id}>
              {survey.survey.name}
            </Option>
          ))}
        </Select>

        {selectedSurveyId && (
          <>
            <Title level={2}>{surveyData.survey?.name}</Title>
            <Text type="secondary">
              Được tạo vào ngày:
              {moment(surveyData.survey?.createDate).format("MMMM D, YYYY")}
            </Text>

            <Form
              form={form}
              onFinish={handleSubmit}
              layout="vertical"
              className="mt-6"
            >
              <Space
                direction="vertical"
                size="large"
                style={{ width: "100%" }}
              >
                {surveyData?.surveyQuestionDetails?.map((question) => (
                  <Form.Item
                    key={question.id}
                    name={question.id}
                    label={
                      <Text strong>
                        {question.no}. {question.question}
                      </Text>
                    }
                    rules={[
                      {
                        required: true,
                        message: "Please answer this question",
                      },
                    ]}
                    getValueFromEvent={(e) => {
                      if (question.answerType === 2) {
                        // return e ? e.format("YYYY-MM-DD") : null;
                      }
                      return e && e.target ? e.target.value : e;
                    }}
                  >
                    {renderQuestionInput(question)}
                  </Form.Item>
                ))}

                <Form.Item>
                  <Button type="primary" htmlType="submit" block>
                    Gửi trả lời khảo sát
                  </Button>
                </Form.Item>
              </Space>
            </Form>
          </>
        )}
      </Space>
    </Card>
  );
};

export default SurveyForm;
