import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getAllEvent } from "../../api/eventApi";
import { addSponsor } from "../../api/sponsorApi";

const AddSponsorForm = ({ onSponsorAdded }) => {
  const { register, handleSubmit, control, reset } = useForm();
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");

  const fetchEvents = async () => {
    try {
      const eventsData = await getAllEvent(1, 100);
      setEvents(eventsData.result.items);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("EventId", selectedEventId);

    // Append other sponsor data
    const sponsorDto = {
      name: data.name,
      description: data.description,
      phoneNumber: data.phoneNumber,
      email: data.email,
      img: data.img[0], // Assuming data.img is an array with a single file object
    };

    formData.append("SponsorDtos", JSON.stringify([sponsorDto]));

    try {
      const res = await addSponsor(formData);
      if (res) {
        onSponsorAdded();
        reset(); // Reset the form after successful submission
      }
    } catch (error) {
      console.error("Error adding sponsor:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="mb-4">
          {/* <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="event"
          >
            Chọn Event
          </label> */}
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="event"
            name="event"
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
          >
            <option value="">Chọn Event</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col mb-4">
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
              {...register("name")}
              placeholder="Nhập tên nhà tài trợ"
            />
          </div>

          <div className="flex flex-col mb-4">
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
              {...register("description")}
              placeholder="Nhập mô tả chi tiết về nhà tài trợ"
            />
          </div>

          <div className="flex flex-col mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="phoneNumber"
            >
              Số điện thoại
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="phoneNumber"
              type="text"
              {...register("phoneNumber")}
              placeholder="Nhập số điện thoại"
            />
          </div>

          <div className="flex flex-col mb-4">
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
              {...register("email")}
              placeholder="Nhập email liên hệ"
            />
          </div>
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
            {...register("img")}
          />
        </div>

        <div className="flex items-center justify-center">
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
