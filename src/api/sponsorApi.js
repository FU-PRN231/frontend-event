import axios from "axios";
import { baseUrl } from "./config";

export const getAllSponsors = async () => {
  try {
    const res = await axios.get(`${baseUrl}/sponsor/get-all-sponsors`);
    return res.data;
  } catch (err) {
    console.error("Error fetching sponsors:", err);
    return null;
  }
};

export const addSponsor = async (eventId, sponsorDtos) => {
  try {
    const formData = new FormData();
    formData.append("EventId", eventId);

    sponsorDtos.forEach((sponsor, index) => {
      formData.append(`SponsorDtos[${index}].name`, sponsor.name);
      formData.append(`SponsorDtos[${index}].description`, sponsor.description);
      formData.append(`SponsorDtos[${index}].phoneNumber`, sponsor.phoneNumber);
      formData.append(`SponsorDtos[${index}].email`, sponsor.email);
      formData.append(`SponsorDtos[${index}].img`, sponsor.img);
    });

    const res = await axios.post(`${baseUrl}/sponsor/add-sponsor`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (err) {
    console.error("Error adding sponsor:", err);
    return null;
  }
};
export const getAllEvent = async (pageNumber, pageSize) => {
  try {
    const res = await axios.get(
      `${baseUrl}/api/Event/get-all-event?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return res.data;
  } catch (err) {
    console.error("Error fetching events:", err);
    return null;
  }
};
