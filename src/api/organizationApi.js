import axios from "axios";
import { baseUrl } from "./config";

export const getAllOrganizations = async (pageNumber, pageSize) => {
  try {
    const res = await axios.get(
      `${baseUrl}/organization/get-all-organization?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return res.data;
  } catch (err) {
    console.error("Error fetching organizations:", err);
    return null;
  }
};
