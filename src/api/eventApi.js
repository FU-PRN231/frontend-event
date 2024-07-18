import api from "../api/config";

export const getAllEvent = async (pageNumber, pageSize) => {
  try {
    const res = await api.get(
      `/event/get-all-event?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return res.data;
  } catch (err) {
    return null;
  }
};
export const getAllAvailableEvent = async (pageNumber, pageSize) => {
  try {
    const res = await api.get(
      `/event/get-available-event?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return res.data;
  } catch (err) {
    return null;
  }
};

export const getEventById = async (id) => {
  try {
    const res = await api.get(`/event/get-event-by-id/${id}`);

    return res.data;
  } catch (err) {
    return null;
  }
};

export const createEvent = async (data) => {
  try {
    const res = await api.post(`/event/add-event`, data);
    return res.data;
  } catch (err) {
    return null;
  }
};

export const updateEvent = async (id, data) => {
  try {
    const res = await api.post(`/event/update-event/${id}`, data);
    return res.data;
  } catch (err) {
    return null;
  }
};

export const updateEventStatus = async (id, status) => {
  try {
    const res = await api.post(
      `/event/update-event-status?eventId=${id}&status=${status}`
    );
    return res.data;
  } catch (err) {
    return null;
  }
};

export const getEventBySponsorId = async (id, pageNumber, pageSize) => {
  try {
    const res = await api.get(
      `/event/get-sponsor-event/${id}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return res.data;
  } catch (err) {
    return null;
  }
};
export const getEventByOrganizerId = async (id, pageNumber, pageSize) => {
  try {
    const res = await api.get(
      `/event/get-all-event-by-organization-id/${id}/${pageNumber}/${pageSize}`
    );
    return res.data;
  } catch (err) {
    return null;
  }
};
