import { AppShell, PageHero } from "../components/Layout";
import { trendingRoles } from "../lib/mockData";

function TrendingJobs() {
  return (
    <AppShell>
      <PageHero
        eyebrow="Q1 2026 Report"
        title="Trending Jobs"
        subtitle="Roles and skills with the strongest hiring momentum across the last 90 days."
      />

      <section className="page-container py-12">
        <h2 className="mb-6 text-2xl font-bold">Top Trending Job Roles</h2>

        <div className="panel overflow-hidden rounded-2xl">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-sm uppercase tracking-widest text-slate-400">
              <tr>
                <th className="px-6 py-4">Rank</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Openings</th>
                <th className="px-6 py-4">Growth (90d)</th>
                <th className="px-6 py-4">Momentum</th>
              </tr>
            </thead>
            <tbody>
              {trendingRoles.map((role) => (
                <tr key={role.rank} className="border-t border-white/10">
                  <td className="px-6 py-5 text-muted">#{role.rank}</td>
                  <td className="px-6 py-5 font-bold">{role.role}</td>
                  <td className="px-6 py-5">{role.openings}</td>
                  <td className="px-6 py-5 text-emerald-400">↗ {role.growth}</td>
                  <td className="px-6 py-5">
                    <div className="progress-track w-52">
                      <div className="progress-fill" style={{ width: `${role.momentum}%` }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}

export default TrendingJobs;