import axios from "axios";
import UserService from "./UserService";

const API_URL = "http://localhost:8080/incidents";

class IncidentService {
  async getAllIncidents() {
    const token = UserService.getToken();
    const res = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }

  async addIncident(incidentDto) {
    const token = UserService.getToken();
    const res = await axios.post(API_URL, incidentDto, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }

  async confirmArrival(id, userEmail) {
    const token = UserService.getToken();
    const res = await axios.patch(
      `${API_URL}/${id}/arrival`,
      null,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { userEmail },  // <-- HERE
      }
    );
    return res.data;
  }

  async resolveIncident(id, userEmail) {
    const token = UserService.getToken();
    const res = await axios.patch(
      `${API_URL}/${id}/resolve`,
      null,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { userEmail },  // <-- HERE
      }
    );
    return res.data;
  }


  async assignVehicle(incidentId, vehicleId) {
    const token = UserService.getToken();
    const res = await axios.post(
      `${API_URL}/${incidentId}/assign/${vehicleId}`,
      {}, // empty body
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  }
   async getReportedIncidents() {
    const token = UserService.getToken();
    const res = await axios.get(`${API_URL}/reported`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }
}

export default new IncidentService();