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
    NOT_YET: "Not Yet",
    ONGOING: "Ongoing",
    FINISHED: "Finished",
    FAILED: "Failed",
  };

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

  const handleAssignTask = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await assignTaskForEvent(selectedEventId, formData);
      setTasks((prevTasks) => [...prevTasks, data]);
      reset(); // Reset form fields
    } catch (err) {
      console.error("Error assigning task for event:", err);
      setError("Error assigning task. Please try again later.");
    }
    setLoading(false);
  };

  const onSubmit = (formData) => {
    handleAssignTask(formData.taskDetails[0]); // Pass taskDetails array directly
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Assign New Task
      </h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="event"
          >
            Select Event
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="event"
            name="event"
            value={selectedEventId}
            onChange={handleEventChange}
          >
            <option value="">Select Event</option>
            {events &&
              events.map((event) => (
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
            Person in Charge Name
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
            Phone Number
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
            Cost
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
            Task Status
          </label>
          <select
            id="taskStatus"
            {...register("taskDetails[0].taskStatus", { required: true })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select Task Status</option>
            <option value={TaskStatus.NOT_YET}>Not Yet</option>
            <option value={TaskStatus.ONGOING}>Ongoing</option>
            <option value={TaskStatus.FINISHED}>Finished</option>
            <option value={TaskStatus.FAILED}>Failed</option>
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
            End Date
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
          {loading ? "Assigning..." : "Assign"}
        </button>
      </form>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default ManageTaskEvent;
