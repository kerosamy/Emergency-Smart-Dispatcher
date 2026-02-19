// src/pages/AddUser.jsx
import { useState } from "react";
import UserService from "../services/UserService";

export default function AddUser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("DISPATCHER");
  const [message, setMessage] = useState("");

 const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await UserService.addUser(name, email, password, role);
      setMessage("User added successfully!");
      setName("");
      setEmail("");
      setPassword("");
      setRole("DISPATCHER");
    } catch (err) {
      setMessage("Error adding user");
    }
  };

  return (
    <div className="w-full h-screen relative bg-black overflow-hidden flex justify-center items-center">
      {/* Full-page background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-black to-blue-900"></div>

      {/* Animated blobs */}
      <div className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] bg-red-700 rounded-full filter blur-[200px] opacity-50 animate-ping-slow"></div>
      <div className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-blue-700 rounded-full filter blur-[200px] opacity-50 animate-ping-slow delay-500"></div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-lg p-10 bg-black/80 backdrop-blur-lg rounded-3xl border-2 border-red-600 shadow-2xl">
        <h1 className="text-3xl font-extrabold text-red-500 mb-6 text-center animate-pulse">
          Add User
        </h1>

        {message && (
          <p
            className={`mb-4 text-center font-bold ${
              message.includes("success") ? "text-green-400" : "text-yellow-400 animate-shake"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleAddUser} className="space-y-4">
          <input
            className="w-full p-3 rounded-xl bg-black/50 border border-red-500 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            className="w-full p-3 rounded-xl bg-black/50 border border-red-500 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="w-full p-3 rounded-xl bg-black/50 border border-red-500 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <select
            className="w-full p-3 rounded-xl bg-black/50 border border-red-500 text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="DISPATCHER">DISPATCHER</option>
            <option value="REPORTER">REPORTER</option>
            <option value="RESPONDER">RESPONDER</option>
          </select>

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-red-600 to-blue-600 hover:from-blue-600 hover:to-red-600 shadow-lg transition-all transform hover:scale-105"
          >
            Add User
          </button>
        </form>

        <div className="mt-6 text-center text-white/50 text-sm">
          &copy; {new Date().getFullYear()} Emergency Dispatch Control
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
        .animate-ping-slow { animation: pulse-slow 2s infinite; }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-4px); }
          40%, 80% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.5s linear infinite; }
      `}</style>
    </div>
  );
}
