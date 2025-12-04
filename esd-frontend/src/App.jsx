import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import DispatchMap from './pages/DispatchMap'
import MapView from './pages/MapView'



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/map" element={<Map />} />
        <Route path="/DispatchMap" element={<DispatchMap />} />
        <Route path="/MapView" element={<MapView />} />


      </Routes>
    </BrowserRouter>
  )
}

export default App