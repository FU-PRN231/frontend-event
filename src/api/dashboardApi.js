import api from "../api/config"

export const getOverAllReport = async (organizationId, timePeriod) => {
  try {
    if (organizationId == null) {
      const response = await api.get(
        `/report/get-overall-report?timePeriod=${timePeriod}`
      );
      return response.data;
    }
    const response = await api.get(
      `/report/get-overall-report?organizationId=${organizationId}&timePeriod=${timePeriod}`
    );
    return response.data;
  } catch (err) {
    return null;
  }
};

export const getEventDetailReport = async (id) => {
  try {
    const response = await api.get(
      `/report/get-event-detail-report/${id}`
    );
    return response.data;
  } catch (err) {
    return null;
  }
};
