import { Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DispatchMap from "./pages/DispatchMap";
import AddUser from "./pages/AddUser";
import Vehicles from "./pages/Vehicles";
import Assign from "./pages/Assign";
import AddStation from "./pages/AddStation";
import Incidents from "./pages/Incidents";

export const routes = [
  { path: "/", element: <Navigate to="/login" />, isProtected: false },
  { path: "/login", element: <Login />, isProtected: false },
  { path: "/dashboard", element: <Dashboard />, isProtected: true },
  { path: "/DispatchMap", element: <DispatchMap />, isProtected: true },
  { path: "/add-user", element: <AddUser />, isProtected: true },
  { path: "/vehicles", element: <Vehicles />, isProtected: true },
  { path: "/incidents", element: <Incidents />, isProtected: true },
  { path: "/assign", element: <Assign />, isProtected: true },
  { path: "/add-station", element: <AddStation />, isProtected: true },

];

export const TopBarPages = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Dispatch Map", path: "/DispatchMap" },
  { name: "Vehicles", path: "/vehicles" },
  { name: "Incidents", path: "/incidents" },
  { name: "Assign", path: "/assign" },
  { name: "Add Station", path: "/add-station" },
  { name: "Add User", path: "/add-user" },
];
export default routes;