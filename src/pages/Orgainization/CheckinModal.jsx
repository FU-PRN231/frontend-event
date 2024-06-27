import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BsFillPersonFill } from "react-icons/bs";
import QrReader from "react-qr-scanner";
import { checkIn, getAllAttendeesByEventId } from "../../api/checkinApi";
import {
  Card,
  Col,
  Descriptions,
  Divider,
  Row,
  Table,
  Tag,
  message,
} from "antd";
import { useParams } from "react-router-dom";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  QrcodeOutlined,
} from "@ant-design/icons";
import Title from "antd/es/skeleton/Title";
import { formatDate, formatPrice } from "../../utils/util";

const CheckInModal = () => {
  const [result, setResult] = useState({});
  // const { account, seatRank, checkedIn, orderDate } = result;

  const { id } = useParams();
  const [attendees, setAttendees] = useState([]);
  const fetchData = async () => {
    const res = await getAllAttendeesByEventId(id);
    if (res.isSuccess) {
      setAttendees(res.result.items);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const handleScan = async (data) => {
    if (data) {
      debugger;
      const checkInData = await checkIn(data.text);
      if (checkInData?.isSuccess) {
        message.success("Check in thành công");
        setResult(checkInData.result);
        await fetchData();
      }
    }
  };
  console.log(result);
  const handleError = (err) => {
    message.error(err);
  };
  const columns = [
    {
      title: "Ticket ID",
      dataIndex: "id",
      key: "id",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Sự kiện",
      dataIndex: ["orderDetail", "seatRank", "event", "title"],
      key: "event",
    },
    {
      title: "Loại vé",
      dataIndex: ["orderDetail", "seatRank", "name"],
      key: "seatRank",
    },
    {
      title: "Giá vé",
      dataIndex: ["orderDetail", "seatRank", "price"],
      key: "price",
      render: (price) => `${formatPrice(price)} VND`,
    },
    {
      title: "Người đại diện",
      key: "attendee",
      render: (_, record) =>
        `${record.orderDetail?.order?.account?.firstName} ${record.orderDetail.order.account.lastName}`,
    },
    {
      title: "Trạng thái",
      key: "checkedIn",
      dataIndex: "checkedIn",
      render: (checkedIn) => (
        <Tag color={checkedIn ? "green" : "volcano"}>
          {checkedIn ? "Điểm danh" : "Chưa điểm danh"}
        </Tag>
      ),
    },
    {
      title: "QR Code",
      key: "qr",
      render: (_, record) => (
        <a href={record.qr} target="_blank" rel="noopener noreferrer">
          <QrcodeOutlined style={{ fontSize: "24px" }} />
        </a>
      ),
    },
  ];
  return (
    <div className="container">
      <div className=" grid grid-cols-2 gap-4">
        <div className="mt-10 w-full">
          <h1 className="text-primary font-bold uppercase text-center text-md my-2">
            Check in automatically with Cóc Event
          </h1>
          <div className="p-4 rounded-md shadow-xl">
            <QrReader
              delay={300}
              onError={handleError}
              onScan={handleScan}
              style={{ width: "100%" }}
              facingMode="environment"
            />
          </div>
        </div>
        <div className="shadow-md rounded-md ">
          <h3 className="text-center text-primary font-bold text-xl">
            Thông tin điểm danh
          </h3>
          <Card style={{ width: "100%", maxWidth: 600, margin: "0 auto" }}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card type="inner" title="Chi tiết sự kiện">
                  <Descriptions column={1}>
                    <Descriptions.Item label="Tên sự kiện">
                      {result?.seatRank?.event?.title}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày bắt đầu">
                      {new Date(
                        result?.seatRank?.event?.startEventDate
                      ).toLocaleDateString()}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày kết thúc">
                      {new Date(
                        result?.seatRank?.event?.endEventDate
                      ).toLocaleDateString()}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>

              <Col span={24}>
                <Card type="inner" title="Chi tiết vé">
                  <Descriptions column={1}>
                    <Descriptions.Item label="Hạng vé">
                      {result?.seatRank?.name}
                    </Descriptions.Item>
                    <Descriptions.Item label="Giá">
                      {formatPrice(result?.seatRank?.price)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày đặt vé">
                      {formatDate(new Date(result?.orderDate))}
                    </Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">
                      {result?.checkedIn ? (
                        <Tag icon={<CheckCircleOutlined />} color="success">
                          Đã check in
                        </Tag>
                      ) : (
                        <Tag icon={<CloseCircleOutlined />} color="error">
                          Chưa check in
                        </Tag>
                      )}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>

              <Col span={24}>
                <Card type="inner" title="Người đại diện">
                  <Descriptions column={1}>
                    <Descriptions.Item label="Tên">{`${result?.account?.firstName} ${result?.account?.lastName}`}</Descriptions.Item>
                    <Descriptions.Item label="Email">
                      {result?.account?.email}
                    </Descriptions.Item>
                    <Descriptions.Item label="Số điện thoại">
                      {result?.account?.phoneNumber}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
            </Row>
          </Card>
        </div>
      </div>
      <div className="mt-8 rounded-lg p-4 shadow-lg col-span-2">
        <h2 className="text-primary font-bold uppercase text-center text-md my-2">
          Những người tham gia sự kiện
        </h2>

        {attendees.length > 0 ? (
          <Table
            columns={columns}
            dataSource={attendees}
            rowKey="id"
            pagination={{
              total: attendees.length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-32">
            <BsFillPersonFill size={48} className="text-gray-300 mb-2" />
            <p>Chưa có người tham gia sự kiện này.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckInModal;
