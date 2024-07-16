import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getAllEvent } from "../../../api/eventApi";
import { assignTaskForEvent } from "../../../api/taskApi";

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
  const TaskStatus = {
    NOT_YET: "Chưa diễn ra",
    ONGOING: "Đang diễn ra",
    FINISHED: "Đã hoàn thành",
    FAILED: "Thất bại",
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsData = await getAllEvent(1, 100);
        setEvents(eventsData.result.items);
      } catch (error) {
        console.error("Lỗi khi lấy sự kiện:", error);
      }
    };

    fetchEvents();
  }, []);

  const handleEventChange = (e) => {
    const selectedId = e.target.value;
    setSelectedEventId(selectedId);
  };

  const handleAssignTask = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await assignTaskForEvent(selectedEventId, formData);
      setTasks((prevTasks) => [...prevTasks, data]);
      reset();
    } catch (err) {
      console.error("Lỗi khi gán công việc cho sự kiện:", err);
      setError("Lỗi khi gán công việc. Vui lòng thử lại sau.");
    }
    setLoading(false);
  };

  const onSubmit = (formData) => {
    handleAssignTask(formData.taskDetails[0]);
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-xl font-semibold mb-4 text-center">Công Việc Mới </h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="event"
          >
            Chọn Sự Kiện{" "}
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="event"
            name="event"
            value={selectedEventId}
            onChange={handleEventChange}
          >
            <option value=""> Chọn Sự Kiện</option>
            {events &&
              events.map((event) => (
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
            Công Việc
          </label>
          <input
            id="name"
            type="text"
            placeholder="Task Name"
            {...register("taskDetails[0].name", { required: true })}
            className="border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.taskDetails?.[0]?.name?.type === "required" && (
            <p className="text-red-500 text-xs italic">
              Tên công việc là bắt buộc.
            </p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Nội dung
          </label>
          <input
            id="description"
            type="text"
            placeholder="Description"
            {...register("taskDetails[0].description", { required: true })}
            className="border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.taskDetails?.[0]?.description?.type === "required" && (
            <p className="text-red-500 text-xs italic">Nội dung là bắt buộc</p>
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
            placeholder="Person in Charge Name"
            {...register("taskDetails[0].personInChargeName")}
            className="border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
            type="text"
            placeholder="Phone Number"
            {...register("taskDetails[0].phoneNumber")}
            className="border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
            placeholder="Cost"
            {...register("taskDetails[0].cost")}
            className="border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="taskStatus"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Trạng Thái
          </label>
          <select
            id="taskStatus"
            {...register("taskDetails[0].taskStatus", { required: true })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Chọn Trạng Thái Công Việc</option>
            <option value={TaskStatus.NOT_YET}>Chưa diễn ra</option>
            <option value={TaskStatus.ONGOING}>Đang diễn ra</option>
            <option value={TaskStatus.FINISHED}>Đã hoàn thành</option>
            <option value={TaskStatus.FAILED}>Thất bại</option>{" "}
          </select>

          {errors.taskDetails?.[0]?.taskStatus?.type === "required" && (
            <p className="text-red-500 text-xs italic">
              Trạng thái công việc là bắt buộc.
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
            placeholder="Create Date"
            {...register("taskDetails[0].createdDate")}
            className="border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
            placeholder="End Date"
            {...register("taskDetails[0].endDate")}
            className="border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <button
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={loading}
        >
          {loading ? "Đang khởi tạp..." : "Khỏi tạo "}
        </button>
      </form>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default ManageTaskEvent;
