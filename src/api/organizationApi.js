import api from "../api/config"

export const getAllOrganizations = async (pageNumber, pageSize) => {
  try {
    const res = await api.get(
      `/organization/get-all-organization?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return res.data;
  } catch (err) {
    console.error("Error fetching organizations:", err);
    return null;
  }
};
