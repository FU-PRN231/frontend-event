import {
  CalendarOutlined,
  InfoCircleOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Card, Col, List, Row, Skeleton, Spin, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { getAccountById } from "../../api/accountApi";
import { getAllEvent } from "../../api/eventApi";
import { getAllOrganizations } from "../../api/organizationApi";
import { getAllSurveys } from "../../api/surveyApi";

const { Title, Text, Paragraph } = Typography;

const SurveyModal = () => {
  const [surveys, setSurveys] = useState([]);
  const [accountDetails, setAccountDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [organizations, setOrganizations] = useState([]);

  useEffect(() => {
    fetchSurveys();
    fetchEvents();
    fetchOrganizations();
  }, []);

  const fetchSurveys = async () => {
    setIsLoading(true);
    try {
      const data = await getAllSurveys();
      if (data.isSuccess) {
        const surveysData = data.result || [];
        const creatorIds = [
          ...new Set(surveysData.map((survey) => survey.survey.createBy)),
        ];
        const accountsData = await Promise.all(
          creatorIds.map((id) => getAccountById(id).catch(() => null))
        );
        const accountDetailsMap = accountsData.reduce((acc, account) => {
          if (account && account.result) {
            acc[account.result.id] = account.result;
          }
          return acc;
        }, {});
        setAccountDetails(accountDetailsMap);
        setSurveys(surveysData);
      } else {
        console.error("Error fetching surveys:", data.messages);
      }
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

  const SurveyItemDetail = ({ icon, label, value }) => (
    <div className="mb-2">
      <Text>
        {icon} <strong>{label}</strong> {value}
      </Text>
    </div>
  );

  return (
    <Spin spinning={isLoading}>
      <Row gutter={16}>
        {isLoading
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
                        label: "Sự kiện:",
                        value: getEventTitle(item.survey.eventId),
                      },
                      {
                        icon: <UserOutlined />,
                        label: "Người tạo:",
                        value: getAccountDetails(item.survey.createBy).name,
                      },
                      {
                        icon: <PhoneOutlined />,
                        label: "Số điện thoại:",
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
                        label: "Ngày tạo:",
                        value: formatDate(item.survey.createDate),
                      },
                      {
                        icon: <CalendarOutlined />,
                        label: "Ngày cập nhật:",
                        value: formatDate(item.survey.updateDate),
                      },
                    ]}
                  />
                  {item.surveyQuestionDetails.length > 0 && (
                    <div className="mt-4">
                      <Title level={5}>Các Câu Hỏi Khảo Sát</Title>{" "}
                      {item.surveyQuestionDetails.map((question) => (
                        <Paragraph key={question.id}>
                          <Text strong>{question.question}</Text>
                          <br />
                          <Text type="secondary">
                            Type:{" "}
                            {question.answerType === 0
                              ? "Văn bản"
                              : `Đánh giá (Tối đa: ${question.ratingMax})`}
                          </Text>
                        </Paragraph>
                      ))}
                    </div>
                  )}
                </Card>
              </Col>
            ))}
      </Row>
    </Spin>
  );
};

export default SurveyModal;
