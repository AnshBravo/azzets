import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { Box, LogOut, PlusCircle, User, Menu, X, Layers } from "lucide-react";

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [dropdownOpen, setDropDownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setDropDownOpen(false);
    navigate("/login");
  };

  return (
    <nav className="w-full bg-void border-b-2 border-edge sticky top-0 x-50 select-none">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Branding Logo Anchor */}
        <Link
          to="/"
          className="flex items-center gap-3 active:scale-98 transition-transform"
        >
          <span className="grid size-9 place-items-center border-2 border-edge bg-plasma shadow-[2px_2px_0px_0px_#000000]">
            <Box className="size-5 text-ghost" strokeWidth={2} />
          </span>
          <span className="text-lg font-black tracking-[0.2em] text-ghost">
            AZZETS
          </span>
        </Link>

        {/* Global Structural Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="text-sm font-bold text-ghost hover:text-ion transition-colors"
          >
            MarketPlace
          </Link>

          {!isAuthenticated && (
            <Link
              to="/upload"
              className="w-full py-1.5 px-2 rounded-xl font-black text-sm transition-all duration-150 border-2 border-edge bg-plasma text-ghost hover:bg-plasma-light active:translate-x-0.5 active:translate-y-0.5 active:shadow-none shadow-glow cursor-pointer flex justify-center items-center gap-2 select-none disabled:opacity-50 disabled:pointer-events-none"
            >
              <PlusCircle className="w-4 h-4" strokeWidth={2.5} />
              <span>List Model</span>
            </Link>
          )}
        </div>

        {/* Dynamic Authentication State Context Menu */}
        <div className="flex items-center gap-4 relative">
          {isAuthenticated ? (
            <div>
              <button
                onClick={() => setDropDownOpen((prev) => !prev)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 border-edge bg-surface font-bold text-sm text-ghost hover:shadow-[2px_2px_0px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
              >
                <div className="size-5 rounded-md bg-ion flex items-center justify-center text-ghost text-xs font-black uppercase border border-edge">
                  {user?.username?.substring(0, 2)}
                </div>
                <span className="max-w-[100px] truncate">{user?.username}</span>
              </button>
              {/* High Contrast Dropdown Action Deck */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-raised border-2 border-edge p-2 shadow-glow animate-rise rounded-xl">
                  <div className="px-3 py-2 border-b border-edge mb-1">
                    <p className="text-xs font-bold text-mist truncate">
                      Logged in as
                    </p>
                    <p className="text-sm font-black text-ghost truncate">
                      {user?.email}
                    </p>
                  </div>
                  <Link
                    to="/vault"
                    onClick={() => setDropDownOpen(false)}
                    className="flex items-center gap-2 w-full px-2 py-2 text-sm font-bold text-ghost hover:bg-surface rounded-lg transition-colors"
                  >
                    <Layers className="w-4 h-4" strokeWidth={2} />
                    <span>My Vault</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm font-bold text-flare hover:bg-flare/10 rounded-lg text-left transition-colors cursor-pointer mt-1"
                  >
                    <LogOut className="w-4 h-4" strokeWidth={2} />
                    <span>Disconnect</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-bold text-ghost hover:text-ion transition-colors px-3 py-2"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 border-2 border-edge bg-plasma text-ghost font-black text-sm shadow-[2px_2px_0px_0px_#000000] hover:bg-plasma-light active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all rounded-xl"
              >
                Register Node
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
