import { Alert, Select, Spin, Table } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { FaExclamationCircle } from "react-icons/fa";
import { getAllEvent } from "../../api/eventApi";
import { getSponsorHistoryByEventId } from "../../api/sponsorApi";

const { Option } = Select;

const SponsorHistoryByEventId = ({ eventId }) => {
  const [sponsorHistory, setSponsorHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEventId, setSelectedEventId] = useState("");
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const SponsorType = {
    MONEY_FULL_SPONSOR: 0,
    MONEY_PARTIAL_SPONSOR: 1,
    GIFT_SPONSOR: 2,
    BOOTH_SPONSOR: 3,
  };

  const fetchSponsorHistory = useCallback(async () => {
    if (!selectedEventId) return;

    setLoading(true);
    try {
      const response = await getSponsorHistoryByEventId(
        selectedEventId,
        currentPage,
        pageSize
      );
      setSponsorHistory(response.result.items);
      setTotalItems(response.result.totalCount);
      setLoading(false);
    } catch (error) {
      console.error("Lỗi tải lịch sử nhà Tài trợ:", error);
      setError("Lỗi tải lịch sử nhà Tài trợ");
      setLoading(false);
    }
  }, [selectedEventId, currentPage, pageSize]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsData = await getAllEvent(1, 100);
        setEvents(eventsData.result.items);
      } catch (error) {
        console.error("Lỗi tải sự kiện:", error);
      }
    };

    fetchEvents();
  }, []);

  const handleEventChange = (value) => {
    setSelectedEventId(value);
    setCurrentPage(1); // Reset to first page when event changes
  };

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  useEffect(() => {
    if (selectedEventId) {
      fetchSponsorHistory();
    } else {
      setSponsorHistory([]);
    }
  }, [selectedEventId, fetchSponsorHistory]);

  const sponsorHistoryMapping = sponsorHistory.map((item) => ({
    key: item.id,
    eventTitle: item.eventSponsor?.event?.title ?? "--",
    eventDescription: item.eventSponsor?.event?.description ?? "--",
    eventDate: item.eventSponsor?.event?.startEventDate ?? "--",
    sponsorName: item.eventSponsor?.sponsor?.name ?? "--",
    sponsorType: item.eventSponsor.sponsorType,
    moneySponsorAmount: item.amount,
    date: item.date,
  }));

  const columns = [
    {
      title: "Sự Kiện",
      dataIndex: "eventTitle",
      key: "eventTitle",
    },
    {
      title: "Mô Tả Sự Kiện",
      dataIndex: "eventDescription",
      key: "eventDescription",
    },
    {
      title: "Ngày Sự Kiện",
      dataIndex: "eventDate",
      key: "eventDate",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Tên Nhà Tài trợ",
      dataIndex: "sponsorName",
      key: "sponsorName",
    },
    {
      title: "Hình Thúc Tài trợ",
      dataIndex: "sponsorType",
      key: "sponsorType",
      render: (text) => {
        switch (text) {
          case SponsorType.MONEY_FULL_SPONSOR:
            return "Tài trợ toàn phần";
          case SponsorType.MONEY_PARTIAL_SPONSOR:
            return "Tài trợ một phần";
          case SponsorType.GIFT_SPONSOR:
            return "Tài trợ quà tặng";
          case SponsorType.BOOTH_SPONSOR:
            return "Tài trợ gian hàng";
          default:
            return "--";
        }
      },
    },
    {
      title: "Số Tiền",
      dataIndex: "moneySponsorAmount",
      key: "moneySponsorAmount",
      render: (text) => `${text.toLocaleString()} VND`,
    },
    {
      title: "Ngày Thực Hiện",
      dataIndex: "date",
      key: "date",
      render: (text) => new Date(text).toLocaleDateString(),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">ĐƠN VỊ TÀI TRỢ KINH PHÍ</h2>
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
        <Spin className="text-center" />
      ) : error ? (
        <Alert className="text-center" message={error} type="error" />
      ) : sponsorHistory.length > 0 ? (
        <Table
          columns={columns}
          dataSource={sponsorHistoryMapping}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: totalItems,
            showSizeChanger: true,
          }}
          onChange={handleTableChange}
        />
      ) : (
        <div className="text-center text-gray-500 flex justify-center items-center">
          <FaExclamationCircle className="mr-2" />
          Không có lịch sử nhà tài trợ.
        </div>
      )}
    </div>
  );
};

export default SponsorHistoryByEventId;
