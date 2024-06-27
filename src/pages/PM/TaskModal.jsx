import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getAllEvent } from "../../api/eventApi";
import { getAllTasksOfEvent } from "../../api/taskApi";
import ManageTaskEvent from "./Task/ManageTaskEvent";
import ViewTask from "./Task/ViewTask";

const TaskModal = ({ eventId }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [events, setEvents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [taskStatus, setTaskStatus] = useState("");
  const [newTaskDetails, setNewTaskDetails] = useState({
    name: "",
    description: "",
  });
  const [updateTaskDetails, setUpdateTaskDetails] = useState({
    id: "",
    name: "",
    description: "",
    status: "",
  });
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedEventId, setSelectedEventId] = useState("");
  const handleEventChange = (e) => {
    const selectedId = e.target.value;
    setSelectedEventId(selectedId);
  };
  const fetchEvents = async () => {
    try {
      const eventsData = await getAllEvent(1, 100);
      setEvents(eventsData.result.items);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);
  useEffect(() => {
    if (eventId) {
      fetchAllTasks();
    }
  }, [eventId]);

  const fetchAllTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllTasksOfEvent(eventId, pageNumber, pageSize);
      setTasks(data.tasks);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError("Error fetching tasks.");
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto mt-">
      <h1 className="text-3xl font-semibold mb-4">Tasks for Event</h1>
      <div className="pl-4 mt-8">
        <ViewTask />
      </div>
      {/* Task List */}
      <div className="pl-4 mt-8">
        <ManageTaskEvent />
      </div>
    </div>
  );
};

export default TaskModal;
