import { Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Map from "./pages/Map";
import DispatchMap from "./pages/DispatchMap";
import AddUser from "./pages/AddUser";
import AddVehicle from "./pages/AddVehicle";
import AddIncident from "./pages/AddIncident";
import Assign from "./pages/Assign";
import AddStation from "./pages/AddStation";

export const routes = [
  { path: "/", element: <Navigate to="/login" />, isProtected: false },
  { path: "/login", element: <Login />, isProtected: false },
  { path: "/dashboard", element: <Dashboard />, isProtected: true },
  { path: "/DispatchMap", element: <DispatchMap />, isProtected: true },
  { path: "/add-user", element: <AddUser />, isProtected: true },
  { path: "/add-vehicle", element: <AddVehicle />, isProtected: true },
  { path: "/add-incident", element: <AddIncident />, isProtected: true },
  { path: "/assign", element: <Assign />, isProtected: true },
  { path: "/add-station", element: <AddStation />, isProtected: true },

];

export const TopBarPages = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Dispatch Map", path: "/DispatchMap" },
  { name: "Add User", path: "/add-user" },
  { name: "Add Vehicle", path: "/add-vehicle" },
  { name: "Add Incident", path: "/add-incident" },
  { name: "Assign", path: "/assign" },
  { name: "Add Station", path: "/add-station" },
];
export default routes;