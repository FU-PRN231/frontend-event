import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getAllEvent } from "../../api/eventApi";
import { addSponsor } from "../../api/sponsorApi";

const AddSponsorForm = ({ onSponsorAdded }) => {
  const { register, handleSubmit, reset } = useForm();
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
    formData.append("Name", data.name);
    formData.append("Description", data.description);
    formData.append("PhoneNumber", data.phoneNumber);
    formData.append("Email", data.email);

    for (let i = 0; i < data.img.length; i++) {
      formData.append("Img", data.img[i]);
    }

    try {
      const res = await addSponsor(formData);
      if (res.isSuccess) {
        onSponsorAdded();
        reset();
      } else {
        console.error("Error response data:", res.messages);
      }
    } catch (error) {
      console.error("Error adding sponsor:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-2xl font-bold text-center mb-6">
        Thêm đơn vị tài trợ
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            multiple
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
