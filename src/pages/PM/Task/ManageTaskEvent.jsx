import { notification } from "antd";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getAllEvent, getEventByOrganizerId } from "../../../api/eventApi";
import { assignTaskForEvent } from "../../../api/taskApi";
import { useSelector } from "react-redux";

const ManageTaskEvent = ({ setTasks }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [events, setEvents] = useState([]);
const user = useSelector((state)=> state.user.user || {})
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsData = await getEventByOrganizerId(user.organizationId,1, 100);
        setEvents(eventsData.result.items);
      } catch (error) {
        console.error("Lỗi khi tải các sự kiện:", error);
      }
    };

    fetchEvents();
  }, []);

  const handleEventChange = (e) => {
    setSelectedEventId(e.target.value);
  };

  const handleAssignTask = async (formData) => {
    setLoading(true);
    setError(null);

    const payload = {
      eventId: selectedEventId,
      taskDetails: [
        {
          ...formData,
          taskStatus: Number(formData.taskStatus),
          cost: formData.cost ? Number(formData.cost) : null,
          createdDate: formData.createdDate
            ? new Date(formData.createdDate).toISOString()
            : null,
          endDate: formData.endDate
            ? new Date(formData.endDate).toISOString()
            : null,
        },
      ],
    };

    try {
      const response = await assignTaskForEvent(selectedEventId, payload);
      if (response && response.isSuccess) {
        if (typeof setTasks === "function") {
          setTasks((prevTasks) => [...prevTasks, response.result]);
          notification.success({
            message: "Thành công",
            description: "Đã phân công nhiệm vụ thành công.",
            placement: "topRight",
          });
          reset(); // Reset form sau khi gửi thành công
        }
      } else {
        setError("Lỗi khi phân công nhiệm vụ. Vui lòng thử lại sau.");
        notification.error({
          message: "Lỗi",
          description: "Lỗi khi phân công nhiệm vụ. Vui lòng thử lại sau.",
          placement: "topRight",
        });
      }
    } catch (err) {
      console.error("Lỗi khi phân công nhiệm vụ:", err);
      setError("Lỗi khi phân công nhiệm vụ. Vui lòng thử lại sau.");
      notification.error({
        message: "Lỗi",
        description: "Lỗi khi phân công nhiệm vụ. Vui lòng thử lại sau.",
        placement: "topRight",
      });
    }
    setLoading(false);
  };

  const onSubmit = (formData) => {
    handleAssignTask(formData.taskDetails[0]);
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-xl font-semibold mb-4 text-center">Nhiệm Vụ Mới</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label
            htmlFor="event"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Chọn Sự Kiện
          </label>
          <select
            id="event"
            name="event"
            value={selectedEventId}
            onChange={handleEventChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            aria-label="Chọn Sự Kiện"
          >
            <option value="">Chọn một Sự Kiện</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </select>
          {errors.eventId && (
            <p className="text-red-500 text-xs italic">
              Vui lòng chọn một sự kiện.
            </p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Tên Nhiệm Vụ
          </label>
          <input
            id="name"
            type="text"
            placeholder="Tên Nhiệm Vụ"
            {...register("taskDetails[0].name", { required: true })}
            className="border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            aria-label="Tên Nhiệm Vụ"
          />
          {errors.taskDetails?.[0]?.name?.type === "required" && (
            <p className="text-red-500 text-xs italic">
              Tên nhiệm vụ là bắt buộc.
            </p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Mô Tả
          </label>
          <input
            id="description"
            type="text"
            placeholder="Mô Tả"
            {...register("taskDetails[0].description", { required: true })}
            className="border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            aria-label="Mô Tả"
          />
          {errors.taskDetails?.[0]?.description?.type === "required" && (
            <p className="text-red-500 text-xs italic">Mô tả là bắt buộc.</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="personInChargeName"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Người Phụ Trách
          </label>
          <input
            id="personInChargeName"
            type="text"
            placeholder="Tên Người Phụ Trách"
            {...register("taskDetails[0].personInChargeName")}
            className="border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            aria-label="Tên Người Phụ Trách"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="phoneNumber"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Số Điện Thoại
          </label>
          <input
            id="phoneNumber"
            type="tel"
            placeholder="Số Điện Thoại"
            {...register("taskDetails[0].phoneNumber")}
            className="border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            aria-label="Số Điện Thoại"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="cost"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Chi Phí
          </label>
          <input
            id="cost"
            type="number"
            placeholder="Chi Phí"
            {...register("taskDetails[0].cost")}
            className="border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            aria-label="Chi Phí"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="taskStatus"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Trạng Thái Nhiệm Vụ
          </label>
          <select
            id="taskStatus"
            {...register("taskDetails[0].taskStatus", { required: true })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            aria-label="Trạng Thái Nhiệm Vụ"
          >
            <option value="">Chọn Trạng Thái Nhiệm Vụ</option>
            <option value={0}>Chưa diễn ra</option>
            <option value={1}>Đang diễn ra</option>
          </select>
          {errors.taskDetails?.[0]?.taskStatus?.type === "required" && (
            <p className="text-red-500 text-xs italic">
              Trạng thái nhiệm vụ là bắt buộc.
            </p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="createDate"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Ngày Tạo
          </label>
          <input
            id="createDate"
            type="datetime-local"
            {...register("taskDetails[0].createdDate")}
            className="border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            aria-label="Ngày Tạo"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="endDate"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Ngày Kết Thúc
          </label>
          <input
            id="endDate"
            type="datetime-local"
            {...register("taskDetails[0].endDate")}
            className="border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            aria-label="Ngày Kết Thúc"
          />
        </div>

        {error && <p className="text-red-500 text-xs italic">{error}</p>}

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {loading ? "Đang gửi..." : "Gửi"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManageTaskEvent;
