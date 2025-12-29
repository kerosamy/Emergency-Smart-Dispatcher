import axios from "axios";
import UserService from "./UserService";

const API_URL = "http://localhost:8080/vehicles";

class VehicleService {
  async getUnassignedVehicles() {
    const token = UserService.getToken();

    const res = await axios.get(`${API_URL}/unassigned`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  }

  async getAllVehicles() {
    const token = UserService.getToken();
    console.log("Fetching all vehicles with token:", token);
    const res = await axios.get(`${API_URL}/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("All vehicles response data:", res.data);
    
    return res.data; // List<VehicleListDto>
  }

  async assignResponder(vehicleId, name) {
    const token = UserService.getToken();

    const res = await axios.post(
      `${API_URL}/assign`,
      {},
      {
        params: { vehicleId, name },
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return res.data;
  }

  async addVehicle(vehicleDto) {
    const token = UserService.getToken();

    const res = await axios.post(`${API_URL}/add`, vehicleDto, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  }
   
  async getAvailableVehicles() {
    const token = UserService.getToken();
    const res = await axios.get(`${API_URL}/available`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }

    async deleteVehicle(vehicleId) {
    const token = UserService.getToken();
    const res = await axios.delete(`${API_URL}/delete/${vehicleId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }


  async getVehicleLocations() {
  const token = UserService.getToken();
  const res = await axios.get(`${API_URL}/locations`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data; // Returns List<VehicleLocationDto>
}

  
}

export default new VehicleService();
