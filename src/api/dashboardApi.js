import axios from "axios";
import { baseUrl } from "./config";
export const getOverAllReport = async (organizationId, timePeriod) => {
  try {
    if (organizationId == null) {
      const response = await axios.get(
        `${baseUrl}/report/get-overall-report?timePeriod=${timePeriod}`
      );
      return response.data;
    }
    const response = await axios.get(
      `${baseUrl}/report/get-overall-report?organizationId=${organizationId}&timePeriod=${timePeriod}`
    );
    return response.data;
  } catch (err) {
    return null;
  }
};

export const getEventDetailReport = async (id) => {
  try {
    const response = await axios.get(
      `${baseUrl}/report/get-event-detail-report/${id}`
    );
    return response.data;
  } catch (err) {
    return null;
  }
};
