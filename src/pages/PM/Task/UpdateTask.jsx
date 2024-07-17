import React from "react";
import { useForm } from "react-hook-form";
import { updateTaskStatus } from "../../../api/taskApi";

const UpdateTask = ({ task, onClose, onUpdateSuccess, onError }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const TaskStatus = {
    No_status: "--",
    0: "Chưa bắt đầu",
    1: "Đang tiến hành",
    2: "Hoàn thành",
    3: "Thất bại",
  };

  const isSuccessful = {
    [TaskStatus["2"]]: true,
    [TaskStatus["3"]]: true,
    [TaskStatus["4"]]: false,
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return "Chưa bắt đầu";
      case 1:
        return "Đang tiến hành";
      case 2:
        return "Hoàn thành";
      case 3:
        return "Thất bại";
      default:
        return "Chưa cập nhật";
    }
  };

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case TaskStatus["0"]:
        return TaskStatus["1"];
      case TaskStatus["1"]:
        return TaskStatus["2"];
      case TaskStatus["2"]:
        return TaskStatus["3"];
      case TaskStatus["1"]:
        return TaskStatus["3"];

      default:
        return currentStatus;
    }
  };

  const onSubmit = async (data) => {
    const { taskId, currentStatus } = data;
    const newStatus = getNextStatus(currentStatus);
    const isSuccessfulValue = isSuccessful[newStatus];

    try {
      const res = await updateTaskStatus(taskId, isSuccessfulValue);
      if (res.isSuccess) {
        onUpdateSuccess(newStatus);
        onClose(); // Close the modal after update
      } else {
        onError(res.messages[0] || "Lỗi khi cập nhật trạng thái nhiệm vụ.");
      }
    } catch (err) {
      console.error("Error updating task status:", err);
      onError("Lỗi khi cập nhật trạng thái nhiệm vụ.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-8 w-96 rounded shadow-lg">
        <h2 className="text-lg font-semibold mb-4">
          Cập nhật trạng thái nhiệm vụ
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" {...register("taskId")} value={task.id} />
          <div className="mb-4">
            <label
              htmlFor="currentStatus"
              className="block text-sm font-medium text-gray-700"
            >
              Trạng thái hiện tại
            </label>
            <input
              id="currentStatus"
              type="text"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={getStatusText(task.status)} // Use getStatusText to fetch status dynamically
              disabled
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="newStatus"
              className="block text-sm font-medium text-gray-700"
            >
              Trạng thái mới
            </label>
            <select
              id="newStatus"
              {...register("currentStatus", { required: true })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {Object.values(TaskStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            {errors.currentStatus && (
              <span className="text-red-500 text-sm italic">
                Vui lòng chọn trạng thái mới cho nhiệm vụ.
              </span>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="mr-2 inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onClick={onClose}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateTask;
