import axios from "axios";
import { baseUrl } from "./config";

// Insert a new survey form
export const insertSurveyForm = async (formData) => {
  try {
    const res = await axios.post(
      `${baseUrl}/survey/insert-survey-form`,
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
    const res = await axios.post(
      `${baseUrl}/survey/add-answer-to-survey`,
      answerData
    );
    return res.data;
  } catch (err) {
    console.error("Error adding answer to survey:", err);
    throw err;
  }
};

// Get survey by ID
export const getSurveyById = async (id) => {
  try {
    const res = await axios.get(`${baseUrl}/survey/get-survey-by-id/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error getting survey by ID:", err);
    throw err;
  }
};

// Get all surveys
export const getAllSurveys = async () => {
  try {
    const res = await axios.get(`${baseUrl}/survey/get-all-survey`);
    return res.data;
  } catch (err) {
    console.error("Error getting all surveys:", err);
    throw err;
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
    console.error("Error getting surveys by organization ID:", err);
    throw err;
  }
};
