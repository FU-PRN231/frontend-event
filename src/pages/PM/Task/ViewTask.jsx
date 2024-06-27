import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiAlertCircle, FiCheckCircle, FiTrash2 } from "react-icons/fi";
import { RiErrorWarningFill } from "react-icons/ri";
import { getAllEvent } from "../../../api/eventApi";
import {
  deleteTask,
  getAllTasksOfEvent,
  getAllTasksOfEventByStatus,
  updateTaskStatus,
} from "../../../api/taskApi";
import LoadingComponent from "../../../components/LoadingComponent/LoadingComponent";

const ViewTask = ({ eventId }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(eventId || "");
  const [updateStatusMessage, setUpdateStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const TaskStatus = {
    No_status: "--",
    NOT_YET: "Chưa bắt đầu",
    ONGOING: "Đang tiến hành",
    FINISHED: "Hoàn thành",
    FAILED: "Thất bại",
  };
  const isSuccessful = {
    [TaskStatus.ONGOING]: true,
    [TaskStatus.FINISHED]: true,
    [TaskStatus.FAILED]: false,
  };
  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case TaskStatus.NOT_YET:
        return TaskStatus.ONGOING;
      case TaskStatus.ONGOING:
        return TaskStatus.FINISHED;
      case TaskStatus.FINISHED:
        return TaskStatus.NOT_YET;
      case TaskStatus.FAILED:
        return TaskStatus.NOT_YET;
      default:
        return TaskStatus.NOT_YET;
    }
  };
  const [selectedTaskStatus, setSelectedTaskStatus] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        if (selectedEventId) {
          const data = await getAllTasksOfEvent(selectedEventId, 1, 10);
          setTasks(data.result.items);
        } else {
          setTasks([]);
        }
      } catch (err) {
        setError("Lỗi khi lấy dữ liệu nhiệm vụ.");
        setTasks([]);
      }
      setLoading(false);
    };

    fetchTasks();
  }, [selectedEventId]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsData = await getAllEvent(1, 100);
        setEvents(eventsData.result.items);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sự kiện:", error);
      }
    };

    fetchEvents();
  }, []);

  const handleEventChange = (e) => {
    const selectedId = e.target.value;
    setSelectedEventId(selectedId);
  };

  useEffect(() => {
    const fetchTasksByStatus = async () => {
      setLoading(true);
      try {
        if (
          selectedEventId &&
          Object.values(TaskStatus).includes(selectedTaskStatus)
        ) {
          let apiStatus;
          switch (selectedTaskStatus) {
            case TaskStatus.NOT_YET:
              apiStatus = "0";
              break;
            case TaskStatus.ONGOING:
              apiStatus = "1";
              break;
            case TaskStatus.FINISHED:
              apiStatus = "2";
              break;
            case TaskStatus.FAILED:
              apiStatus = "3";
              break;
            default:
              apiStatus = "--";
              break;
          }

          const data = await getAllTasksOfEventByStatus(
            selectedEventId,
            1,
            10,
            apiStatus
          );

          if (data.result && data.result.items.length > 0) {
            setTasks(data.result.items);
          } else {
            setTasks([]);
          }
        } else {
          setTasks([]);
        }
      } catch (err) {
        setError("Lỗi khi lấy dữ liệu nhiệm vụ theo trạng thái.");
        setTasks([]);
      }
      setLoading(false);
    };

    fetchTasksByStatus();
  }, [selectedEventId, selectedTaskStatus]);

  const handleUpdateTaskStatus = async (taskId, currentStatus) => {
    const newStatus = getNextStatus(currentStatus);

    // Check if the transition is valid
    switch (currentStatus) {
      case TaskStatus.No_status:
        if (
          newStatus === TaskStatus.NOT_YET ||
          newStatus === TaskStatus.ONGOING ||
          newStatus === TaskStatus.FINISHED ||
          newStatus === TaskStatus.FAILED
        ) {
          break;
        } else {
          setError("Invalid status transition.");
          return;
        }
      case TaskStatus.NOT_YET:
        if (
          newStatus === TaskStatus.ONGOING ||
          newStatus === TaskStatus.FINISHED ||
          newStatus === TaskStatus.FAILED
        ) {
          break;
        } else {
          setError("Invalid status transition.");
          return;
        }
      case TaskStatus.ONGOING:
        if (
          newStatus === TaskStatus.FINISHED ||
          newStatus === TaskStatus.FAILED
        ) {
          break;
        } else {
          setError("Invalid status transition.");
          return;
        }
      case TaskStatus.FINISHED:
        if (newStatus === TaskStatus.FAILED) {
          break;
        } else {
          setError("Invalid status transition.");
          return;
        }
      default:
        setError("Invalid current status.");
        return;
    }

    // If the transition is valid, proceed with updating the status
    const isSuccessfulValue = isSuccessful[newStatus];

    try {
      const res = await updateTaskStatus(taskId, isSuccessfulValue);
      if (res.isSuccess) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskId ? { ...task, status: newStatus } : task
          )
        );
        setUpdateStatusMessage(
          `Cập nhật trạng thái nhiệm vụ thành công: ${
            newStatus === TaskStatus.FINISHED ? "Hoàn thành" : "Đang tiến hành"
          }`
        );
        setTimeout(() => {
          setUpdateStatusMessage("");
        }, 3000);
      } else {
        setError(res.messages[0] || "Lỗi khi cập nhật trạng thái nhiệm vụ.");
      }
    } catch (err) {
      setError("Lỗi khi cập nhật trạng thái nhiệm vụ.");
    }
  };

  const formatDate = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    return `${day}-${month}-${year}`;
  };
  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId, true);
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Lỗi khi xóa nhiệm vụ:", error);
      setError("Lỗi khi xóa nhiệm vụ.");
    }
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <LoadingComponent isLoading={isLoading} />

      <h1 className="text-2xl font-bold mb-4">Task List</h1>
      <div className="mb-4 flex flex-wrap justify-between">
        <div className="w-full md:w-5/12 mb-4 md:mb-0">
          <label className="block text-sm font-semibold mb-2" htmlFor="event">
            Chọn sự kiện
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-sm text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="event"
            name="event"
            value={selectedEventId}
            onChange={handleEventChange}
          >
            <option value=""> Chọn sự kiện</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </select>
          {errors.eventId && (
            <p className="text-red-500 text-xs italic mt-1">
              Vui lòng chọn một sự kiện.
            </p>
          )}
        </div>
        <div className="w-full md:w-5/12">
          <label
            className="block text-sm font-semibold mb-2"
            htmlFor="taskStatus"
          >
            Trạng thái công việc
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-sm text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="taskStatus"
            name="taskStatus"
            value={selectedTaskStatus}
            onChange={(e) => setSelectedTaskStatus(e.target.value)}
          >
            {Object.values(TaskStatus).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center">
          <LoadingComponent isLoading={isLoading} />
          <span className="ml-2 text-gray-600">Đang tải...</span>
        </div>
      ) : error ? (
        <div className="flex items-center text-red-500">
          <RiErrorWarningFill className="text-xl mr-2" />
          <span>Lỗi: {error}</span>
        </div>
      ) : tasks.length === 0 ? (
        <div className="flex items-center justify-center">
          <span className="text-gray-600 mr-2">
            Không tìm thấy nhiệm vụ nào.
          </span>
          <FiAlertCircle className="text-yellow-500 text-xl" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Công việc</th>
                <th className="py-2 px-4 border-b">Mô tả</th>
                <th className="py-2 px-4 border-b">Người phụ trách</th>
                <th className="py-2 px-4 border-b">Số điện thoại</th>
                <th className="py-2 px-4 border-b">Chi phí</th>
                <th className="py-2 px-4 border-b">Ngày tạo</th>
                <th className="py-2 px-4 border-b">Ngày kết thúc</th>
                <th className="py-2 px-4 border-b">Trạng thái</th>
                <th className="py-2 px-4 border-b">Tiêu đề sự kiện</th>
                <th className="py-2 px-4 border-b">Mô tả sự kiện</th>
                <th className="py-2 px-4 border-b">Ngày bắt đầu sự kiện</th>
                <th className="py-2 px-4 border-b">Ngày kết thúc sự kiện</th>
                <th className="py-2 px-4 border-b">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td className="py-2 px-4 border-b">{task.name}</td>
                  <td className="py-2 px-4 border-b">{task.description}</td>
                  <td className="py-2 px-4 border-b">
                    {task.personInChargeName}
                  </td>
                  <td className="py-2 px-4 border-b">{task.phoneNumber}</td>
                  <td className="py-2 px-4 border-b">{task.cost}</td>
                  <td className="py-2 px-4 border-b">
                    {formatDate(task.createdDate)}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {formatDate(task.endDate)}
                  </td>
                  <td className="py-2 px-4 border-b">{task.status}</td>
                  <td className="py-2 px-4 border-b">{task.event.title}</td>
                  <td className="py-2 px-4 border-b">
                    {task.event.description}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {formatDate(task.event.startEventDate)}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {formatDate(task.event.endEventDate)}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button
                      className="text-blue-500 hover:text-blue-700 mr-4"
                      onClick={() =>
                        handleUpdateTaskStatus(task.id, task.status)
                      }
                    >
                      <FiCheckCircle />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewTask;
