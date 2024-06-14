import axios from "axios";
import { baseUrl } from "./config";

export const getAllEventTasksByStatus = async (
  eventId,
  pageNumber,
  pageSize,
  taskStatus
) => {
  try {
    const url = `${baseUrl}/task/get-all-event-task-by-status/${eventId}/${pageNumber}/${pageSize}`;
    const res = await axios.get(url, {
      params: { taskStatus },
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching event tasks by status:", err);
    return null;
  }
};

export const assignTaskForEvent = async (eventId, taskDetails) => {
  try {
    const res = await axios.post(`${baseUrl}/task/assign-task-for-event`, {
      eventId,
      taskDetails,
    });
    return res.data;
  } catch (err) {
    console.error("Error assigning task for event:", err);
    return null;
  }
};

export const deleteTask = async (taskId, confirmed) => {
  try {
    const res = await axios.delete(`${baseUrl}/task/delete-task`, {
      params: { taskId, confirmed },
    });
    return res.data;
  } catch (err) {
    console.error("Error deleting task:", err);
    return null;
  }
};

export const getAllTasksOfEvent = async (eventId, pageNumber, pageSize) => {
  try {
    const res = await axios.get(
      `${baseUrl}/task/get-all-task-of-event/${eventId}/${pageNumber}/${pageSize}`
    );
    return res.data;
  } catch (err) {
    console.error("Error fetching all tasks of event:", err);
    return null;
  }
};

export const getTaskById = async (taskId) => {
  try {
    const res = await axios.get(`${baseUrl}/task/get-a-task-by-id/${taskId}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching task by ID:", err);
    return null;
  }
};

export const updateTaskStatus = async (taskId, isSuccessful) => {
  try {
    const res = await axios.put(`${baseUrl}/task/update-status-of-task`, null, {
      params: { taskId, isSuccessful },
    });
    return res.data;
  } catch (err) {
    console.error("Error updating task status:", err);
    return null;
  }
};

export const updateTaskForEvent = async (eventId, taskDetails) => {
  try {
    const res = await axios.put(`${baseUrl}/task/update-task-for-event`, {
      eventId,
      ...taskDetails,
    });
    return res.data;
  } catch (err) {
    console.error("Error updating task for event:", err);
    return null;
  }
};
