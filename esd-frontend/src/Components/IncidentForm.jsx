import { useState, useEffect } from 'react'

function IncidentForm({ isOpen, onClose, mode, incidentData, onSuccess }) {
  const [formData, setFormData] = useState({
    severity: '',
    type: '',
    location: '',
    longitude: '',
    latitude: '',
    capacity: '',
    reporterId: null,
    reporterName: '',
    assignedVehicleCount: 0
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (mode === 'view' && incidentData) {
      fetchIncidentDetails()
    } else if (mode === 'new') {
      resetForm()
    }
  }, [mode, incidentData, isOpen])

  const fetchIncidentDetails = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`http://localhost:8080/api/incidents/${incidentData.id}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch incident: ${response.status}`)
      }
      
      const incident = await response.json()
      console.log('Fetched incident:', incident)

      setFormData({
        severity: incident.severity || '',
        type: incident.type || '',
        location: incident.location || '',
        longitude: incident.longitude || '',
        latitude: incident.latitude || '',
        capacity: incident.capacity || '',
        reporterId: incident.reporterId,
        reporterName: incident.reporterName || 'Unknown',
        assignedVehicleCount: incident.assignedVehicleCount || 0
      })
    } catch (err) {
      console.error('Error in fetchIncidentDetails:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      severity: '1',
      type: '',
      location: '',
      longitude: '',
      latitude: '',
      capacity: '0',
      reporterId: null,
      reporterName: '',
      assignedVehicleCount: 0
    })
    setError(null)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (mode === 'new') {
        const payload = {
          type: formData.type.toLowerCase(),
          severity: parseInt(formData.severity) || 1,
          location: formData.location,
          latitude: parseFloat(formData.latitude) || 0,
          longitude: parseFloat(formData.longitude) || 0,
          capacity: parseInt(formData.capacity) || 0,
          reporterId: 4
        }
        console.log('📤 Sending payload:', JSON.stringify(payload, null, 2))
        
        const response = await fetch('http://localhost:8080/api/incidents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })

        const responseText = await response.text()
        console.log('📥 Response status:', response.status)
        console.log('📥 Response body:', responseText)

        if (!response.ok) {
          const errorMsg = responseText || `HTTP ${response.status}`
          throw new Error(`Backend error: ${errorMsg}`)
        }
        
        alert('Incident created successfully!')
        if (onSuccess) onSuccess()
        onClose()
      } else if (mode === 'view') {
        const payload = {
          severity: parseInt(formData.severity) || 1,
          type: formData.type.toLowerCase(),
          capacity: parseInt(formData.capacity) || 0
        }
        console.log('📤 Updating incident with payload:', JSON.stringify(payload, null, 2))
        
        const response = await fetch(`http://localhost:8080/api/incidents/${incidentData.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })

        if (!response.ok) {
          throw new Error(`Failed to update incident: ${response.status}`)
        }
        
        alert('Incident updated successfully!')
        if (onSuccess) onSuccess()
        onClose()
      }
    } catch (err) {
      console.error('❌ Error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-700">
        <div className="bg-gradient-to-r from-red-900 to-red-800 px-6 py-4 border-b border-red-700 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            {mode === 'new' ? (
              <>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Emergency Report
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Incident Details #{incidentData?.id}
              </>
            )}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-red-700 p-2 rounded-lg transition duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {loading && mode === 'view' ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-4">
                  <p className="font-semibold">Error:</p>
                  <p>{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Severity - EDITABLE */}
                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">
                    Severity Level * {mode === 'view' && <span className="text-yellow-400">(Editable)</span>}
                  </label>
                  <input
                    type="number"
                    name="severity"
                    min="1"
                    max="5"
                    value={formData.severity}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500"
                  />
                  <p className="text-gray-400 text-xs mt-1">Scale: 1 (Low) to 5 (Critical)</p>
                </div>

                {/* Type - EDITABLE */}
                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">
                    Incident Type * {mode === 'view' && <span className="text-yellow-400">(Editable)</span>}
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500"
                  >
                    <option value="">Select Type</option>
                    <option value="fire">🔥 Fire</option>
                    <option value="medical">🚑 Medical</option>
                    <option value="crime">👮 Crime</option>
                  </select>
                </div>

                {/* Capacity - EDITABLE */}
                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">
                    Required Capacity * {mode === 'view' && <span className="text-yellow-400">(Editable)</span>}
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    min="0"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500"
                  />
                </div>

                {/* Location - READ ONLY */}
                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">Location Name</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    disabled={mode === 'view'}
                    className={`w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500 ${
                      mode === 'view' ? 'opacity-60 cursor-not-allowed' : ''
                    }`}
                  />
                </div>

                {/* Latitude - READ ONLY */}
                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">Latitude *</label>
                  <input
                    type="number"
                    step="any"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    required
                    disabled={mode === 'view'}
                    className={`w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500 ${
                      mode === 'view' ? 'opacity-60 cursor-not-allowed' : ''
                    }`}
                  />
                </div>

                {/* Longitude - READ ONLY */}
                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">Longitude *</label>
                  <input
                    type="number"
                    step="any"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    required
                    disabled={mode === 'view'}
                    className={`w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500 ${
                      mode === 'view' ? 'opacity-60 cursor-not-allowed' : ''
                    }`}
                  />
                </div>
              </div>

              {mode === 'view' && (
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <h3 className="text-lg font-bold text-white mb-4">Additional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-300 text-sm font-semibold mb-2">Reporter</label>
                      <div className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-gray-300 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="font-medium">{formData.reporterName || 'Unknown Reporter'}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm font-semibold mb-2">Assigned Vehicles</label>
                      <div className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-gray-300 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                        </svg>
                        <span className="font-medium">
                          {formData.assignedVehicleCount || 0} Vehicle{formData.assignedVehicleCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4 mt-8 pt-6 border-t border-gray-700">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {mode === 'new' ? 'Create Incident' : 'Update Incident'}
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default IncidentForm