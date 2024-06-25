import axios from "axios";
import { baseUrl } from "./config";

export const getAllSponsors = async () => {
  try {
    const res = await axios.get(`${baseUrl}/sponsor/get-all-sponsors`);
    return res.data;
  } catch (err) {
    console.error("Error fetching sponsors:", err);
    return null;
  }
};

export const addSponsor = async (formData) => {
  try {
    const res = await axios.post(`${baseUrl}/account/add-sponsor`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (err) {
    console.error("Error adding sponsor:", err);
    throw err;
  }
};
export const getAllSponsorItemsOfEvent = async (
  eventId,
  pageNumber,
  pageSize
) => {
  try {
    const response = await axios.get(
      `${baseUrl}/sponsor/get-all-sponsor-item-of-an-event/${eventId}/${pageNumber}/${pageSize}`
    );

    return response.data;
  } catch (error) {
    console.error("Error getting sponsor items of event:", error);
    throw error;
  }
};

export const getSponsorHistoryByEventId = async (
  eventId,
  pageNumber,
  pageSize
) => {
  try {
    const response = await axios.get(
      `${baseUrl}/sponsor/get-sponsor-history-by-event-id/${eventId}/${pageNumber}/${pageSize}`,
      {
        headers: {
          Accept: "text/plain",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error getting sponsor history by event ID:", error);
    throw error;
  }
};
export const addSponsorMoneyToEvent = async (eventId, sponsorItems) => {
  try {
    const response = await axios.post(
      `${baseUrl}/sponsor/add-sponsor-money-to-event`,
      {
        eventId,
        sponsorItems,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error adding sponsor money to event:", error);
    throw error;
  }
};
