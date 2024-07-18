import api from "../api/config"


export const getAllAvailableLocations = async (startTime, endTime) => {
  try {
    const res = await api.get(
      `/location/get-available-location/${startTime}/${endTime}`
    );
    return res.data;
  } catch (err) {
    return null;
  }
};
