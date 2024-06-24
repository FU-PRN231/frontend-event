import axios from "axios";

import { baseUrl } from "./config";
// Function to get all event tasks by status
export const getAllEventTasksByStatus = async (
  eventId,
  pageNumber,
  pageSize,
  taskStatus
) => {
  try {
    const res = await axios.get(
      `${baseUrl}/task/get-all-event-task-by-status/${eventId}/${pageNumber}/${pageSize}`
    );
  } catch (err) {
    console.error("Error fetching event tasks:", err);
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
    console.error("Error assigning task:", err);
    return null;
  }
};
export const getAllTasksOfEventByStatus = async (
  eventId,
  pageNumber,
  pageSize,
  taskStatus = null
) => {
  try {
    const url = `${baseUrl}/task/get-all-event-task-by-status/${eventId}/${pageNumber}/${pageSize}`;
    const params = taskStatus ? { params: { taskStatus } } : {};
    const res = await axios.get(url, params);
    return res.data;
  } catch (err) {
    console.error("Error fetching tasks:", err);
    throw err;
  }
};

// Function to delete a task
export const deleteTask = async (taskId, confirmed) => {
  try {
    const response = await axios.delete(`${baseUrl}/task/delete-task`, {
      params: {
        taskId: taskId,
        confirmed: confirmed,
      },
    });

    console.log("Task deleted:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting task:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// Function to get all tasks of an event
export const getAllTasksOfEvent = async (eventId, pageNumber, pageSize) => {
  try {
    const res = await axios.get(
      `${baseUrl}/task/get-all-task-of-event/${eventId}/${pageNumber}/${pageSize}`
    );
    return res.data;
  } catch (err) {
    console.error("Error fetching event tasks:", err);
    return null;
  }
};

// Function to get a task by ID
export const getTaskById = async (taskId) => {
  try {
    const res = await axios.get(`${baseUrl}/task/get-a-task-by-id/${taskId}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching task:", err);
    return null;
  }
};
export const updateTaskStatus = async (taskId, isSuccessful) => {
  try {
    const response = await axios.put(
      `${baseUrl}/task/update-status-of-task`,
      null, // No request body needed for query params
      {
        params: {
          taskId: taskId,
          isSuccessful: isSuccessful,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating task status:", error);
    throw error; // Optionally handle the error further up the call stack
  }
};
