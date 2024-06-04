import React, { useEffect, useState } from "react";
import { addSponsor, getAllEvent } from "../../api/sponsorApi";
const AddSponsorForm = ({ onSponsorAdded }) => {
  const [sponsorData, setSponsorData] = useState({
    name: "",
    description: "",
    phoneNumber: "",
    email: "",
    img: null,
  });
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");

  const fetchEvents = async () => {
    try {
      const eventsData = await getAllEvent(1, 100);
      console.log(eventsData);
      setEvents(eventsData.result.items);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);
  console.log("events", events);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSponsorData({ ...sponsorData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSponsorData({ ...sponsorData, img: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("EventId", selectedEventId);
    formData.append("SponsorDtos", JSON.stringify([sponsorData]));

    try {
      const res = await addSponsor(selectedEventId, formData);
      if (res) {
        onSponsorAdded();
      }
    } catch (error) {
      console.error("Error adding sponsor:", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <form onSubmit={handleSubmit}>
        {/* Event dropdown */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="event"
          >
            Chọn Event
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="event"
            name="event"
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
          >
            <option value="">Chọn Event</option>
            {events &&
              events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title}
                </option>
              ))}
          </select>
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="name"
          >
            Tên nhà tài trợ
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            name="name"
            value={sponsorData.name}
            onChange={handleChange}
            placeholder="Nhập tên nhà tài trợ"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="description"
          >
            Mô tả chi tiết
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            type="text"
            name="description"
            value={sponsorData.description}
            onChange={handleChange}
            placeholder="Nhập mô tả chi tiết về nhà tài trợ"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="phoneNumber"
          >
            SDT
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="phoneNumber"
            type="text"
            name="phoneNumber"
            value={sponsorData.phoneNumber}
            onChange={handleChange}
            placeholder="Nhập số điện thoại"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="text"
            name="email"
            value={sponsorData.email}
            onChange={handleChange}
            placeholder="Nhập email liên hệ"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="img"
          >
            Hình ảnh
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="img"
            type="file"
            name="img"
            onChange={handleFileChange}
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Thêm nhà tài trợ
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSponsorForm;
