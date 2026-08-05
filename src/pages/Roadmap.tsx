import { useState, useEffect } from "react";
import { AppShell, PageHero } from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { Loader2, AlertCircle } from "lucide-react";

const API_URL = import.meta.env.PROD ? "" : "http://localhost:5000";

function Roadmap() {
  const { user } = useAuth();
  const [targetRole, setTargetRole] = useState("Data Analyst");
  const [currentSkills, setCurrentSkills] = useState("");
  const [timeline, setTimeline] = useState("3 months");
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.skills && user.skills.length > 0) {
      setCurrentSkills(user.skills.join(", "));
    }
  }, [user]);

  const generateRoadmap = async () => {
    if (!targetRole || !currentSkills || !timeline) {
      setError("Please fill in all fields.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const headers: any = { "Content-Type": "application/json" };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/api/roadmap`, {
        method: "POST",
        headers,
        body: JSON.stringify({ targetRole, currentSkills, timeline })
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate roadmap.");
      }
      
      setRoadmap(data.roadmap || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate roadmap.");
    } finally {
      setLoading(false);
    }
  };

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
              <input 
                className="input-dark mt-2" 
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
              />
            </label>

            <label>
              <span className="text-sm text-muted">Current skills</span>
              <input 
                className="input-dark mt-2" 
                value={currentSkills}
                onChange={(e) => setCurrentSkills(e.target.value)}
              />
            </label>

            <label>
              <span className="text-sm text-muted">Timeline</span>
              <input 
                className="input-dark mt-2" 
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
              />
            </label>
          </div>

          <button 
            onClick={generateRoadmap} 
            disabled={loading}
            className="btn-primary mt-5 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />} Generate roadmap
          </button>

          {error && (
            <div className="mt-6 flex items-center gap-3 rounded-lg bg-red-500/20 p-4 text-red-200 border border-red-500/30">
                <AlertCircle className="h-5 w-5" />
                <p>{error}</p>
            </div>
          )}

          {roadmap.length === 0 && !loading && !error ? (
            <div className="panel-soft mt-9 rounded-2xl border-dashed p-12 text-center text-muted">
              Your personalized timeline will appear here.
            </div>
          ) : roadmap.length > 0 ? (
            <div className="panel mt-9 rounded-2xl p-8">
              {roadmap.map((item, index) => (
                <div key={index} className="border-l border-purple-400/40 pb-8 pl-6 last:pb-0">
                  <h3 className="text-xl font-bold">{item.month || `Month ${index + 1}`}</h3>
                  <p className="mt-2 text-muted">{item.text || item.description}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </AppShell>
  );
}

export default Roadmap;
