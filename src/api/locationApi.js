import axios from "axios";
import { baseUrl } from "./config";

export const getAllAvailableLocations = async (startTime, endTime) => {
  try {
    const res = await axios.get(
      `${baseUrl}/location/get-available-location/${startTime}/${endTime}`
    );
    return res.data;
  } catch (err) {
    return null;
  }
};
