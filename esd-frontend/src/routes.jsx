import { Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddUser from "./pages/AddUser";
import Vehicles from "./pages/Vehicles";
import Assign from "./pages/Assign";
import AddStation from "./pages/AddStation";
import Reports from "./pages/Reports";

import Incidents from "./pages/Incidents";

import MapView from "./pages/MapView";


export const routes = [
  { path: "/", element: <Navigate to="/login" />, isProtected: false },
  { path: "/login", element: <Login />, isProtected: false },
  { path: "/dashboard", element: <Dashboard />, isProtected: true },
  { path: "/add-user", element: <AddUser />, isProtected: true },
  { path: "/vehicles", element: <Vehicles />, isProtected: true },
  { path: "/incidents", element: <Incidents />, isProtected: true },
  { path: "/assign", element: <Assign />, isProtected: true },
  { path: "/add-station", element: <AddStation />, isProtected: true },
  { path: "/reports", element: <Reports />, isProtected: true },
  { path: "/MapView", element: <MapView />, isProtected: true }

];

export const TopBarPages = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Map View", path: "/MapView" },
  { name: "Add User", path: "/add-user" },
  { name: "Vehicles", path: "/vehicles" },
  { name: "Incidents", path: "/incidents" },
  { name: "Assign", path: "/assign" },
  { name: "Add Station", path: "/add-station" },
  { name: "Reports", path: "/reports" },
];
export default routes;