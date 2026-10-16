import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import {
  AlertTriangle,
  Box,
  Cpu,
  Mail,
  User,
  KeyRound,
  Terminal,
  Loader2,
  ArrowRight,
} from "lucide-react";

const Logo: React.FC = () => (
  <div className="flex items-center gap-3 select-none">
    <span className="grid size-9 place-items-center border-2 border-edge bg-plasma shadow-glow">
      <Box className="size-5 text-ghost" strokeWidth={2} aria-hidden />
    </span>
    <span className="text-lg font-black tracking-[0.2em] text-ghost">
      AZZETS
    </span>
  </div>
);

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { registerMutation } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    registerMutation.mutate(
      { username, email, password, bio: bio || undefined },
      {
        onSuccess: () => {
          // 🚀 ROUTING PIPELINE: Successfully navigate to the home grid view
          navigate("/");
        },
        onError: (err: any) => {
          setErrorMsg(err.message || "Registration validation error occurred.");
        },
      },
    );
  };

  return (
    <div className="grid min-h-dvh bg-void text-ghost lg:grid-cols-[1.15fr_1fr]">
      {/* ============ Static Showcase Panel (Performance-first design) ============ */}
      <aside className="relative isolate hidden flex-col justify-between overflow-hidden border-r-2 border-edge p-12 lg:flex bg-surface">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-hero-glow opacity-60"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-wireframe opacity-40"
        />

        <Logo />

        {/* Static, high-impact abstract typography layout */}
        <div className="relative flex-1 flex flex-col justify-center items-start space-y-6 max-w-xl pr-6">
          <div className="inline-flex p-3 rounded-xl bg-raised border-2 border-edge text-ion shadow-glow select-none">
            <Cpu className="w-8 h-8" strokeWidth={2} />
          </div>
          <h2 className="text-5xl font-black leading-[1.05] tracking-tight text-ghost">
            Deploy your 3D engineering portfolio node.
          </h2>
          <p className="text-lg text-mist font-medium leading-relaxed max-w-md">
            Join a distributed ecosystem built for high-performance assets,
            shaders, and complex environmental models.
          </p>

          {/* Visual abstract graphic element */}
          <div className="w-full h-px bg-edge my-4 relative">
            <div className="absolute right-0 -top-2 px-3 py-0.5 border-2 border-edge bg-plasma text-ghost font-black text-xs uppercase tracking-widest shadow-[2px_2px_0px_0px_#000000]">
              Status: Ready
            </div>
          </div>
        </div>

        <div className="text-xs font-bold tracking-wider text-mist select-none">
          AZZETS DISTRIBUTED NETWORK RUNTIME v1.0.0
        </div>
      </aside>

      {/* ============ Form Panel ============ */}
      <main className="relative isolate flex items-center justify-center px-6 py-12 sm:px-10">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-hero-glow opacity-40"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-wireframe opacity-30"
        />

        <div className="w-full max-w-md animate-rise bg-raised border-2 border-edge p-8 shadow-glow">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>

          <h1 className="text-4xl font-black tracking-tight text-ghost">
            Create account
          </h1>
          <p className="mt-2 text-sm font-medium text-mist">
            Initialize your full-stack creator workspace portal
          </p>

          {/* High Contrast Error Banner */}
          {errorMsg && (
            <div
              role="alert"
              className="mt-6 flex items-start gap-3 rounded-md border-2 border-edge bg-flare/10 p-4 text-sm font-bold text-edge"
            >
              <AlertTriangle
                className="mt-0.5 size-4 shrink-0 text-flare"
                strokeWidth={2.5}
                aria-hidden
              />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="reg-username"
                  className="mb-2 block text-sm font-bold text-ghost"
                >
                  Node Username
                </label>
                <div className="group relative">
                  <User
                    className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-mist transition-colors group-focus-within:text-ion"
                    strokeWidth={2}
                    aria-hidden
                  />
                  <input
                    id="reg-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="obsidian-input w-full rounded-xl py-3 pl-11 pr-4 text-sm font-medium"
                    placeholder="ansh_bravo"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="reg-email"
                  className="mb-2 block text-sm font-bold text-ghost"
                >
                  Email Endpoint
                </label>
                <div className="group relative">
                  <Mail
                    className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-mist transition-colors group-focus-within:text-ion"
                    strokeWidth={2}
                    aria-hidden
                  />
                  <input
                    id="reg-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="obsidian-input w-full rounded-xl py-3 pl-11 pr-4 text-sm font-medium"
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="reg-password"
                className="mb-2 block text-sm font-bold text-ghost"
              >
                Cryptographic Password
              </label>
              <div className="group relative">
                <KeyRound
                  className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-mist transition-colors group-focus-within:text-ion"
                  strokeWidth={2}
                  aria-hidden
                />
                <input
                  id="reg-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="obsidian-input w-full rounded-xl py-3.5 pl-11 pr-4 text-sm font-medium"
                  placeholder="Minimum 8 complex vectors"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="reg-bio"
                className="mb-2 block text-sm font-bold text-ghost"
              >
                Creator Profile Bio{" "}
                <span className="text-mist/60 font-normal">(Optional)</span>
              </label>
              <div className="group relative">
                <Terminal
                  className="pointer-events-none absolute left-4 top-3.5 size-4 text-mist transition-colors group-focus-within:text-ion"
                  strokeWidth={2}
                  aria-hidden
                />
                <textarea
                  id="reg-bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="obsidian-input w-full rounded-xl pl-11 pr-4 py-3 text-sm font-medium min-h-[85px] resize-none"
                  placeholder="Initialize modeling domains (e.g., hard-surface environments)..."
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full py-3.5 rounded-xl font-black text-sm transition-all duration-150 border-2 border-edge bg-plasma text-ghost hover:bg-plasma-light active:translate-x-0.5 active:translate-y-0.5 active:shadow-none shadow-glow cursor-pointer flex justify-center items-center gap-2 select-none disabled:opacity-50 disabled:pointer-events-none"
            >
              {registerMutation.isPending ? (
                <>
                  <Loader2
                    className="w-4 h-4 animate-spin text-ghost"
                    strokeWidth={2.5}
                  />
                  <span>Deploying Identity Stack...</span>
                </>
              ) : (
                <>
                  <span>Deploy Node Stack</span>
                  <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-6 text-xs font-bold text-mist">
            Node verified already?{" "}
            <Link
              to="/login"
              className="text-ion hover:underline transition-all"
            >
              Console Authentication
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};
