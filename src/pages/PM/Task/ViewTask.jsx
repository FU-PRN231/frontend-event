import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiAlertCircle, FiEdit2, FiTrash2 } from "react-icons/fi";
import { RiErrorWarningFill } from "react-icons/ri";
import { getAllEvent, getEventByOrganizerId } from "../../../api/eventApi";
import {
  deleteTask,
  getAllTasksOfEvent,
  getAllTasksOfEventByStatus,
} from "../../../api/taskApi";
import LoadingComponent from "../../../components/LoadingComponent/LoadingComponent";
import UpdateTask from "./UpdateTask";
import { useSelector } from "react-redux";

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
const user = useSelector((state)=> state.user.user|| {})
  const TaskStatus = {
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
  const TaskStatusUpdate = {
    NOT_YET: "Chưa bắt đầu",
    ONGOING: "Đang tiến hành",
    FINISHED: "Hoàn thành",
    FAILED: "Thất bại",
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
        return "Chưa cập nhập";
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
        const eventsData = await getEventByOrganizerId(user.organizationId,1, 100);
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
              apiStatus = "0";
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
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const handleOpenUpdateModal = () => {
    setShowUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
  };
  const handleUpdateSuccess = async (newStatus) => {
    console.log("Updated to:", newStatus);

    try {
      const updatedTask = await fetchTaskById(task.id);
    } catch (error) {
      console.error("Error fetching updated task:", error);
    }
  };

  const handleError = (errorMessage) => {
    console.error("Update error:", errorMessage);
  };

  const [selectedTask, setSelectedTask] = useState(null);
  const handleTaskDoubleClick = (task) => {
    setSelectedTask(task);
    setShowUpdateModal(true);
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
                <th className="py-2 px-4 border-b"></th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr
                  key={task.id}
                  className="cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                  onDoubleClick={() => handleTaskDoubleClick(task)}
                >
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
                    {getStatusText(task.status)}
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
                    <div>
                      <button
                        className="text-blue-500 hover:text-blue-700 mr-4"
                        onClick={handleOpenUpdateModal}
                      >
                        <FiEdit2 className="mr-2" />
                      </button>
                      {showUpdateModal && (
                        <UpdateTask
                          task={task}
                          onClose={handleCloseUpdateModal}
                          onUpdateSuccess={handleUpdateSuccess}
                          onError={handleError}
                        />
                      )}
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
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
