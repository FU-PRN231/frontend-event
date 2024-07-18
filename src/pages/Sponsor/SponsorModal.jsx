import { Button, Modal, Select, message } from "antd";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAllEvent } from "../../api/eventApi";
import {
  getAllSponsorItemsOfEvent,
  getAllSponsors,
} from "../../api/sponsorApi";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import AddSponsorMoney from "../Sponsor/AddSponsorMoney";
import SponsorMoney from "./SponsorMoney";
import ViewSponsor from "./ViewSponsor";

const { Option } = Select;

const SponsorModal = () => {
  const [sponsors, setSponsors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { eventId } = useParams();
  const [showAddSponsor, setShowAddSponsor] = useState(false);
  const [sponsorItems, setSponsorItems] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(eventId);

  useEffect(() => {
    fetchSponsorsData();
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      fetchSponsorItems();
    }
  }, [selectedEventId, pageNumber, pageSize]);

  const handleSponsorAdded = () => {
    fetchSponsorsData();
  };

  const fetchSponsorsData = async () => {
    try {
      const data = await getAllSponsors();
      setSponsors(data.result.items);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching sponsors:", error);
      setIsLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const eventsData = await getAllEvent(1, 100);
      setEvents(eventsData.result.items);
    } catch (error) {
      console.error("Error loading events:", error);
    }
  };

  const fetchSponsorItems = async () => {
    setIsLoading(true); // Sử dụng isLoading thay vì loading
    try {
      const data = await getAllSponsorItemsOfEvent(
        selectedEventId,
        pageNumber,
        pageSize
      );
      setSponsorItems(data.result.items);
      setTotalItems(data.result.totalPages * pageSize);
    } catch (error) {
      message.error("Error fetching sponsor items");
    } finally {
      setIsLoading(false); // Sử dụng isLoading thay vì loading
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
      title: "Sponsor Name",
      dataIndex: ["sponsor", "name"],
      key: "sponsorName",
    },
    {
      title: "Sponsor Description",
      dataIndex: ["sponsor", "description"],
      key: "sponsorDescription",
    },
    {
      title: "Sponsor Type",
      dataIndex: "sponsorType",
      key: "sponsorType",
      render: (type) => {
        switch (type) {
          case SponsorType.MONEY_FULL_SPONSOR:
            return "Full Sponsor";
          case SponsorType.MONEY_PARTIAL_SPONSOR:
            return "Partial Sponsor";
          case SponsorType.GIFT_SPONSOR:
            return "Gift Sponsor";
          case SponsorType.BOOTH_SPONSOR:
            return "Booth Sponsor";
          default:
            return "Unknown";
        }
      },
    },
    {
      title: "Description",
      dataIndex: "sponsorDescription",
      key: "sponsorDescription",
    },
    {
      title: "Amount",
      dataIndex: "moneySponsorAmount",
      key: "moneySponsorAmount",
      render: (amount) => `${amount.toLocaleString()} VND`,
    },
    {
      title: "Sponsor Image",
      dataIndex: ["sponsor", "img"],
      key: "sponsorImg",
      render: (img) => (
        <img src={img} alt="Sponsor" style={{ width: "50px" }} />
      ),
    },
  ];

  if (isLoading) {
    return <LoadingComponent isLoading={true} />;
  }

  return (
    <div className="container mx-auto py-12">
      <h3 className="text-3xl font-bold mb-6">Nhà tài trợ</h3>
      <Button type="primary" onClick={() => setShowAddSponsor(!showAddSponsor)}>
        Thêm tiền tài trợ vào sự kiện
      </Button>
      <Modal
        title="Thêm tiền tài trợ vào sự kiện"
        visible={showAddSponsor}
        onCancel={() => setShowAddSponsor(false)}
        footer={null}
      >
        <AddSponsorMoney
          eventId={eventId}
          onSponsorAdded={handleSponsorAdded}
        />
      </Modal>
      {/* <div className="mt-8">
        <h3 className="text-3xl font-bold mb-6">
          Lịch sử giao dịch tài trợ theo sự kiện
        </h3>
        <Select
          className="w-full"
          value={selectedEventId}
          onChange={handleEventChange}
          placeholder="Chọn Sự Kiện"
        >
          {events.map((event) => (
            <Option key={event.id} value={event.id}>
              {event.title}
            </Option>
          ))}
        </Select>
        {isLoading ? ( // Sử dụng isLoading thay vì loading
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
        <SponsorHistoryByEventId eventId={eventId} />
      </div> */}
      <SponsorMoney />
      <ViewSponsor />
    </div>
  );
};

export default SponsorModal;
