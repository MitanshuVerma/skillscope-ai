import { ArrowRight, Sparkles } from "lucide-react";

import { Logo } from "../components/Layout";

const API_URL = import.meta.env.PROD ? "" : "http://localhost:5000";

function LaunchPage() {
  return (
    <main className="launch-bg bg-grid min-h-screen overflow-hidden text-white">
      <div className="page-container flex h-24 items-center justify-between">
        <Logo />
      </div>

      <section className="flex min-h-[calc(100vh-96px)] items-center justify-center px-6 pb-24 text-center">
        <div className="max-w-5xl">
          <div className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-4 py-2 text-sm text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            AI Job Matching • Resume Analysis • Skill Trends • Market Insights
          </div>

          <h1 className="text-6xl font-black tracking-tight sm:text-7xl lg:text-8xl">
            Welcome to <span className="gradient-text">SkillScope AI</span>
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-xl text-white">
            Your smart AI-powered job discovery and career growth platform.
          </p>

          <p className="mx-auto mt-4 max-w-3xl text-lg text-muted">
            Find jobs, analyze your resume, track market trends, and discover the skills you need to grow.
          </p>

          <a
            href={`${API_URL}/api/auth/google`}
            className="mx-auto mt-12 inline-flex items-center gap-4 rounded-2xl bg-white px-8 py-4 text-lg font-bold text-black transition hover:scale-[1.02]"
          >
            <span className="text-xl">G</span>
            Continue with Google
            <ArrowRight className="h-5 w-5" />
          </a>

          <p className="mt-5 text-sm text-slate-400">
            By continuing you agree to our Terms and Privacy Policy
          </p>

          <div className="mx-auto mt-14 grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/5">
            <Sparkles className="h-6 w-6 text-purple-300" />
          </div>
        </div>
      </section>
    </main>
  );
}

export default LaunchPage;
