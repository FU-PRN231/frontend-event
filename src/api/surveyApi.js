import api from "../api/config"


// Insert a new survey form
export const insertSurveyForm = async (formData) => {
  try {
    const res = await api.post(
      `/survey/insert-survey-form`,
      formData
    );
    return res.data;
  } catch (err) {
    console.error("Error inserting survey form:", err);
    throw err;
  }
};

// Add answer to a survey
export const addAnswerToSurvey = async (answerData) => {
  try {
    const res = await api.post(
      `/survey/add-answer-to-survey`,
      answerData
    );
    return res.data;
  } catch (err) {
    console.error("Error adding answer to survey:", err);
    throw err;
  }
};

// Get survey by ID
export const getSurveyById = async (surveyId) => {
  try {
    const response = await api.get(
      `/survey/get-survey-by-id/${surveyId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error getting survey by ID:", error);
    throw error;
  }
};
// Get all surveys
export const getAllSurveys = async (formData) => {
  try {
    const res = await api.get(`/survey/get-all-survey`, formData);
    return res.data;
  } catch (err) {
    console.error("Error getting all surveys:", err);
    throw err;
  }
};

// Get surveys by organization ID
export const getSurveysByOrganizationId = async (organizationId) => {
  try {
    const res = await api.get(
      `/survey/get-survey-by-organization-id/${organizationId}`
    );
    return res.data;
  } catch (err) {
    console.error("Error getting surveys by organization ID:", err);
    throw err;
  }
};

export const getSurveysResponseBySurveyId = async (surveyId) => {
  try {
    const response = await api.get(
      `/survey/get-survey-response-by-survey-id/${surveyId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching survey data:", error);
    throw error;
  }
};
