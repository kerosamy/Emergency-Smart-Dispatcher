// src/services/UserService.js
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/users"; // replace with your backend URL

const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/sign-in`, { email, password });
    const { token } = response.data;
    if (token) {
      console.log("Received token:", token);
      localStorage.setItem("token", token); 
    }
    return token;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw error;
  }
};


const logout = () => {
  localStorage.removeItem("token");
};

const getToken = () => localStorage.getItem("token");

const addUser = async (name, email, password, role) => {
  try {
    const token = getToken(); // get token from localStorage
    const response = await axios.post(
      `${API_BASE_URL}/add-user`,
      { name, email, password, role },
      {
        headers: { Authorization: `Bearer ${token}` }, // if backend requires auth
      }
    );
    return response.data;
  } catch (error) {
    console.error("Add user error:", error.response?.data || error.message);
    throw error;
  }
};

export default {
  login,
  logout,
  getToken,
  addUser,
};
