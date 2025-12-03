import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import UserService from '../services/UserService';

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const token = await UserService.login(email, password)
      if (token) navigate('/dashboard')
    } catch (err) {
      setError("Invalid email or password")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      
      {/* Emergency blinking background blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600 rounded-full filter blur-3xl opacity-50 animate-ping-slow"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600 rounded-full filter blur-3xl opacity-50 animate-ping-slow delay-500"></div>
      
      {/* Flashing diagonal stripes */}
      <div className="absolute inset-0 bg-gradient-to-tr from-red-600 via-transparent to-blue-600 opacity-20 animate-shimmer"></div>

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md p-10 bg-black/80 backdrop-blur-lg rounded-3xl border-2 border-red-500 shadow-2xl">
        
        {/* Alert Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-red-600 p-5 rounded-full shadow-xl animate-pulse">
            <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-red-500 tracking-wide mb-2 animate-pulse">EMERGENCY</h1>
          <p className="text-white font-semibold tracking-wide text-lg">DISPATCH CONTROL</p>
        </div>

        {/* Error */}
        {error && <p className="text-yellow-400 mb-4 text-center font-bold animate-shake">{error}</p>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white/80 mb-2 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@dispatch.com"
              required
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-red-500 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-white/80 mb-2 font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-red-500 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-red-600 to-blue-600 hover:from-blue-600 hover:to-red-600 shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 animate-pulse">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                ALERTING...
              </div>
            ) : (
              "ACCESS CONTROL"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-white/50 text-sm">
          &copy; {new Date().getFullYear()} Emergency Dispatch Control
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -100% 0; }
          100% { background-position: 100% 0; }
        }
        .animate-shimmer { 
          background-size: 200% 100%; 
          animation: shimmer 3s linear infinite; 
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-4px); }
          40%, 80% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.5s linear infinite; }
        .animate-ping-slow { animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite; }
      `}</style>

    </div>
  )
}

export default Login
