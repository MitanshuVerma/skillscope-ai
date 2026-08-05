import { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { AppShell, PageHero } from "../components/Layout";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.PROD ? "" : "http://localhost:5000";

const categories = ["Engineering", "Data", "Design", "Marketing", "Sales", "Support", "HR", "Finance"];

function AvailableJobs() {
  const { user, loading: authLoading } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [locationStr, setLocationStr] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          query: [query, ...selectedCategories].filter(Boolean).join(" "), 
          skills: user?.skills || [], 
          location: locationStr || 'us' 
        }),
      });
      const data = await res.json();
      if (data.jobs) {
        setJobs(data.jobs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchJobs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]); // Re-fetch when user loads so we get their skills

  return (
    <AppShell>
      <PageHero
        eyebrow="Live Listings"
        title="Available Jobs"
        subtitle="Aggregated openings matching your profile and search query."
      />

      <section className="page-container py-10">
        <div className="panel rounded-2xl p-2">
          <div className="grid gap-2 lg:grid-cols-[1.2fr_1fr_auto]">
            <div className="flex items-center gap-3 px-4">
              <Search className="h-5 w-5 text-slate-400" />
              <input 
                className="input-dark border-0 bg-transparent" 
                placeholder="Search job title or extra skills" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchJobs()}
              />
            </div>
            <input 
              className="input-dark border-0 bg-transparent" 
              placeholder="City, country, or remote" 
              value={locationStr}
              onChange={(e) => setLocationStr(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchJobs()}
            />
            <button onClick={fetchJobs} className="btn-primary flex items-center justify-center gap-2">
                {loading && <Loader2 className="h-4 w-4 animate-spin" />} Search
            </button>
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
                    <input 
                      type="checkbox" 
                      checked={selectedCategories.includes(cat)}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedCategories([...selectedCategories, cat]);
                        else setSelectedCategories(selectedCategories.filter(c => c !== cat));
                      }}
                    />
                    {cat}
                  </label>
                ))}
              </div>
            </div>
            
            <button onClick={fetchJobs} disabled={loading} className="btn-primary mt-8 w-full flex items-center justify-center gap-2">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Apply Filters'}
            </button>
          </aside>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-muted">{jobs.length} jobs found</p>
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
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="px-5 py-10 text-center text-muted">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                        Fetching jobs...
                      </td>
                    </tr>
                  ) : jobs.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-5 py-10 text-center text-muted">
                        No jobs found. Try adjusting your search query.
                      </td>
                    </tr>
                  ) : (
                    jobs.map((job, idx) => (
                      <tr key={idx} className="border-t border-white/10">
                        <td className="px-5 py-5 font-bold">{job.title}</td>
                        <td className="px-5 py-5 text-muted">{job.company_name || 'Company'}</td>
                        <td className="px-5 py-5 text-muted">{job.candidate_required_location || 'Remote'}</td>
                        <td className="px-5 py-5">
                          <span className="pill">{job.job_type || 'Full Time'}</span>
                        </td>
                        <td className="px-5 py-5 text-muted">{job.salary || 'Unspecified'}</td>
                        <td className="px-5 py-5 text-muted">Recent</td>
                        <td className="px-5 py-5 text-muted">JSearch</td>
                        <td className="px-5 py-5">
                          {job.url ? (
                            <a href={job.url} target="_blank" rel="noreferrer" className="font-semibold text-blue-400 hover:underline">Apply ↗</a>
                          ) : (
                            <span className="text-slate-500">N/A</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
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
