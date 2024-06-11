export const getAllSurveys = async () => {
  try {
    const res = await axios.get(`${baseUrl}//survey/get-all-survey`);
    return res.data;
  } catch (err) {
    console.error("Error fetching survey:", err);
    return null;
  }
};

export const getAllAccount = async (pageIndex, pageSize) => {
  try {
    const res = await axios.post(
      `${baseUrl}/account/get-all-account?pageIndex=${pageIndex}&pageSize=${pageSize}`,
      []
    );
    return res.data;
  } catch (err) {
    return null;
  }
};
