import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiLoader,
  FiTrash2,
} from "react-icons/fi";
import { getAllEvent } from "../../../api/eventApi";
import {
  deleteTask,
  getAllTasksOfEvent,
  getAllTasksOfEventByStatus,
  updateTaskStatus,
} from "../../../api/taskApi";

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
  const [selectedTaskStatus, setSelectedTaskStatus] = useState("");

  const TaskStatus = {
    No_status: "--",
    NOT_YET: "Chưa",
    ONGOING: "Đang diễn ra",
    FINISHED: "Đã hoàn thành",
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
  const getStatusDisplay = (status) => {
    switch (status) {
      case TaskStatusResponse.No_status:
        return TaskStatus.No_status;
      case TaskStatusResponse.NOT_YET:
        return TaskStatus.NOT_YET;
      case TaskStatusResponse.ONGOING:
        return TaskStatus.ONGOING;
      case TaskStatusResponse.FINISHED:
        return TaskStatus.FINISHED;
      case TaskStatusResponse.FAILED:
        return TaskStatus.FAILED;
      default:
        return TaskStatus.No_status;
    }
  };
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        if (selectedEventId) {
          const data = await getAllTasksOfEvent(selectedEventId, 1, 100);
          setTasks(data.result.items);
        } else {
          setTasks([]);
        }
      } catch (err) {
        setError("Error fetching tasks.");
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
        console.error("Error fetching events:", error);
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
              apiStatus = TaskStatusResponse.NOT_YET.toString();
              break;
            case TaskStatus.ONGOING:
              apiStatus = TaskStatusResponse.ONGOING.toString();
              break;
            case TaskStatus.FINISHED:
              apiStatus = TaskStatusResponse.FINISHED.toString();
              break;
            case TaskStatus.FAILED:
              apiStatus = TaskStatusResponse.FAILED.toString();
              break;
            default:
              apiStatus = "--"; // Default case
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
        setError("Error fetching tasks by status.");
        setTasks([]);
      }
      setLoading(false);
    };
    if (selectedEventId) {
      fetchTasksByStatus();
    }
  }, [selectedEventId, selectedTaskStatus]);

  const handleUpdateTaskStatus = async (taskId, currentStatus) => {
    const newStatus = getNextStatus(currentStatus);
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
          `Task status updated successfully: ${
            newStatus === TaskStatus.FINISHED ? "Finished" : "Ongoing"
          }`
        );
        setTimeout(() => {
          setUpdateStatusMessage("");
        }, 3000);
      } else {
        setError(res.messages[0] || "Error updating task status.");
      }
    } catch (err) {
      setError("Error updating task status.");
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
      console.error("Error deleting task:", error);
      setError("Error deleting task.");
    }
  };
  return (
    <div className="container mx-auto px-4 py-8">
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
              Trạng thái công việc
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

      {loading ? (
        <div className="text-center">
          <FiLoader className="inline-block animate-spin text-4xl" />
          <p>Loading...</p>
        </div>
      ) : error ? (
        <div className="text-center text-red-500">
          <FiAlertCircle className="inline-block text-4xl mb-2" />
          <p>Error: {error}</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center">
          <FiAlertCircle className="inline-block text-4xl mb-2" />
          <p>No tasks found for the selected criteria.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 table-auto">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Công Việc</th>
                <th className="py-2 px-4 border-b">Mô Tả</th>
                <th className="py-2 px-4 border-b">Người Phụ Trách</th>
                <th className="py-2 px-4 border-b">Số Điện Thoại</th>
                <th className="py-2 px-4 border-b">Chi Phí</th>
                <th className="py-2 px-4 border-b">Ngày Tạo</th>
                <th className="py-2 px-4 border-b">Ngày Kết Thúc</th>
                <th className="py-2 px-4 border-b">Trạng Thái</th>
                <th className="py-2 px-4 border-b">Tiêu Đề Sự Kiện</th>
                <th className="py-2 px-4 border-b">Mô Tả Sự Kiện</th>
                <th className="py-2 px-4 border-b">Ngày Bắt Đầu Sự Kiện</th>
                <th className="py-2 px-4 border-b">Ngày Kết Thúc Sự Kiện</th>
                <th className="py-2 px-4 border-b">Actions</th>
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
                  <td className="py-2 px-4 border-b">
                    {getStatusDisplay[task.status]}
                  </td>
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
