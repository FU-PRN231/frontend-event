import { Card, message, Select, Space, Spin, Typography } from "antd";
import React, { useEffect, useState } from "react";
import {
  getAllSurveys,
  getSurveyById,
  getSurveysResponseBySurveyId,
} from "../../api/surveyApi";

const { Option } = Select;
const { Text, Title, Paragraph } = Typography;

const ViewModalBySurveyID = ({ surveyId, visible, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [surveyData, setSurveyData] = useState(null);
  const [surveys, setSurveys] = useState([]);
  const [selectedSurveyId, setSelectedSurveyId] = useState(null);

  useEffect(() => {
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

    fetchSurveys();
  }, []);

  const fetchSurveyById = async (id) => {
    setLoading(true);
    try {
      const response = await getSurveyById(id);
      if (response?.isSuccess) {
        setSurveyData(response.result);
      } else {
        setSurveyData(null);
      }
    } catch (error) {
      message.error("Failed to fetch survey details: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSurveyData = async (id) => {
    try {
      setLoading(true);
      const data = await getSurveysResponseBySurveyId(id);
      setSurveyData(data.result);
    } catch (error) {
      message.error("Failed to fetch survey data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSurveySelect = (value) => {
    setSelectedSurveyId(value);
    fetchSurveyData(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error(`Invalid date string: ${dateString}`);
      return "";
    }
    return date.toLocaleDateString("en-GB");
  };

  const getAccountDetails = (account) => {
    if (!account)
      return { name: "Unknown", phoneNumber: "Unknown", email: "Unknown" };
    return {
      name: `${account.firstName} ${account.lastName}`,
      phoneNumber: account.phoneNumber || "Unknown",
      email: account.email || "Unknown",
    };
  };

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Select
          style={{ width: "100%" }}
          placeholder="Select a survey"
          onChange={handleSurveySelect}
          value={selectedSurveyId}
        >
          {surveys.map((survey) => (
            <Option key={survey.survey.id} value={survey.survey.id}>
              {survey.survey.name}
            </Option>
          ))}
        </Select>

        {loading && <Spin />}

        {surveyData && (
          <>
            <Title level={4}>{surveyData.survey.name}</Title>
            <Paragraph>
              <Text strong>Created By:</Text>{" "}
              {getAccountDetails(surveyData.survey.createByAccount).name}
            </Paragraph>
            <Paragraph>
              <Text strong>Phone:</Text>{" "}
              {getAccountDetails(surveyData.survey.createByAccount).phoneNumber}
            </Paragraph>
            <Paragraph>
              <Text strong>Email:</Text>{" "}
              {getAccountDetails(surveyData.survey.createByAccount).email}
            </Paragraph>
            <Paragraph>
              <Text strong>Created on:</Text>{" "}
              {formatDate(surveyData.survey.createDate)}
            </Paragraph>
            <Paragraph>
              <Text strong>Updated on:</Text>{" "}
              {formatDate(surveyData.survey.updateDate)}
            </Paragraph>

            <Title level={5}>Survey Questions</Title>
            {surveyData.surveyAnswerDetailDtos.map((answerDetail) => (
              <Paragraph key={answerDetail.surveyQuestionDetail.id}>
                <Text strong>
                  Question {answerDetail.surveyQuestionDetail.no}:{" "}
                  {answerDetail.surveyQuestionDetail.question}
                </Text>
                <br />
                <Text type="secondary">
                  Type:{" "}
                  {answerDetail.surveyQuestionDetail.answerType === 0
                    ? "Text"
                    : `Rating (Max: ${answerDetail.surveyQuestionDetail.ratingMax})`}
                </Text>
                {answerDetail.surveyResponseDetails.map((response, index) => (
                  <div key={response.id}>
                    <Text>{`Response ${index + 1}: `}</Text>
                    {response.textAnswer ? (
                      <Text>{response.textAnswer}</Text>
                    ) : (
                      <Text>{`Rating: ${response.rating}`}</Text>
                    )}
                  </div>
                ))}
              </Paragraph>
            ))}
          </>
        )}
      </Space>
    </Card>
  );
};

export default ViewModalBySurveyID;
