export const getAllSurveys = async () => {
  try {
    const res = await axios.get(`${baseUrl}/survey/get-all-survey`);
    return res.data;
  } catch (err) {
    console.error("Error fetching survey:", err);
    return null;
  }
};
//get all account
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
// Insert survey form
export const insertSurveyForm = async (data) => {
  try {
    const res = await axios.post(`${baseUrl}/survey/insert-survey-form`, data);
    return res.data;
  } catch (err) {
    console.error("Error inserting survey form:", err);
    return null;
  }
};

// Add answer to survey
export const addAnswerToSurvey = async (data) => {
  try {
    const res = await axios.post(
      `${baseUrl}/survey/add-answer-to-survey`,
      data
    );
    return res.data;
  } catch (err) {
    console.error("Error adding answer to survey:", err);
    return null;
  }
};

// Get survey by ID
export const getSurveyById = async (id) => {
  try {
    const res = await axios.get(`${baseUrl}/survey/get-survey-by-id/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching survey by ID:", err);
    return null;
  }
};

// Get surveys by organization ID
export const getSurveysByOrganizationId = async (organizationId) => {
  try {
    const res = await axios.get(
      `${baseUrl}/survey/get-survey-by-organization-id/${organizationId}`
    );
    return res.data;
  } catch (err) {
    console.error("Error fetching surveys by organization ID:", err);
    return null;
  }
};
