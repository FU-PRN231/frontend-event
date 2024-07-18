import { Card, message, Select, Space, Spin, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { getAllSurveys, getSurveyById } from "../../api/surveyApi";

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

  const handleSurveySelect = (value) => {
    setSelectedSurveyId(value);
    fetchSurveyById(value);
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
            {surveyData.surveyQuestionDetails.map((question) => (
              <Paragraph key={question.id}>
                <Text strong>{question.question}</Text>
                <br />
                <Text type="secondary">
                  Type:{" "}
                  {question.answerType === 0
                    ? "Text"
                    : `Rating (Max: ${question.ratingMax})`}
                </Text>
                {/* Display responses for each question if available */}
              </Paragraph>
            ))}
          </>
        )}
      </Space>
    </Card>
  );
};

export default ViewModalBySurveyID;
