import { Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Map from "./pages/Map";
import DispatchMap from "./pages/DispatchMap";
import AddUser from "./pages/AddUser";
import Vehicles from "./pages/Vehicles";
import AddIncident from "./pages/AddIncident";
import Assign from "./pages/Assign";
import AddStation from "./pages/AddStation";
import MapView from "./pages/MapView";


export const routes = [
  { path: "/", element: <Navigate to="/login" />, isProtected: false },
  { path: "/login", element: <Login />, isProtected: false },
  { path: "/dashboard", element: <Dashboard />, isProtected: true },
  { path: "/DispatchMap", element: <DispatchMap />, isProtected: true },
  { path: "/add-user", element: <AddUser />, isProtected: true },
  { path: "/vehicles", element: <Vehicles />, isProtected: true },
  { path: "/add-incident", element: <AddIncident />, isProtected: true },
  { path: "/assign", element: <Assign />, isProtected: true },
  { path: "/add-station", element: <AddStation />, isProtected: true },
  { path: "/MapView", element: <MapView />, isProtected: true }

];

export const TopBarPages = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Map View", path: "/MapView" },
  { name: "Add User", path: "/add-user" },
  { name: "Vehicles", path: "/vehicles" },
  { name: "Add Incident", path: "/add-incident" },
  { name: "Assign", path: "/assign" },
  { name: "Add Station", path: "/add-station" },
];
export default routes;