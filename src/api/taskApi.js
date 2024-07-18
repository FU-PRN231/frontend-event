import api from "../api/config";

// Function to get all event tasks by status
export const getAllEventTasksByStatus = async (
  eventId,
  pageNumber,
  pageSize,
  taskStatus
) => {
  try {
    const res = await api.get(
      `/task/get-all-event-task-by-status/${eventId}/${pageNumber}/${pageSize}`
    );
  } catch (err) {
    console.error("Error fetching event tasks:", err);
    return null;
  }
};

export const assignTaskForEvent = async (eventId, payload) => {
  try {
    const response = await api.post(`/task/assign-task-for-event`, payload);
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};
export const getAllTasksOfEventByStatus = async (
  eventId,
  pageNumber,
  pageSize,
  taskStatus = null
) => {
  try {
    const url = `/task/get-all-event-task-by-status/${eventId}/${pageNumber}/${pageSize}`;
    const params = taskStatus ? { params: { taskStatus } } : {};
    const res = await api.get(url, params);
    return res.data;
  } catch (err) {
    console.error("Error fetching tasks:", err);
    throw err;
  }
};

// Function to delete a task
export const deleteTask = async (taskId, confirmed) => {
  try {
    const response = await api.delete(`/task/delete-task`, {
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
    const res = await api.get(
      `/task/get-all-task-of-event/${eventId}/${pageNumber}/${pageSize}`
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
    const res = await api.get(`/task/get-a-task-by-id/${taskId}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching task:", err);
    return null;
  }
};
export const updateTaskStatus = async (taskId, isSuccessful) => {
  try {
    const response = await api.put(`/task/update-status-of-task`, null, {
      params: {
        taskId: taskId,
        isSuccessful: isSuccessful,
      },
    });

    return {
      isSuccess: response.data.isSuccess,
      messages: response.data.messages,
    };
  } catch (error) {
    console.error("Error updating task status:", error);
    throw error;
  }
};
export const updateTaskForEvent = async (eventId, taskData) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/task/update-task-for-event?eventId=${eventId}`,
      taskData
    );
    return {
      isSuccess: true,
      messages: ["Task updated successfully!"],
    };
  } catch (error) {
    console.error("Error updating task for event:", error);
    return {
      isSuccess: false,
      messages: [error.message || "Failed to update task. Please try again."],
    };
  }
};
