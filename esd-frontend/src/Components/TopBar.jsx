// src/components/TopBar.jsx
import { NavLink } from "react-router-dom";
import { TopBarPages as links } from "../routes.jsx";

function TopBar() {
  return (
    <header className="bg-black/90 backdrop-blur-md shadow-lg relative z-20 border-b-2 border-red-600">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo / Brand */}
          <div className="flex items-center space-x-2">
            <div className="bg-red-600 w-3 h-3 rounded-full animate-ping-slow"></div>
            <span className="font-bold text-2xl tracking-wide text-red-500 uppercase animate-pulse">
              EMERGENCY DISPATCH
            </span>
          </div>

          {/* Navigation links */}
          <nav className="flex space-x-4">
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg font-semibold transition-all duration-200
                  ${
                    isActive
                      ? "bg-red-500 text-white shadow-lg shadow-red-500/50"
                      : "text-red-300 hover:bg-red-700 hover:text-white hover:shadow-md hover:shadow-red-700/40"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Optional flashing top bar line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-red-800 to-red-500 animate-pulse-fast"></div>

      {/* Animations */}
      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
        .animate-ping-slow { animation: pulse-slow 2s infinite; }

        @keyframes pulse-fast {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .animate-pulse-fast { animation: pulse-fast 1s infinite; }
      `}</style>
    </header>
  );
}

export default TopBar;
