import axios from "axios";
import { baseUrl } from "./config";

// sponsorApi.js

export const getAllSponsors = async (pageNumber = 1, pageSize = 100) => {
  try {
    const res = await axios.get(
      `${baseUrl}/sponsor/get-all-sponsors?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return res.data;
  } catch (err) {
    console.error("Error fetching sponsors:", err);
    return null;
  }
};

export const addSponsor = async (formData) => {
  try {
    const res = await axios.post(`${baseUrl}/account/add-sponsor`, formData);

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
        eventId: eventId,
        sponsorItems: sponsorItems.map((item) => ({
          sponsorType: item.sponsorType,
          sponsorDescription: item.sponsorDescription,
          moneySponsorAmount: item.moneySponsorAmount,
          sponsorId: item.sponsorId,
        })),
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error adding sponsor money to event:", error);
    throw error;
  }
};
