import type { ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import { Sparkles, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Find a Job", to: "/find-job" },
  { label: "Available Jobs", to: "/available-jobs" },
  { label: "Trending Jobs", to: "/trending-jobs" },
  { label: "Market Status", to: "/market-status" },
  { label: "Resume AI", to: "/resume-ai" },
  { label: "Roadmap", to: "/roadmap" },
];

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-3">
      <div className="brand-gradient grid h-10 w-10 place-items-center rounded-xl shadow-lg shadow-purple-500/25">
        <Sparkles className="h-5 w-5 text-white" />
      </div>
      <div className="text-lg font-bold">
        SkillScope <span className="text-purple-400">AI</span>
      </div>
    </Link>
  );
}

export function Navbar() {
  const { user, loading } = useAuth();

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <header className="glass-nav sticky top-0 z-50">
      <div className="page-container flex h-[74px] items-center justify-between">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  "rounded-xl px-4 py-2 text-sm transition",
                  isActive
                    ? "bg-white/8 text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-white",
                ].join(" ")
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {loading ? (
            <div className="h-10 w-24 animate-pulse rounded-xl bg-white/5" />
          ) : user ? (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1.5 pl-1.5 pr-4 transition hover:bg-white/10"
              >
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="h-8 w-8 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="brand-gradient grid h-8 w-8 place-items-center rounded-full text-sm font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-sm font-medium">{user.name}</span>
              </Link>
              <a
                href="http://localhost:5000/api/auth/logout"
                className="text-sm font-medium text-slate-400 transition hover:text-white"
              >
                Logout
              </a>
            </>
          ) : (
            <button
              onClick={handleGoogleLogin}
              className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold transition hover:bg-white/20"
            >
              <LogIn className="h-4 w-4" />
              Login with Google
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-bg page-shell">
      <Navbar />
      {children}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <section className="border-b border-white/10">
      <div className="page-container py-16">
        <p className="section-label">{eyebrow}</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-muted">{subtitle}</p>
      </div>
    </section>
  );
}