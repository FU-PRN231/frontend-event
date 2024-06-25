import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiCheckCircle, FiTrash2 } from "react-icons/fi";
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
  const TaskStatus = {
    No_status: "--",
    NOT_YET: "Not Yet",
    ONGOING: "Ongoing",
    FINISHED: "Finished",
    FAILED: "Failed",
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
        setError("Error fetching tasks by status.");
        setTasks([]);
      }
      setLoading(false);
    };

    fetchTasksByStatus();
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
            Select Event
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-sm text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="event"
            name="event"
            value={selectedEventId}
            onChange={handleEventChange}
          >
            <option value="">Select Event</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </select>
          {errors.eventId && (
            <p className="text-red-500 text-xs italic mt-1">
              Please select an event.
            </p>
          )}
        </div>
        <div className="w-full md:w-5/12">
          <label
            className="block text-sm font-semibold mb-2"
            htmlFor="taskStatus"
          >
            Select Task Status
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
        <div className="text-center">Loading...</div>
      ) : error ? (
        <div className="text-red-500">Error: {error}</div>
      ) : tasks.length === 0 ? (
        <div>No tasks found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Task Name</th>
                <th className="py-2 px-4 border-b">Description</th>
                <th className="py-2 px-4 border-b">Person in Charge</th>
                <th className="py-2 px-4 border-b">Phone Number</th>
                <th className="py-2 px-4 border-b">Cost</th>
                <th className="py-2 px-4 border-b">Created Date</th>
                <th className="py-2 px-4 border-b">End Date</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Event Title</th>
                <th className="py-2 px-4 border-b">Event Description</th>
                <th className="py-2 px-4 border-b">Event Start Date</th>
                <th className="py-2 px-4 border-b">Event End Date</th>
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
                      //   onClick={() =>
                      //     handleUpdateTaskStatus(
                      //     //   task.id,
                      //           //   task.status === 0 ? "ONGOING" : "NOT_YET"

                      //  }    )
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
