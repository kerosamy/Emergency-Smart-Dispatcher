import axios from "axios";
import UserService from "./UserService";

const API_URL = "http://localhost:8080/incidents";

class IncidentService {
  // Get all incidents
  async getAllIncidents() {
    const token = UserService.getToken();
    const res = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }

  // Add a new incident
  async addIncident(incidentDto) {
    const token = UserService.getToken();
    const res = await axios.post(API_URL, incidentDto, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }

  // Confirm vehicle arrival at incident
  async confirmArrival(id) {
    const token = UserService.getToken();
    const res = await axios.patch(`${API_URL}/${id}/arrival`, null, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }

  // Resolve incident
  async resolveIncident(id) {
    const token = UserService.getToken();
    console.log("Resolving incident with token:", token);
    const res = await axios.patch(`${API_URL}/${id}/resolve`, null, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }

  // Assign a vehicle to an incident
  async assignVehicleToIncident(vehicleId, incidentId) {
    try {
      const token = UserService.getToken();
      const res = await axios.post(
        `${API_URL}/dispatch`, // Ensure this matches your backend endpoint
        { vehicleId, incidentId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Assign vehicle error:", error.response?.data || error.message);
      throw error;
    }
  }

  // Get reported incidents
  async getReportedIncidents() {
    const token = UserService.getToken();
    const res = await axios.get(`${API_URL}/reported`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }
}

export default new IncidentService();
