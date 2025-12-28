import axios from "axios";
import UserService from "./UserService";

const API_URL = "http://localhost:8080/api/analytics";

class ReportService {
  async getResponseTimeStats(type, day, month, year) {
    const token = UserService.getToken();
    const params = {};
    
    if (type) params.type = type;
    if (day) params.day = day;
    if (month) params.month = month;
    if (year) params.year = year;

    const res = await axios.get(`${API_URL}/response-time-stats`, {
      params,
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  }

  async getAvailableYears() {
    const token = UserService.getToken();

    const res = await axios.get(`${API_URL}/available-years`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  }

  async getTop10Vehicles(type) {
    const token = UserService.getToken();

    const url = type ? `${API_URL}/Top10Vehicles/${type}` : `${API_URL}/Top10Vehicles`;
    const res = await axios.get(url, {
      params: type ? {} : { type: null },
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  }

  async getTop10Stations(type) {
    const token = UserService.getToken();

    const url = type ? `${API_URL}/Top10Stations/${type}` : `${API_URL}/Top10Stations`;
    const res = await axios.get(url, {
      params: type ? {} : { type: null },
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  }
}

export default new ReportService();
