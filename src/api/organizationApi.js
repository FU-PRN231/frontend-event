import api from "../api/config";

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
export const deleteOrganization = async (id) => {
  try {
    const res = await api.delete(`/organization/delete-organization?${id}`);
    return res.data;
  } catch (err) {
    console.error("Error deleting organization:", err);
    return null;
  }
};

export const createOrganization = async (data) => {
  try {
    const res = await api.post(`/organization/create-organization`, data);
    return res.data;
  } catch (err) {
    console.error("Error creating organization:", err);
    return { isSuccess: false, messages: [err.message] };
  }
};

export const updateOrganization = async (data) => {
  try {
    const res = await api.put(`/organization/update-organization`, data);
    return res.data;
  } catch (err) {
    console.error("Error updating organization:", err);
    return { isSuccess: false, messages: [err.message] };
  }
};
