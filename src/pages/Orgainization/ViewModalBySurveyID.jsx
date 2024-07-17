import {
  Button,
  Card,
  Col,
  List,
  message,
  Modal,
  Row,
  Select,
  Skeleton,
  Spin,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { getAllEvent } from "../../api/eventApi";
import { getAllOrganizations } from "../../api/organizationApi";
import { getSurveysBySurveyId } from "../../api/surveyApi";
const { Option } = Select;
const { Text, Title, Paragraph } = Typography;

const ViewModalBySurveyID = ({ surveyId, open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [surveyData, setSurveyData] = useState(null);
  const [error, setError] = useState(null);
  const [surveys, setSurveys] = useState([]);
  const [selectedSurveyId, setSelectedSurveyId] = useState(null);

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
  };

  useEffect(() => {
    if (open) {
      fetchSurveys();
    }
  }, [open]);

  useEffect(() => {
    const fetchSurveyData = async () => {
      setLoading(true);
      try {
        const data = await getSurveysBySurveyId(surveyId);
        setSurveyData(data.result);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (open && surveyId) {
      fetchSurveyData();
    }
  }, [surveyId, open]);

  const handleClose = () => {
    onClose();
    setSurveyData(null);
  };

  const getEventTitle = (eventId) => {
    const event = events.find((event) => event.id === eventId);
    return event ? event.title : "Unknown";
  };

  const getAccountDetails = (accountId) => {
    const account = accountDetails[accountId];
    if (!account)
      return { name: "Unknown", phoneNumber: "Unknown", email: "Unknown" };
    return {
      name: `${account.firstName} ${account.lastName}`,
      phoneNumber: account.phoneNumber || "Unknown",
      email: account.email || "Unknown",
    };
  };

  const fetchEvents = async () => {
    try {
      const eventsData = await getAllEvent(1, 100);
      setEvents(eventsData.result.items);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const fetchOrganizations = async () => {
    try {
      const res = await getAllOrganizations(1, 10);
      if (res.isSuccess) {
        setOrganizations(res.result.items || []);
      } else {
        console.error("Unsuccessful response:", res.messages);
      }
    } catch (error) {
      console.error("Error fetching organizations:", error);
    }
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

  const SurveyItemDetail = ({ icon, label, value }) => (
    <div className="mb-2">
      <Text>
        {icon} <strong>{label}</strong> {value}
      </Text>
    </div>
  );

  return (
    <Modal
      title={`Survey Details - ${surveyId}`}
      open={open}
      onCancel={handleClose}
      footer={[
        <Button key="close" onClick={handleClose}>
          Close
        </Button>,
      ]}
    >
      <Select
        style={{ width: "100%" }}
        placeholder="Select a survey"
        onChange={handleSurveySelect}
      >
        {surveys.map((survey) => (
          <Option key={survey.id} value={survey.id}>
            {survey.name}
          </Option>
        ))}
      </Select>

      {loading && <Spin />}

      {error && <div>Error: {error}</div>}

      <Row gutter={16}>
        {loading
          ? [1, 2, 3].map((item) => (
              <Col xs={24} sm={12} lg={8} key={item}>
                <Card>
                  <Skeleton active />
                </Card>
              </Col>
            ))
          : surveys.map((item) => (
              <Col xs={24} sm={12} lg={8} key={item.survey.id}>
                <Card
                  title={<Title level={4}>{item.survey.name}</Title>}
                  bordered={true}
                  style={{ marginBottom: "16px" }}
                >
                  <List
                    size="small"
                    dataSource={[
                      {
                        icon: <InfoCircleOutlined />,
                        label: "Event:",
                        value: getEventTitle(item.survey.eventId),
                      },
                      {
                        icon: <UserOutlined />,
                        label: "Created by:",
                        value: getAccountDetails(item.survey.createBy).name,
                      },
                      {
                        icon: <PhoneOutlined />,
                        label: "Phone:",
                        value: getAccountDetails(item.survey.createBy)
                          .phoneNumber,
                      },
                      {
                        icon: <MailOutlined />,
                        label: "Email:",
                        value: getAccountDetails(item.survey.createBy).email,
                      },
                      {
                        icon: <CalendarOutlined />,
                        label: "Created on:",
                        value: formatDate(item.survey.createDate),
                      },
                      {
                        icon: <CalendarOutlined />,
                        label: "Updated on:",
                        value: formatDate(item.survey.updateDate),
                      },
                    ]}
                    renderItem={(detail) => (
                      <List.Item>
                        <SurveyItemDetail
                          icon={detail.icon}
                          label={detail.label}
                          value={detail.value}
                        />
                      </List.Item>
                    )}
                  />
                  {item.surveyQuestionDetails.length > 0 && (
                    <div className="mt-4">
                      <Title level={5}>Survey Questions</Title>
                      {item.surveyQuestionDetails.map((question) => (
                        <Paragraph key={question.id}>
                          <Text strong>{question.question}</Text>
                          <br />
                          <Text type="secondary">
                            Type:{" "}
                            {question.answerType === 0
                              ? "Text"
                              : `Rating (Max: ${question.ratingMax})`}
                          </Text>
                        </Paragraph>
                      ))}
                    </div>
                  )}
                </Card>
              </Col>
            ))}
      </Row>

      {surveyData && (
        <div>
          <h3>Survey Responses</h3>
          {surveyData.surveyAnswerDetailDtos.map((answerDetail, index) => (
            <div key={index}>
              <h4>
                Question {answerDetail.surveyQuestionDetail.no}:{" "}
                {answerDetail.surveyQuestionDetail.question}
              </h4>
              {answerDetail.surveyResponseDetails.map((response, idx) => (
                <div key={idx}>
                  <p>Response: {response.textAnswer}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
};

export default ViewModalBySurveyID;
