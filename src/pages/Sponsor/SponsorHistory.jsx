import React, { useCallback, useEffect, useState } from "react";
import { FaExclamationCircle } from "react-icons/fa";
import { getAllEvent } from "../../api/eventApi";
import { getSponsorHistoryByEventId } from "../../api/sponsorApi";
const SponsorHistory = ({ eventId }) => {
  const [sponsorHistory, setSponsorHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEventId, setSelectedEventId] = useState("");
  const [events, setEvents] = useState([]);
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
      const response = await getSponsorHistoryByEventId(selectedEventId, 1, 10);
      setSponsorHistory(response.result.items);
      setLoading(false);
    } catch (error) {
      console.error("Lỗi tải lịch sử nhà Tài trợ:", error);
      setError("Lỗi tải lịch sử nhà Tài trợ");
      setLoading(false);
    }
  }, [selectedEventId]);

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

  const handleEventChange = (e) => {
    const selectedId = e.target.value;
    setSelectedEventId(selectedId);
  };

  useEffect(() => {
    if (selectedEventId) {
      fetchSponsorHistory();
    } else {
      setSponsorHistory([]);
    }
  }, [selectedEventId, fetchSponsorHistory]);

  const sponsorHistoryMapping = sponsorHistory.map((item) => ({
    id: item.id,
    date: item.date,
    moneySponsorAmount: item.amount,
    isFromSponsor: item.isFromSponsor,
    sponsorType: item.eventSponsor.sponsorType,
    sponsor: {
      name: item.eventSponsor?.sponsor?.name ?? "--",
    },
    event: {
      id: item.eventSponsor?.event?.id ?? "--",
      title: item.eventSponsor?.event?.title ?? "--",
      description: item.eventSponsor?.event?.description ?? "--",
      startEventDate: item.eventSponsor?.event?.startEventDate ?? "--",
      location: item.eventSponsor?.event?.location?.name ?? "--",
    },
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">LỊCH SỬ KINH PHÍ TÀI TRỢ</h2>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="event"
        >
          Chọn Sự Kiện
        </label>
        <select
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="event"
          name="event"
          value={selectedEventId}
          onChange={handleEventChange}
        >
          <option value="">Chọn Sự Kiện</option>
          {events &&
            events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
        </select>
      </div>
      {loading && <p className="text-center">Đang tải...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {sponsorHistory.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sự Kiện
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mô Tả Sự Kiện
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày Sự Kiện
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên Nhà Tài trợ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hình Thúc Tài trợ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số Tiền
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày Thực Hiện
                </th>
              </tr>
            </thead>
            <tbody>
              {sponsorHistoryMapping.map((historyItem) => (
                <tr key={historyItem.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {historyItem.event.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {historyItem.event.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(
                      historyItem.event.startEventDate
                    ).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {historyItem.sponsor.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {historyItem.sponsorType === SponsorType.MONEY_FULL_SPONSOR
                      ? "Tài trợ toàn phần"
                      : historyItem.sponsorType ===
                        SponsorType.MONEY_PARTIAL_SPONSOR
                      ? "Tài trợ một phần"
                      : historyItem.sponsorType === SponsorType.GIFT_SPONSOR
                      ? "Tài trợ quà tặng"
                      : historyItem.sponsorType === SponsorType.BOOTH_SPONSOR
                      ? "Tài trợ gian hàng"
                      : "--"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {historyItem.moneySponsorAmount.toLocaleString()} VND
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(historyItem.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-gray-500 flex justify-center items-center">
          <FaExclamationCircle className="mr-2" />
          Không có lịch sử nhà tài trợ.
        </div>
      )}
    </div>
  );
};

export default SponsorHistory;
