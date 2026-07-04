import { AppShell, PageHero } from "../components/Layout";
import { hiringByCategory } from "../lib/mockData";

function MarketStatus() {
  return (
    <AppShell>
      <PageHero
        eyebrow="Job Market Intelligence"
        title="Market Status"
        subtitle="Live snapshot of hiring activity, salary benchmarks, and skill demand."
      />

      <section className="page-container py-10">
        <div className="panel grid overflow-hidden rounded-2xl md:grid-cols-4">
          {[
            ["Active Openings", "148,920", "+12.4% MoM"],
            ["New This Week", "22,310", "+4.1% WoW"],
            ["Avg. Time to Hire", "28 days", "−3 days"],
            ["Avg. Base Salary", "$94k", "+2.7% YoY"],
          ].map(([label, value, change]) => (
            <div key={label} className="border-b border-white/10 p-6 md:border-b-0 md:border-r last:border-r-0">
              <p className="section-label text-xs">{label}</p>
              <h2 className="mt-3 text-3xl font-bold">{value}</h2>
              <p className="mt-2 text-emerald-400">{change}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.9fr]">
          <div className="panel rounded-2xl p-8">
            <h2 className="text-2xl font-bold">Hiring by Category</h2>
            <div className="mt-8 space-y-5">
              {hiringByCategory.map((item) => (
                <div key={item.category} className="grid grid-cols-[150px_1fr_90px] items-center gap-5">
                  <span>{item.category}</span>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${item.percent}%` }} />
                  </div>
                  <span className="text-right text-muted">{item.count.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel rounded-2xl p-8">
            <h2 className="text-2xl font-bold">Remote vs Onsite</h2>
            <div className="mt-8 flex items-center justify-center gap-10">
              <div className="grid h-48 w-48 place-items-center rounded-full"
                style={{ background: "conic-gradient(#3b82f6 0 41%, #a855f7 41% 74%, #22c55e 74% 100%)" }}
              >
                <div className="grid h-32 w-32 place-items-center rounded-full bg-[#111827] text-center">
                  <div>
                    <p className="text-3xl font-bold">100%</p>
                    <p className="text-muted">Total</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p><span className="text-blue-400">●</span> Remote <b className="ml-4">41%</b></p>
                <p><span className="text-purple-400">●</span> Hybrid <b className="ml-4">33%</b></p>
                <p><span className="text-emerald-400">●</span> Onsite <b className="ml-4">26%</b></p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}

export default MarketStatus;