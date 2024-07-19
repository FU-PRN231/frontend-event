import { Tabs, message } from "antd";
import { useEffect, useState } from "react";
import {
  getAllEvent,
  getAllEventByStatus,
  updateEventStatus,
} from "../../api/eventApi";
import { formatDate, formatDateTime } from "../../utils/util";
import { FaStumbleuponCircle, FaTicketAlt } from "react-icons/fa";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import { eventStatusType } from "../../utils/labelEnum";
const { TabPane } = Tabs;
const CensorEvent = () => {
  const [activeKey, setActiveKey] = useState(0);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const handleChangeTab = (activeKey) => {
    switch (activeKey) {
      case "10":
        setActiveKey(10);
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
    try {
      setLoading(true);
      if (activeKey == 10) {
        const data = await getAllEvent(1, 10);
        if (data?.isSuccess) {
          setEvents(data.result?.items);
        }
      } else {
        const data = await getAllEventByStatus(activeKey, 1, 10);
        if (data?.isSuccess) {
          setEvents(data.result?.items);
        }
      }
    } catch (err) {
      message.error("Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [activeKey]);
  console.log(activeKey);
  return (
    <>
      <LoadingComponent isLoading={loading} />
      <h3 className="text-primary text-center font-bold">Kiểm duyệt sự kiện</h3>
      <Tabs defaultActiveKey="10" onChange={handleChangeTab}>
        <TabPane tab="Tất cả" key="10">
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
                      <td className="p-2">{eventStatusType[event.status]}</td>
                      <td className="p-2">
                        <div className="flex justify-center">
                          {event.status !== 1 && event.status !== 2 && (
                            <>
                              <i
                                className="fa-solid fa-circle-check text-green-600 text-xl cursor-pointer"
                                onClick={async () => {
                                  setLoading(true);
                                  const data = await updateEventStatus(
                                    event.id,
                                    1
                                  );
                                  if (data?.isSuccess) {
                                    message.success(
                                      "Xác nhận sự kiện thành công"
                                    );
                                    await fetchData();
                                  }
                                  setLoading(false);
                                }}
                              ></i>
                              <i
                                className="fa-solid fa-circle-xmark text-red-600 text-xl mx-4 cursor-pointer"
                                onClick={async () => {
                                  setLoading(true);

                                  const data = await updateEventStatus(
                                    event.id,
                                    2
                                  );
                                  if (data?.isSuccess) {
                                    message.success(
                                      "Từ chối sự kiện thành công"
                                    );
                                    await fetchData();
                                  }
                                  setLoading(false);
                                }}
                              ></i>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </TabPane>
        <TabPane tab="Chờ xác nhận" key="0">
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
                      <td className="p-2">{eventStatusType[event.status]}</td>
                      <td className="p-2">
                        <div className="flex justify-center">
                          {event.status !== 1 && event.status !== 2 && (
                            <>
                              <i
                                className="fa-solid fa-circle-check text-green-600 text-xl cursor-pointer"
                                onClick={async () => {
                                  setLoading(true);
                                  const data = await updateEventStatus(
                                    event.id,
                                    1
                                  );
                                  if (data?.isSuccess) {
                                    message.success(
                                      "Xác nhận sự kiện thành công"
                                    );
                                    await fetchData();
                                  }
                                  setLoading(false);
                                }}
                              ></i>
                              <i
                                className="fa-solid fa-circle-xmark text-red-600 text-xl mx-4 cursor-pointer"
                                onClick={async () => {
                                  setLoading(true);

                                  const data = await updateEventStatus(
                                    event.id,
                                    2
                                  );
                                  if (data?.isSuccess) {
                                    message.success(
                                      "Từ chối sự kiện thành công"
                                    );
                                    await fetchData();
                                  }
                                  setLoading(false);
                                }}
                              ></i>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </TabPane>
        <TabPane tab="Đã xác nhận" key="1">
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
                      <td className="p-2">{eventStatusType[event.status]}</td>
                      <td className="p-2">
                        <div className="flex justify-center">
                          {event.status !== 1 && event.status !== 2 && (
                            <>
                              <i
                                className="fa-solid fa-circle-check text-green-600 text-xl cursor-pointer"
                                onClick={async () => {
                                  setLoading(true);
                                  const data = await updateEventStatus(
                                    event.id,
                                    1
                                  );
                                  if (data?.isSuccess) {
                                    message.success(
                                      "Xác nhận sự kiện thành công"
                                    );
                                    await fetchData();
                                  }
                                  setLoading(false);
                                }}
                              ></i>
                              <i
                                className="fa-solid fa-circle-xmark text-red-600 text-xl mx-4 cursor-pointer"
                                onClick={async () => {
                                  setLoading(true);

                                  const data = await updateEventStatus(
                                    event.id,
                                    2
                                  );
                                  if (data?.isSuccess) {
                                    message.success(
                                      "Từ chối sự kiện thành công"
                                    );
                                    await fetchData();
                                  }
                                  setLoading(false);
                                }}
                              ></i>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </TabPane>
        <TabPane tab="Từ chối" key="2">
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
                      <td className="p-2">{eventStatusType[event.status]}</td>
                      <td className="p-2">
                        <div className="flex justify-center">
                          {event.status !== 1 && event.status !== 2 && (
                            <>
                              <i
                                className="fa-solid fa-circle-check text-green-600 text-xl cursor-pointer"
                                onClick={async () => {
                                  setLoading(true);
                                  const data = await updateEventStatus(
                                    event.id,
                                    1
                                  );
                                  if (data?.isSuccess) {
                                    message.success(
                                      "Xác nhận sự kiện thành công"
                                    );
                                    await fetchData();
                                  }
                                  setLoading(false);
                                }}
                              ></i>
                              <i
                                className="fa-solid fa-circle-xmark text-red-600 text-xl mx-4 cursor-pointer"
                                onClick={async () => {
                                  setLoading(true);

                                  const data = await updateEventStatus(
                                    event.id,
                                    2
                                  );
                                  if (data?.isSuccess) {
                                    message.success(
                                      "Từ chối sự kiện thành công"
                                    );
                                    await fetchData();
                                  }
                                  setLoading(false);
                                }}
                              ></i>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </TabPane>
      </Tabs>
    </>
  );
};

export default CensorEvent;
