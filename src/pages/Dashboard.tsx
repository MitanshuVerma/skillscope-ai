import { ArrowRight, BarChart3, FileText, Search, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { AppShell, PageHero } from "../components/Layout";

const actions = [
  {
    to: "/find-job",
    icon: Search,
    title: "Find jobs matching my profile",
    desc: "AI-ranked openings tailored to your skills, role, and location.",
  },
  {
    to: "/resume-ai",
    icon: FileText,
    title: "Analyze my resume",
    desc: "Upload or enter your resume — get gap analysis and improvement tips.",
  },
  {
    to: "/trending-jobs",
    icon: TrendingUp,
    title: "View trending jobs",
    desc: "Roles and skills with the strongest hiring momentum right now.",
  },
  {
    to: "/market-status",
    icon: BarChart3,
    title: "Check current market status",
    desc: "Hiring breakdown by category, city, salary, and skill demand.",
  },
];

function Dashboard() {
  return (
    <AppShell>
      <PageHero
        eyebrow="Dashboard"
        title="Welcome back"
        subtitle="What would you like to do today?"
      />

      <section className="page-container py-12">
        <div className="panel overflow-hidden rounded-2xl">
          {actions.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="group grid grid-cols-[56px_1fr_28px] items-center gap-5 border-b border-white/10 px-7 py-7 transition last:border-b-0 hover:bg-white/[0.035]"
            >
              <div className="brand-gradient grid h-12 w-12 place-items-center rounded-xl">
                <action.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{action.title}</h2>
                <p className="mt-1 text-muted">{action.desc}</p>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-400 transition group-hover:translate-x-1 group-hover:text-white" />
            </Link>
          ))}
        </div>
      </section>
    </AppShell>
  );
}

export default Dashboard;