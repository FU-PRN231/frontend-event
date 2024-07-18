import React, { useState } from "react";
import { updateTaskForEvent } from "../../../api/taskApi"; // Điều chỉnh đường dẫn import nếu cần

const UpdateTaskForEvent = ({ eventId }) => {
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
      console.error("Lỗi khi cập nhật nhiệm vụ cho sự kiện:", error);
      setIsSuccess(false);
      setMessages([error.message]);
    }
  };

  return (
    <div>
      <h2>Cập Nhật Nhiệm Vụ Cho Sự Kiện</h2>
      <form onSubmit={handleSubmit}>
        <label>
          ID Nhiệm Vụ:
          <input
            type="text"
            name="id"
            value={taskData.id}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Tên:
          <input
            type="text"
            name="name"
            value={taskData.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Mô Tả:
          <textarea
            name="description"
            value={taskData.description}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Người Phụ Trách:
          <input
            type="text"
            name="personInChargeName"
            value={taskData.personInChargeName}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Số Điện Thoại:
          <input
            type="text"
            name="phoneNumber"
            value={taskData.phoneNumber}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Chi Phí:
          <input
            type="number"
            name="cost"
            value={taskData.cost}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Trạng Thái Nhiệm Vụ:
          <input
            type="number"
            name="taskStatus"
            value={taskData.taskStatus}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Ngày Tạo:
          <input
            type="datetime-local"
            name="createdDate"
            value={taskData.createdDate}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Ngày Kết Thúc:
          <input
            type="datetime-local"
            name="endDate"
            value={taskData.endDate}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Cập Nhật Nhiệm Vụ</button>
      </form>
      {isSuccess !== null && (
        <div>
          {isSuccess ? (
            <p>Cập nhật nhiệm vụ thành công!</p>
          ) : (
            <p>Lỗi khi cập nhật nhiệm vụ: {messages.join(", ")}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default UpdateTaskForEvent;
