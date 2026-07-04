import { Briefcase, MapPin, Search } from "lucide-react";
import { AppShell, PageHero } from "../components/Layout";
import { jobs } from "../lib/mockData";

function FindJob() {
  return (
    <AppShell>
      <PageHero
        eyebrow="Personalized Matching"
        title="Find a Job"
        subtitle="AI ranks every opening against your profile, skills, and preferences."
      />

      <section className="page-container py-10">
        <div className="panel rounded-2xl p-2">
          <div className="grid gap-2 lg:grid-cols-[1.2fr_1fr_auto]">
            <div className="flex items-center gap-3 px-4">
              <Search className="h-5 w-5 text-slate-400" />
              <input className="input-dark border-0 bg-transparent" placeholder="Search job title, skill, or company" />
            </div>
            <div className="flex items-center gap-3 border-l border-white/10 px-4">
              <MapPin className="h-5 w-5 text-slate-400" />
              <input className="input-dark border-0 bg-transparent" placeholder="City, country, or remote" />
            </div>
            <button className="btn-primary">Search</button>
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr_auto]">
          <select className="input-dark">
            <option>All work types</option>
            <option>Remote</option>
            <option>Hybrid</option>
            <option>Onsite</option>
          </select>
          <select className="input-dark">
            <option>Any experience</option>
            <option>Entry</option>
            <option>Mid</option>
            <option>Senior</option>
          </select>
          <button className="btn-secondary">More filters</button>
        </div>

        <div className="mt-10 flex items-center justify-between">
          <p className="text-muted">24 matches sorted by relevance</p>
          <select className="input-dark max-w-[180px]">
            <option>Best match</option>
            <option>Most recent</option>
          </select>
        </div>

        <div className="panel mt-4 overflow-hidden rounded-2xl">
          {jobs.slice(0, 4).map((job) => (
            <div
              key={job.id}
              className="grid gap-5 border-b border-white/10 px-6 py-6 last:border-b-0 lg:grid-cols-[1fr_190px]"
            >
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl font-bold">{job.title}</h2>
                  <span className="pill">{job.type}</span>
                  <span className="pill">{job.level}</span>
                </div>

                <div className="mt-3 flex flex-wrap gap-4 text-muted">
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" /> {job.company}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" /> {job.location}
                  </span>
                  <span>{job.salary}</span>
                  <span>{job.posted}</span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span key={skill} className="pill">
                      {skill}
                    </span>
                  ))}
                </div>

                <p className="mt-3 text-sm text-slate-300">
                  Missing: <span className="text-yellow-400">{job.missing.join(", ")}</span>
                </p>
              </div>

              <div className="flex items-center gap-4 lg:justify-end">
                <div className="w-32">
                  <div className="flex justify-between text-sm">
                    <span>Match</span>
                    <span className="font-bold">{job.match}%</span>
                  </div>
                  <div className="progress-track mt-2">
                    <div className="progress-fill" style={{ width: `${job.match}%` }} />
                  </div>
                </div>
                <button className="btn-secondary">Analyze Gap</button>
                <button className="btn-primary">Apply</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}

export default FindJob;