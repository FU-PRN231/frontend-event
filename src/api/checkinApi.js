import axios from "axios";
import { baseUrl } from "./config";

export const generateAccountQrCode = async (accountId) => {
  try {
    const response = await axios.get(
      `${baseUrl}/account/generate-account-qr-code/${accountId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error generating account QR code:", error);
    if (error.response) {
      console.error("Error response data:", error.response.data);
    }
    throw error;
  }
};

export const decodeQrCode = async (qrString) => {
  try {
    const response = await axios.get(
      `${baseUrl}/account/decode-qr/${encodeURIComponent(qrString)}`
    );
    return response.data;
  } catch (error) {
    console.error("Error decoding QR code:", error);
    if (error.response) {
      console.error("Error response data:", error.response.data);
    }
    throw error;
  }
};
// Add an attendee
export const addAttendee = async (accountId, eventId) => {
  try {
    const response = await axios.put(`${baseUrl}/attendee`, {
      accountId,
      eventId,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding attendee:", error);
    if (error.response) {
      console.error("Error response data:", error.response.data);
    }
    throw error;
  }
};

// Get all attendees by event ID
export const getAllAttendeesByEventId = async (eventId) => {
  try {
    const response = await axios.get(
      `${baseUrl}/attendee/get-all-attendee-by-eventId/${eventId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error getting attendees by event ID:", error);
    if (error.response) {
      console.error("Error response data:", error.response.data);
    }
    throw error;
  }
};
