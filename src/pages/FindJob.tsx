import { useState, useEffect } from "react";
import { Briefcase, MapPin, Search, Loader2 } from "lucide-react";
import { AppShell, PageHero } from "../components/Layout";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.PROD ? "" : "http://localhost:5000";
function FindJob() {
  const { user, loading: authLoading } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [locationStr, setLocationStr] = useState("");

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers: any = { "Content-Type": "application/json" };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/api/jobs`, {
        method: "POST",
        headers,
        body: JSON.stringify({ 
          query: query || undefined, 
          skills: user?.skills || [], 
          location: locationStr || 'us' 
        }),
      });
      const data = await res.json();
      
      if (data.jobs) {
        // Calculate a pseudo-match percentage for UI purposes
        const enrichedJobs = data.jobs.map((job: any) => {
          const jobText = (job.description || "").toLowerCase() + (job.tags || []).join(" ").toLowerCase();
          const userSkills = user?.skills || [];
          
          let matchCount = 0;
          const missing: string[] = [];
          
          userSkills.forEach(skill => {
            if (jobText.includes(skill.toLowerCase())) {
              matchCount++;
            } else {
              missing.push(skill);
            }
          });
          
          const match = userSkills.length > 0 ? Math.round((matchCount / userSkills.length) * 100) : 0;
          
          return {
            ...job,
            match,
            missing,
            jobSkills: job.tags || []
          };
        }).sort((a: any, b: any) => b.match - a.match);

        setJobs(enrichedJobs);
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
  }, [user, authLoading]);

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
              <input 
                className="input-dark border-0 bg-transparent" 
                placeholder="Search job title, skill, or company"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchJobs()}
              />
            </div>
            <div className="flex items-center gap-3 border-l border-white/10 px-4">
              <MapPin className="h-5 w-5 text-slate-400" />
              <input 
                className="input-dark border-0 bg-transparent" 
                placeholder="City, country, or remote" 
                value={locationStr}
                onChange={(e) => setLocationStr(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchJobs()}
              />
            </div>
            <button onClick={fetchJobs} className="btn-primary flex items-center justify-center gap-2">
               {loading && <Loader2 className="h-4 w-4 animate-spin" />} Search
            </button>
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
          <p className="text-muted">{jobs.length} matches sorted by relevance</p>
          <select className="input-dark max-w-[180px]">
            <option>Best match</option>
            <option>Most recent</option>
          </select>
        </div>

        <div className="panel mt-4 overflow-hidden rounded-2xl">
          {loading ? (
             <div className="p-10 text-center text-muted">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                Fetching and matching jobs...
             </div>
          ) : jobs.length === 0 ? (
             <div className="p-10 text-center text-muted">
                No jobs found.
             </div>
          ) : (
            jobs.map((job) => (
              <div
                key={job.id}
                className="grid gap-5 border-b border-white/10 px-6 py-6 last:border-b-0 lg:grid-cols-[1fr_190px]"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-bold">{job.title}</h2>
                    <span className="pill">{job.job_type || 'Full Time'}</span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-4 text-muted">
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" /> {job.company_name || 'Company'}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" /> {job.candidate_required_location || 'Remote'}
                    </span>
                    <span>{job.salary ? job.salary : 'Salary Unspecified'}</span>
                    <span>Recent</span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {job.jobSkills.slice(0, 5).map((skill: string) => (
                      <span key={skill} className="pill">
                        {skill}
                      </span>
                    ))}
                  </div>

                  {job.missing && job.missing.length > 0 && (
                    <p className="mt-3 text-sm text-slate-300">
                      Missing from your profile: <span className="text-yellow-400">{job.missing.join(", ")}</span>
                    </p>
                  )}
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
                  <a href={job.url} target="_blank" rel="noreferrer" className="btn-primary">Apply</a>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </AppShell>
  );
}

export default FindJob;
