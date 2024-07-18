import { notification } from "antd";
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
            message: "Success",
            description: "Task assigned successfully.",
            placement: "topRight",
          });
          reset(); // Reset form after successful submission
        }
      } else {
        setError("Error assigning task. Please try again later.");
        notification.error({
          message: "Error",
          description: "Error assigning task. Please try again later.",
          placement: "topRight",
        });
      }
    } catch (err) {
      console.error("Error assigning task:", err);
      setError("Error assigning task. Please try again later.");
      notification.error({
        message: "Error",
        description: "Error assigning task. Please try again later.",
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
      <h2 className="text-xl font-semibold mb-4 text-center">New Task</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label
            htmlFor="event"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Select Event
          </label>
          <select
            id="event"
            name="event"
            value={selectedEventId}
            onChange={handleEventChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            aria-label="Select Event"
          >
            <option value="">Select an Event</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </select>
          {errors.eventId && (
            <p className="text-red-500 text-xs italic">
              Please select an event.
            </p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Task Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Task Name"
            {...register("taskDetails[0].name", { required: true })}
            className="border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            aria-label="Task Name"
          />
          {errors.taskDetails?.[0]?.name?.type === "required" && (
            <p className="text-red-500 text-xs italic">
              Task name is required.
            </p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Description
          </label>
          <input
            id="description"
            type="text"
            placeholder="Description"
            {...register("taskDetails[0].description", { required: true })}
            className="border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            aria-label="Description"
          />
          {errors.taskDetails?.[0]?.description?.type === "required" && (
            <p className="text-red-500 text-xs italic">
              Description is required.
            </p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="personInChargeName"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Person in Charge
          </label>
          <input
            id="personInChargeName"
            type="text"
            placeholder="Person in Charge Name"
            {...register("taskDetails[0].personInChargeName")}
            className="border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            aria-label="Person in Charge Name"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="phoneNumber"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Phone Number
          </label>
          <input
            id="phoneNumber"
            type="tel"
            placeholder="Phone Number"
            {...register("taskDetails[0].phoneNumber")}
            className="border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            aria-label="Phone Number"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="cost"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Cost
          </label>
          <input
            id="cost"
            type="number"
            placeholder="Cost"
            {...register("taskDetails[0].cost")}
            className="border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            aria-label="Cost"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="taskStatus"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Task Status
          </label>
          <select
            id="taskStatus"
            {...register("taskDetails[0].taskStatus", { required: true })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            aria-label="Task Status"
          >
            <option value="">Select Task Status</option>
            <option value={0}>Chưa diễn ra</option>
            <option value={1}>Đang diễn ra</option>
          </select>
          {errors.taskDetails?.[0]?.taskStatus?.type === "required" && (
            <p className="text-red-500 text-xs italic">
              Task status is required.
            </p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="createDate"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Create Date
          </label>
          <input
            id="createDate"
            type="datetime-local"
            {...register("taskDetails[0].createdDate")}
            className="border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            aria-label="Create Date"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="endDate"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            End Date
          </label>
          <input
            id="endDate"
            type="datetime-local"
            {...register("taskDetails[0].endDate")}
            className="border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            aria-label="End Date"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {loading ? "Loading..." : "Add Task"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManageTaskEvent;
