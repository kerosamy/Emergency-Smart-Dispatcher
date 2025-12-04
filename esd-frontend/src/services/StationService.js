// src/services/StationService.js
import axios from "axios";
import UserService from "./UserService"; // to get JWT token

const API_BASE_URL = "http://localhost:8080/stations";

const addStation = async (name, latitude, longitude, type) => {
  try {
    const token = UserService.getToken(); // get JWT token from UserService
    const response = await axios.post(
      `${API_BASE_URL}/add`,
      { name, latitude, longitude, type },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Add station error:", error.response?.data || error.message);
    throw error;
  }
};


const getAllStations = async () => {
  try {
    const token = UserService.getToken();
    const response = await axios.get(`${API_BASE_URL}/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(response.data);
    return response.data; // assuming backend returns List<StationDto>
  } catch (error) {
    console.error("Get all stations error:", error.response?.data || error.message);
    throw error;
  }
};

export default {
  addStation,
  getAllStations, // export it
};
