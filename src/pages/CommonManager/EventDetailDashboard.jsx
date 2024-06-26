import React from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Progress,
  Typography,
  Descriptions,
  Tag,
} from "antd";
import {
  ClockCircleOutlined,
  EnvironmentOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { formatPrice } from "../../utils/util";

const { Title, Text } = Typography;

const EventDetailDashboard = ({ data }) => {
  const {
    event,
    numOfSeat,
    numOfBookedSeat,
    totalRevenue,
    totalTicketRevenue,
    totalSponsor,
    totalSponsorAmount,
    totalCost,
    taskCompletion,
    tasks,
    seatRegistration,
  } = data;

  const getStatusColor = (status) => {
    switch (status) {
      case 0:
        return "blue";
      case 1:
        return "orange";
      case 2:
        return "green";
      default:
        return "default";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return "Not Yet";
      case 1:
        return "Ongoing";
      case 2:
        return "Finished";
      default:
        return "Unknown";
    }
  };

  const columns = [
    { title: "Tên nhiệm vụ", dataIndex: "name", key: "name" },
    {
      title: "Người chịu trách nhiệm",
      dataIndex: "personInChargeName",
      key: "personInCharge",
    },
    { title: "Số điện thoại", dataIndex: "phoneNumber", key: "phone" },
    {
      title: "Chi phí cho nhiệm vụ",
      dataIndex: "cost",
      key: "cost",
      render: (cost) => `$${cost.toLocaleString()}`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      {data && (
        <>
          <h3 className="text-center text-primary font-bold text-lg my-4">
            {event?.title}
          </h3>
          <Text type="secondary">{event?.description}</Text>

          <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Lợi nhuận ròng"
                  value={formatPrice(totalRevenue)}
                  precision={2}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Tổng số lợi nhuận vé đã bán"
                  value={formatPrice(totalTicketRevenue)}
                  precision={2}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Tổng chi phí"
                  value={formatPrice(totalCost)}
                  precision={2}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
            <Col span={12}>
              <Card title="Chi tiết sự kiện">
                <Descriptions column={1}>
                  <Descriptions.Item
                    label={
                      <>
                        <ClockCircleOutlined /> Ngày bắt đầu
                      </>
                    }
                  >
                    {new Date(event?.startEventDate).toLocaleDateString()}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <>
                        <ClockCircleOutlined /> Ngày kết thúc
                      </>
                    }
                  >
                    {new Date(event?.endEventDate).toLocaleDateString()}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <>
                        <EnvironmentOutlined /> Địa điểm
                      </>
                    }
                  >
                    {event?.location.name}, {event?.location.address}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <>
                        <TeamOutlined /> Đơn vị tổ chức
                      </>
                    }
                  >
                    {event?.organization.name}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Thông tin vé">
                <Statistic title="Tổng số vé" value={numOfSeat} />
                <Statistic
                  title="Tổng số vé bán được"
                  value={numOfBookedSeat}
                />
                <Progress
                  percent={Math.round((numOfBookedSeat / numOfSeat) * 100)}
                  status="active"
                />
              </Card>
            </Col>
          </Row>

          <Card title="Nhiệm vụ" style={{ marginTop: "24px" }}>
            <Table dataSource={tasks} columns={columns} />
          </Card>

          <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
            <Col span={12}>
              <Card title="Nhiệm vụ hoàn thành">
                {taskCompletion &&
                  Object.entries(taskCompletion).map(([status, count]) => (
                    <Statistic
                      key={status}
                      title={status}
                      value={count}
                      suffix={`/ ${Object.values(taskCompletion).reduce(
                        (a, b) => a + b,
                        0
                      )}`}
                    />
                  ))}
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Ghế đăng kí">
                {seatRegistration &&
                  Object.entries(seatRegistration).map(([type, dates]) => (
                    <div key={type}>
                      <Text strong>{type}</Text>
                      {Object.entries(dates).map(([date, count]) => (
                        <p key={date}>
                          {date}: {count} seats
                        </p>
                      ))}
                    </div>
                  ))}
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default EventDetailDashboard;
