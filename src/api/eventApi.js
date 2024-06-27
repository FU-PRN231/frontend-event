import axios from "axios";
import { baseUrl } from "./config";

export const getAllEvent = async (pageNumber, pageSize) => {
  try {
    const res = await axios.get(
      `${baseUrl}/event/get-all-event?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return res.data;
  } catch (err) {
    return null;
  }
};
export const getAllAvailableEvent = async (pageNumber, pageSize) => {
  try {
    const res = await axios.get(
      `${baseUrl}/event/get-available-event?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return res.data;
  } catch (err) {
    return null;
  }
};

export const getEventById = async (id) => {
  try {
    const res = await axios.get(`${baseUrl}/event/get-event-by-id/${id}`);

    return res.data;
  } catch (err) {
    return null;
  }
};

export const createEvent = async (data) => {
  try {
    const res = await axios.post(`${baseUrl}/event/add-event`, data);
    return res.data;
  } catch (err) {
    return null;
  }
};

export const updateEvent = async (id, data) => {
  try {
    const res = await axios.post(`${baseUrl}/event/update-event/${id}`, data);
    return res.data;
  } catch (err) {
    return null;
  }
};
