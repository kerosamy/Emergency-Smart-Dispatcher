import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import IncidentForm from '../Components/IncidentForm'

function Dashboard() {
  const navigate = useNavigate()
  const [emergencies, setEmergencies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    active: 0,
    resolved: 0,
    available: 8,
    avgResponse: '4.2m'
  })
  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState('new')
  const [selectedIncident, setSelectedIncident] = useState(null)

  // Fetch all incidents when component loads
  useEffect(() => {
    fetchAllIncidents()
  }, [])

  const fetchAllIncidents = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:8080/api/incidents')
      
      if (!response.ok) {
        throw new Error('Failed to fetch incidents')
      }
      
      const data = await response.json()
      setEmergencies(data)
      
      // Calculate stats from the data
      const activeCount = data.filter(inc => 
        inc.status === 'reported' || inc.status === 'dispatched'
      ).length
      
      const resolvedCount = data.filter(inc => 
        inc.status === 'resolved'
      ).length
      
      setStats(prev => ({
        ...prev,
        active: activeCount,
        resolved: resolvedCount
      }))
      
      setError(null)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching incidents:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    navigate('/login')
  }

  const openNewIncidentForm = () => {
    setFormMode('new')
    setSelectedIncident(null)
    setFormOpen(true)
  }

  const openViewIncidentForm = (incident) => {
    setFormMode('view')
    setSelectedIncident(incident)
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setSelectedIncident(null)
  }

  const handleFormSuccess = () => {
    fetchAllIncidents()
  }

  const getEmergencyIcon = (type) => {
    const icons = {
      fire: '🔥',
      medical: '🚑',
      accident: '🚗',
      police: '👮',
      rescue: '🆘'
    }
    return icons[type?.toLowerCase()] || '⚠️'
  }

  const getSeverityLabel = (severity) => {
    const labels = {
      1: 'Low',
      2: 'Medium',
      3: 'High',
      4: 'Urgent',
      5: 'Critical'
    }
    return labels[severity] || 'Unknown'
  }

  const getPriorityColor = (severity) => {
    if (severity >= 4) return 'bg-red-900 text-red-200'
    if (severity >= 2) return 'bg-orange-900 text-orange-200'
    return 'bg-yellow-900 text-yellow-200'
  }

  const getStatusColor = (status) => {
    const colors = {
      reported: 'bg-yellow-900 text-yellow-300',
      dispatched: 'bg-blue-900 text-blue-300',
      resolved: 'bg-green-900 text-green-300'
    }
    return colors[status?.toLowerCase()] || 'bg-gray-900 text-gray-300'
  }

  const formatTime = (timestamp) => {
    if (!timestamp) return 'N/A'
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <nav className="bg-gradient-to-r from-red-900 to-red-800 border-b border-red-700 shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-red-600 p-2 rounded-lg animate-pulse">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">EMERGENCY DISPATCH</h1>
                <p className="text-red-300 text-sm">Real-time Command Center</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition duration-200 font-semibold flex items-center gap-2 shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-red-600 to-red-800 p-6 rounded-xl shadow-lg border border-red-500 transform hover:scale-105 transition duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-200 text-sm font-medium mb-1">Active Emergencies</p>
                <p className="text-4xl font-bold text-white">{stats.active}</p>
              </div>
              <div className="bg-red-700 bg-opacity-50 p-3 rounded-full">
                <svg className="w-8 h-8 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-800 p-6 rounded-xl shadow-lg border border-green-500 transform hover:scale-105 transition duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-sm font-medium mb-1">Resolved Today</p>
                <p className="text-4xl font-bold text-white">{stats.resolved}</p>
              </div>
              <div className="bg-green-700 bg-opacity-50 p-3 rounded-full">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-xl shadow-lg border border-blue-500 transform hover:scale-105 transition duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium mb-1">Available Units</p>
                <p className="text-4xl font-bold text-white">{stats.available}</p>
              </div>
              <div className="bg-blue-700 bg-opacity-50 p-3 rounded-full">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-600 to-orange-800 p-6 rounded-xl shadow-lg border border-yellow-500 transform hover:scale-105 transition duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-200 text-sm font-medium mb-1">Avg Response Time</p>
                <p className="text-4xl font-bold text-white">{stats.avgResponse}</p>
              </div>
              <div className="bg-yellow-700 bg-opacity-50 p-3 rounded-full">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Active Emergencies Table */}
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-red-900 to-red-800 px-6 py-4 border-b border-red-700 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
              All Incidents
            </h2>
            <button 
              onClick={fetchAllIncidents}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition duration-200"
            >
              Refresh
            </button>
          </div>
          
          {loading ? (
            <div className="p-8 text-center text-gray-400">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
              <p className="mt-4">Loading incidents...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-400 mb-4">Error: {error}</p>
              <button 
                onClick={fetchAllIncidents}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                Retry
              </button>
            </div>
          ) : emergencies.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              No incidents found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Severity</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {emergencies.map((emergency) => (
                    <tr key={emergency.id} className="hover:bg-gray-700 transition duration-150">
                      <td className="px-6 py-4 text-gray-300">#{emergency.id}</td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-2 text-white font-medium">
                          {getEmergencyIcon(emergency.type)}
                          {emergency.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {`X:${emergency.latitude}, Y:${emergency.longitude}`}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(emergency.status)}`}>
                          {emergency.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(emergency.severity)}`}>
                          {getSeverityLabel(emergency.severity)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">
                        {formatTime(emergency.reportTime)}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => openViewIncidentForm(emergency)} 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition duration-200">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <button 
            onClick={openNewIncidentForm}
            className="bg-gradient-to-br from-red-600 to-red-700 text-white p-6 rounded-xl shadow-lg border border-red-500 hover:scale-105 transition duration-200 flex items-center gap-4"
          >
            <div className="bg-red-800 p-3 rounded-full">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold">New Emergency</h3>
              <p className="text-red-200 text-sm">Report incident</p>
            </div>
          </button>

          <button className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-xl shadow-lg border border-blue-500 hover:scale-105 transition duration-200 flex items-center gap-4">
            <div className="bg-blue-800 p-3 rounded-full">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold">Reports</h3>
              <p className="text-blue-200 text-sm">View analytics</p>
            </div>
          </button>

          <button className="bg-gradient-to-br from-green-600 to-green-700 text-white p-6 rounded-xl shadow-lg border border-green-500 hover:scale-105 transition duration-200 flex items-center gap-4">
            <div className="bg-green-800 p-3 rounded-full">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold">Settings</h3>
              <p className="text-green-200 text-sm">Configure system</p>
            </div>
          </button>
        </div>
      </div>

      {/* Incident Form Modal */}
      <IncidentForm
        isOpen={formOpen}
        onClose={closeForm}
        mode={formMode}
        incidentData={selectedIncident}
        onSuccess={handleFormSuccess}
      />

      {/* Emergency Alert Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 h-1 animate-pulse"></div>
    </div>
  )
}

export default Dashboard