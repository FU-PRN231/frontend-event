import React, { useState } from "react";
import Modal from "react-modal";
import { updateTaskForEvent } from "../../../api/taskApi"; // Adjust the import path as needed

const UpdateTaskForEvent = ({ isOpen, onRequestClose, eventId }) => {
  const [taskData, setTaskData] = useState({
    id: "",
    name: "",
    description: "",
    personInChargeName: "",
    phoneNumber: "",
    cost: 0,
    taskStatus: 0,
    createdDate: "",
    endDate: "",
  });

  const [isSuccess, setIsSuccess] = useState(null);
  const [messages, setMessages] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateTaskForEvent(eventId, taskData);
      setIsSuccess(response.isSuccess);
      setMessages(response.messages);
    } catch (error) {
      console.error("Error updating task for event:", error);
      setIsSuccess(false);
      setMessages([error.message]);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Update Task For Event"
    >
      <h2>Update Task For Event</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Task ID:
          <input
            type="text"
            name="id"
            value={taskData.id}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={taskData.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={taskData.description}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Person In Charge:
          <input
            type="text"
            name="personInChargeName"
            value={taskData.personInChargeName}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Phone Number:
          <input
            type="text"
            name="phoneNumber"
            value={taskData.phoneNumber}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Cost:
          <input
            type="number"
            name="cost"
            value={taskData.cost}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Task Status:
          <input
            type="number"
            name="taskStatus"
            value={taskData.taskStatus}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Created Date:
          <input
            type="datetime-local"
            name="createdDate"
            value={taskData.createdDate}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          End Date:
          <input
            type="datetime-local"
            name="endDate"
            value={taskData.endDate}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Update Task</button>
      </form>
      {isSuccess !== null && (
        <div>
          {isSuccess ? (
            <p>Task updated successfully!</p>
          ) : (
            <p>Error updating task: {messages.join(", ")}</p>
          )}
        </div>
      )}
    </Modal>
  );
};

export default UpdateTaskForEvent;
