import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    badgeNumber: '',
    department: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!')
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      console.log('Signup:', formData)
      setIsLoading(false)
      navigate('/login')
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-40 right-40 w-80 h-80 bg-orange-500 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 left-40 w-96 h-96 bg-red-500 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Signup Card */}
      <div className="bg-gray-900 bg-opacity-90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-md border border-orange-700 relative z-10">
        {/* Emergency Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-br from-orange-600 to-red-800 p-4 rounded-full shadow-lg animate-pulse">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
            REGISTER
          </h1>
          <div className="flex items-center justify-center gap-2 text-orange-400">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-ping"></div>
            <p className="text-sm font-semibold tracking-wider">NEW OPERATOR</p>
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-ping"></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
              placeholder="John Doe"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
              placeholder="operator@emergency.com"
              required
            />
          </div>

          {/* Badge Number */}
          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">Badge Number</label>
            <input
              type="text"
              name="badgeNumber"
              value={formData.badgeNumber}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
              placeholder="EMS-12345"
              required
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
              required
            >
              <option value="">Select Department</option>
              <option value="fire">🚒 Fire Department</option>
              <option value="police">🚔 Police Department</option>
              <option value="ems">🚑 EMS</option>
              <option value="dispatch">📞 Dispatch Center</option>
            </select>
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
              placeholder="••••••••"
              required
              minLength="6"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
              placeholder="••••••••"
              required
              minLength="6"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-orange-600 to-red-700 text-white py-3 rounded-lg hover:from-orange-700 hover:to-red-800 transition duration-200 font-bold text-lg shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-6"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating Account...
              </div>
            ) : (
              'CREATE ACCOUNT'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-900 text-gray-400">Already registered?</span>
          </div>
        </div>

        {/* Login Link */}
        <Link 
          to="/login"
          className="block w-full text-center border-2 border-orange-600 text-orange-400 py-3 rounded-lg hover:bg-orange-600 hover:text-white transition duration-200 font-semibold"
        >
          Back to Login
        </Link>

        {/* Footer */}
        <p className="text-center text-gray-500 text-xs mt-6">
          🚨 Secure registration process
        </p>
      </div>

      {/* Emergency stripe */}
      <div className="fixed bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-600 via-yellow-500 to-orange-600 animate-pulse"></div>
    </div>
  )
}

export default Signup