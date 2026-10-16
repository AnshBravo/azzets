import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar.js";

export const RootLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-void text-ghost relative">
      {/* Structural theme atmospheric layer */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-hero-glow opacity-30 pointer-events-none z-0"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-wireframe opacity-20 pointer-events-none z-0"
      />

      {/* Main Persistent Header */}
      <Navbar />

      {/* Dynamic Sub-Page Routing Engine Render Mount */}
      <main className="flex-1 flex flex-col relative z-10 w-full max-w-full max-w-7xl mx-auto p-6 md:p-8 animate-rise">
        <Outlet />
      </main>

      {/* High Contrast Flat Footer */}
      <footer className="w-full bg-surface border-t-2 border-edge relative z-10 select-none py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-mist">
          <div>
            &copy; {new Date().getFullYear()} AZZETS Inc. All cryptographic
            rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="px-2 py-0.5 border border-edge bg-white text-ghost rounded shadow-[1px_1px_0px_0px_#000]">
              Network: Online
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
