import { Tabs } from "antd";
import { useEffect, useState } from "react";
import { getAllEvent } from "../../api/eventApi";
import { formatDate, formatDateTime } from "../../utils/util";
import { FaStumbleuponCircle, FaTicketAlt } from "react-icons/fa";
const { TabPane } = Tabs;
const CensorEvent = () => {
  const [activeKey, setActiveKey] = useState(0);
  const [events, setEvents] = useState([]);
  const handleChangeTab = (activeKey) => {
    switch (activeKey) {
      case "all":
        break;
      case "0":
        setActiveKey(0);
        break;
      case "1":
        setActiveKey(1);
        break;
      case "2":
        setActiveKey(2);
        break;
    }
  };
  const fetchData = async () => {
    const data = await getAllEvent(1, 10);
    if (data?.isSuccess) {
      setEvents(data.result?.items);
    }
  };
  useEffect(() => {
    fetchData();
  }, [activeKey]);
  return (
    <>
      <h3 className="text-primary text-center font-bold">Kiểm duyệt sự kiện</h3>
      <Tabs defaultActiveKey="1" onChange={handleChangeTab}>
        <TabPane tab="Tất cả" key="all">
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="table">
              <thead className="h-16 bg-primary text-white">
                <tr>
                  <th>STT</th>
                  <th>Tựa đề</th>
                  <th>Mô tả</th>
                  <th>Thời gian sự kiện</th>
                  <th>Thời gian bán vé</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {events &&
                  events.length > 0 &&
                  events.map((event, index) => (
                    <tr key={index}>
                      <td className="p-2">{index + 1}</td>
                      <td className="p-2">{event.title}</td>
                      <td className="p-2">{event.description}</td>
                      <td className="p-2">
                        {`${formatDate(event.startEventDate)} - ${formatDate(
                          event.endEventDate
                        )}`}{" "}
                      </td>
                      <td className=" flex flex-row">
                        <span className="inline-block bg-blue-200 text-blue-800 px-2 py-1 text-xs font-bold rounded">
                          {formatDateTime(event.startTime)}
                        </span>
                        <span>-</span>
                        <span className="inline-block bg-green-200 text-green-800 px-2 py-1 text-xs font-bold rounded">
                          {formatDateTime(event.endTime)}
                        </span>
                      </td>
                      <td className="p-2">
                        {event.status ? "Đang mở" : "Đã đóng"}
                      </td>
                      <td className="p-2"></td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </TabPane>
        <TabPane tab="Chờ xác nhận" key="0">
          Content of Tab Pane 1
        </TabPane>
        <TabPane tab="Đã xác nhận" key="1">
          Content of Tab Pane 2
        </TabPane>
        <TabPane tab="Từ chối" key="2">
          Content of Tab Pane 3
        </TabPane>
      </Tabs>
    </>
  );
};

export default CensorEvent;
