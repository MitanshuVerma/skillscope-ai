import { useState } from "react";
import { AppShell, PageHero } from "../components/Layout";

function Roadmap() {
  const [generated, setGenerated] = useState(false);

  return (
    <AppShell>
      <PageHero
        eyebrow="Learning Plan"
        title="Skill Roadmap"
        subtitle="AI-generated, month-by-month plan to reach your target role."
      />

      <section className="page-container py-12">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-4 md:grid-cols-3">
            <label>
              <span className="text-sm text-muted">Target role</span>
              <input className="input-dark mt-2" defaultValue="Data Analyst" />
            </label>

            <label>
              <span className="text-sm text-muted">Current skills</span>
              <input className="input-dark mt-2" defaultValue="Python, Excel" />
            </label>

            <label>
              <span className="text-sm text-muted">Timeline</span>
              <input className="input-dark mt-2" defaultValue="3 months" />
            </label>
          </div>

          <button onClick={() => setGenerated(true)} className="btn-primary mt-5">
            Generate roadmap
          </button>

          {!generated ? (
            <div className="panel-soft mt-9 rounded-2xl border-dashed p-12 text-center text-muted">
              Your personalized timeline will appear here.
            </div>
          ) : (
            <div className="panel mt-9 rounded-2xl p-8">
              {[
                ["Month 1", "Learn SQL basics, Excel dashboarding, and data cleaning."],
                ["Month 2", "Build Power BI dashboards and learn statistics for analytics."],
                ["Month 3", "Create a portfolio project, optimize resume, and start applying."],
              ].map(([month, text]) => (
                <div key={month} className="border-l border-purple-400/40 pb-8 pl-6 last:pb-0">
                  <h3 className="text-xl font-bold">{month}</h3>
                  <p className="mt-2 text-muted">{text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </AppShell>
  );
}

export default Roadmap;