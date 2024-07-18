import { message, Pagination, Select, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import { getAllEvent, getEventByOrganizerId } from "../../api/eventApi";
import { getAllSponsorItemsOfEvent } from "../../api/sponsorApi";
import { useSelector } from "react-redux";

const { Option } = Select;

const SponsorMoney = ({ eventId }) => {
  const [sponsorItems, setSponsorItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(eventId);
const user = useSelector((state)=> state.user.user || {})
  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    fetchSponsorItems();
  }, [selectedEventId, pageNumber, pageSize]);

  const fetchEvents = async () => {
    try {
      const eventsData = await getEventByOrganizerId(user.organizationId,1, 100);
      setEvents(eventsData.result.items);
    } catch (error) {
      console.error("Lỗi tải sự kiện:", error);
    }
  };

  const fetchSponsorItems = async () => {
    setLoading(true);
    try {
      const data = await getAllSponsorItemsOfEvent(
        selectedEventId,
        pageNumber,
        pageSize
      );
      setSponsorItems(data.result.items);
      setTotalItems(data.result.totalPages * pageSize);
    } catch (error) {
      message.error("Lỗi tải các mục tài trợ");
    } finally {
      setLoading(false);
    }
  };

  const handleEventChange = (value) => {
    setSelectedEventId(value);
    setPageNumber(1);
  };

  const SponsorType = {
    MONEY_FULL_SPONSOR: 0,
    MONEY_PARTIAL_SPONSOR: 1,
    GIFT_SPONSOR: 2,
    BOOTH_SPONSOR: 3,
  };

  const columns = [
    {
      title: "Tên nhà tài trợ",
      dataIndex: ["sponsor", "name"],
      key: "sponsorName",
    },
    {
      title: "Mô tả nhà tài trợ",
      dataIndex: ["sponsor", "description"],
      key: "sponsorDescription",
    },
    {
      title: "Loại tài trợ",
      dataIndex: "sponsorType",
      key: "sponsorType",
      render: (type) => {
        switch (type) {
          case SponsorType.MONEY_FULL_SPONSOR:
            return "Tài Trợ Toàn Bộ";
          case SponsorType.MONEY_PARTIAL_SPONSOR:
            return "Tài Trợ Một Phần";
          case SponsorType.GIFT_SPONSOR:
            return "Tài Trợ Quà Tặng";
          case SponsorType.BOOTH_SPONSOR:
            return "Tài Trợ Gian Hàng";
          default:
            return "Không rõ";
        }
      },
    },
    {
      title: "Mô tả",
      dataIndex: "sponsorDescription",
      key: "sponsorDescription",
    },
    {
      title: "Số tiền",
      dataIndex: "moneySponsorAmount",
      key: "moneySponsorAmount",
      render: (amount) => `${amount.toLocaleString()} VND`,
    },
    {
      title: "Hình ảnh nhà tài trợ",
      dataIndex: ["sponsor", "img"],
      key: "sponsorImg",
      render: (img) => (
        <img src={img} alt="Sponsor" style={{ width: "50px" }} />
      ),
    },
  ];

  return (
    <div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="event"
        >
          Chọn Sự Kiện
        </label>
        <Select
          className="w-full"
          id="event"
          name="event"
          value={selectedEventId}
          onChange={handleEventChange}
          placeholder="Chọn Sự Kiện"
        >
          {events &&
            events.map((event) => (
              <Option key={event.id} value={event.id}>
                {event.title}
              </Option>
            ))}
        </Select>
      </div>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Table
          dataSource={sponsorItems}
          columns={columns}
          rowKey="id"
          pagination={false}
        />
      )}
      <Pagination
        current={pageNumber}
        pageSize={pageSize}
        total={totalItems}
        onChange={(page, size) => {
          setPageNumber(page);
          setPageSize(size);
        }}
        showSizeChanger
        pageSizeOptions={["10", "20", "50", "100"]}
      />
    </div>
  );
};

export default SponsorMoney;
