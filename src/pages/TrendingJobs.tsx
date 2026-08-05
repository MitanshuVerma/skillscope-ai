import { useState, useEffect } from "react";
import { AppShell, PageHero } from "../components/Layout";
import { Loader2, AlertCircle } from "lucide-react";

function TrendingJobs() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/trending-jobs");
        if (!res.ok) throw new Error("Failed to fetch trending jobs");
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  return (
    <AppShell>
      <PageHero
        eyebrow="AI Market Insights"
        title="Trending Jobs"
        subtitle="Roles and skills with the strongest hiring momentum across the last 90 days."
      />

      <section className="page-container py-12">
        <h2 className="mb-6 text-2xl font-bold">Top Trending Job Roles</h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted">
            <Loader2 className="h-8 w-8 animate-spin mb-4 text-purple-400" />
            <p>Analyzing global market data...</p>
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 rounded-lg bg-red-500/20 p-4 text-red-200 border border-red-500/30">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        ) : data && data.trendingJobs && (
          <div className="panel overflow-hidden rounded-2xl">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-sm uppercase tracking-widest text-slate-400">
                <tr>
                  <th className="px-6 py-4">Rank</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Demand</th>
                  <th className="px-6 py-4">Avg. Salary</th>
                  <th className="px-6 py-4">Key Skills</th>
                </tr>
              </thead>
              <tbody>
                {data.trendingJobs.map((role: any, index: number) => (
                  <tr key={index} className="border-t border-white/10">
                    <td className="px-6 py-5 text-muted">#{index + 1}</td>
                    <td className="px-6 py-5 font-bold">{role.title}</td>
                    <td className="px-6 py-5 text-emerald-400">{role.demand}</td>
                    <td className="px-6 py-5 text-purple-400">{role.salary}</td>
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-2">
                        {(role.skills || []).map((skill: string) => (
                          <span key={skill} className="rounded-md bg-white/10 px-2 py-1 text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AppShell>
  );
}

export default TrendingJobs;