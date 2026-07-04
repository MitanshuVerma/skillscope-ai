import { Search } from "lucide-react";
import { AppShell, PageHero } from "../components/Layout";
import { jobs } from "../lib/mockData";

const categories = ["Engineering", "Data", "Design", "Marketing", "Sales", "Support", "HR", "Finance"];
const locations = ["Remote", "Bengaluru", "Hyderabad", "Delhi NCR", "Mumbai"];

function AvailableJobs() {
  return (
    <AppShell>
      <PageHero
        eyebrow="Live Listings"
        title="Available Jobs"
        subtitle="Aggregated openings from LinkedIn, Indeed, Wellfound, Naukri and partner sources."
      />

      <section className="page-container py-10">
        <div className="panel rounded-2xl p-2">
          <div className="grid gap-2 lg:grid-cols-[1.2fr_1fr_auto]">
            <div className="flex items-center gap-3 px-4">
              <Search className="h-5 w-5 text-slate-400" />
              <input className="input-dark border-0 bg-transparent" placeholder="Search job title, skill, or company" />
            </div>
            <input className="input-dark border-0 bg-transparent" placeholder="City, country, or remote" />
            <button className="btn-primary">Search</button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="panel h-fit rounded-2xl p-6">
            <h3 className="font-bold">Filters</h3>

            <div className="mt-7">
              <p className="section-label text-xs">Category</p>
              <div className="mt-4 space-y-3">
                {categories.map((cat) => (
                  <label key={cat} className="flex items-center gap-3 text-muted">
                    <input type="checkbox" />
                    {cat}
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <p className="section-label text-xs">Location</p>
              <div className="mt-4 space-y-3">
                {locations.map((loc) => (
                  <label key={loc} className="flex items-center gap-3 text-muted">
                    <input type="checkbox" />
                    {loc}
                  </label>
                ))}
              </div>
            </div>
          </aside>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-muted">24 jobs</p>
              <select className="input-dark max-w-[170px]">
                <option>Most recent</option>
                <option>Highest salary</option>
              </select>
            </div>

            <div className="panel overflow-hidden rounded-2xl">
              <table className="w-full border-collapse text-left">
                <thead className="bg-white/5 text-sm uppercase tracking-widest text-slate-400">
                  <tr>
                    <th className="px-5 py-4">Title</th>
                    <th className="px-5 py-4">Company</th>
                    <th className="px-5 py-4">Location</th>
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4">Salary</th>
                    <th className="px-5 py-4">Posted</th>
                    <th className="px-5 py-4">Source</th>
                    <th className="px-5 py-4">Apply</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id} className="border-t border-white/10">
                      <td className="px-5 py-5 font-bold">{job.title}</td>
                      <td className="px-5 py-5 text-muted">{job.company}</td>
                      <td className="px-5 py-5 text-muted">{job.location}</td>
                      <td className="px-5 py-5">
                        <span className="pill">{job.category}</span>
                      </td>
                      <td className="px-5 py-5 text-muted">{job.salary}</td>
                      <td className="px-5 py-5 text-muted">{job.posted}</td>
                      <td className="px-5 py-5 text-muted">{job.source}</td>
                      <td className="px-5 py-5">
                        <button className="font-semibold text-blue-400">Apply ↗</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}

export default AvailableJobs;