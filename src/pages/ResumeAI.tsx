import { useState, useEffect } from "react";
import { FileText, Upload, Loader2, CheckCircle, ChevronRight, Briefcase, TrendingUp, Compass, AlertCircle } from "lucide-react";
import { AppShell, PageHero } from "../components/Layout";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.PROD ? "" : "http://localhost:5000";

function ResumeAI() {
  const { user, setUser } = useAuth();
  
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState<string[]>(user?.skills || []);
  const [manualSkills, setManualSkills] = useState(user?.skills?.join(", ") || "");
  const [jobs, setJobs] = useState<any[]>([]);
  const [insights, setInsights] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (user?.skills && user.skills.length > 0) {
      setSkills(user.skills);
      setManualSkills(user.skills.join(", "));
      if (initialLoad) {
          setStep(2);
          setInitialLoad(false);
      }
    } else if (user && initialLoad) {
        setInitialLoad(false);
    }
  }, [user, initialLoad]);

  const handleClearData = async () => {
      try {
          if (user) {
              const res = await fetch(`${API_URL}/api/auth/clear-skills`, {
                  method: 'POST',
                  credentials: 'include'
              });
              if (!res.ok) {
                  const errText = await res.text();
                  console.error("Clear data failed on backend", res.status, errText);
                  // We still want to clear local state if the session is just expired
              }
              setUser({ ...user, skills: [] });
          }
          
          setSkills([]);
          setManualSkills("");
          setFile(null);
          setStep(1);
          setError(null);
      } catch (err: any) {
          console.error(err);
          setError(err.message || "Network error while clearing data.");
      }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const processResume = async () => {
    if (!file && !manualSkills) {
        setError("Please upload a resume or enter skills manually.");
        return;
    }
    setError(null);
    setLoading(true);

    try {
        let extractedSkills = [];
        if (file) {
            const formData = new FormData();
            formData.append('resume', file);
            
            const res = await fetch(`${API_URL}/api/upload-resume`, {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || 'Failed to process resume.');
            }
            extractedSkills = data.skills || [];
        } else {
            extractedSkills = manualSkills.split(',').map(s => s.trim()).filter(Boolean);
        }
        
        if (user) {
            setUser({ ...user, skills: extractedSkills });
        }
        setSkills(extractedSkills);
        setStep(2);
    } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to process resume or skills.");
    } finally {
        setLoading(false);
    }
  };

  const analyzeFit = async () => {
    setLoading(true);
    setError(null);
    try {
        // Fetch Jobs
        const jobsRes = await fetch(`${API_URL}/api/jobs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ skills, location: 'us' })
        });
        const jobsData = await jobsRes.json();
        setJobs(jobsData.jobs || []);

        // Fetch Insights
        const insightsRes = await fetch(`${API_URL}/api/insights`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userSkills: skills, jobs: jobsData.jobs || [] })
        });
        const insightsData = await insightsRes.json();
        setInsights(insightsData);
        
        setStep(3);
    } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to analyze career fit.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <AppShell>
      <PageHero
        eyebrow="AI Resume Intelligence"
        title="Resume AI"
        subtitle="Upload or enter your details. Get gap analysis, role matches, and actionable improvements."
      />

      <section className="page-container py-12">
        <div className="panel mx-auto max-w-5xl rounded-2xl p-5">
          <div className="grid items-center gap-4 md:grid-cols-[1fr_1fr_1fr]">
            {["Choose input", "Review profile", "Analyze career fit"].map((stepText, index) => (
              <div key={stepText} className="flex items-center gap-4">
                <div className={`grid h-10 w-10 place-items-center rounded-full ${step > index ? "brand-gradient" : "bg-white/10"}`}>
                  {step > index + 1 ? <CheckCircle className="h-5 w-5" /> : index + 1}
                </div>
                <span className={step >= index + 1 ? "font-bold text-white" : "text-muted"}>{stepText}</span>
                {index < 2 && <div className={`hidden h-px flex-1 md:block ${step > index + 1 ? "bg-purple-500" : "bg-white/10"}`} />}
              </div>
            ))}
          </div>
        </div>

        {error && (
            <div className="mx-auto mt-6 max-w-5xl flex items-center gap-3 rounded-lg bg-red-500/20 p-4 text-red-200 border border-red-500/30">
                <AlertCircle className="h-5 w-5" />
                <p>{error}</p>
            </div>
        )}

        <div className="mx-auto mt-10 max-w-5xl">
          {step === 1 && (
              <div>
                  <h2 className="text-2xl font-bold">Step 1 — Choose input method</h2>

                  <div className="mt-7 grid gap-5 md:grid-cols-2">
                    <label className={`panel-soft rounded-2xl p-8 text-left transition cursor-pointer hover:border-purple-400/40 ${file ? 'border-purple-500' : ''}`}>
                      <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileUpload} />
                      <Upload className="h-7 w-7 text-white" />
                      <h3 className="mt-6 text-lg font-bold">Upload Resume</h3>
                      <p className="mt-2 text-muted">{file ? file.name : 'PDF, DOCX, PNG, JPG'}</p>
                    </label>

                    <div className={`panel-soft rounded-2xl p-8 text-left transition hover:border-purple-400/40 ${manualSkills ? 'border-purple-500' : ''}`}>
                      <FileText className="h-7 w-7 text-white" />
                      <h3 className="mt-6 text-lg font-bold">Enter Details Manually</h3>
                      <input 
                        type="text" 
                        placeholder="E.g. React, Node.js, Python" 
                        className="mt-4 w-full rounded-md border border-white/10 bg-white/5 p-3 text-white placeholder:text-muted focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                        value={manualSkills}
                        onChange={(e) => setManualSkills(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button 
                        onClick={processResume}
                        disabled={loading || (!file && !manualSkills)}
                        className={`btn-primary flex items-center gap-2 ${(!file && !manualSkills) ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Process Profile'} <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
              </div>
          )}

          {step === 2 && (
              <div>
                  <h2 className="text-2xl font-bold">Step 2 — Review your skills</h2>
                  <p className="text-muted mt-2">We extracted these skills from your input. Add or remove any missing ones.</p>
                  
                  <div className="mt-6 flex flex-wrap gap-3">
                      {skills.map((s, i) => (
                          <div key={i} className="rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm text-purple-200">
                              {s}
                          </div>
                      ))}
                      {skills.length === 0 && <p className="text-muted italic">No skills extracted. Please try again.</p>}
                  </div>

                  <div className="mt-12 flex justify-between">
                    <div className="flex gap-4">
                        <button onClick={() => setStep(1)} className="btn-secondary">← Back</button>
                        <button onClick={handleClearData} className="btn-secondary text-red-400 hover:text-red-300 hover:border-red-400/50">Clear Profile Data</button>
                    </div>
                    <button onClick={analyzeFit} disabled={loading || skills.length === 0} className="btn-primary flex items-center gap-2">
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Analyze Career Fit'} <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
              </div>
          )}

          {step === 3 && (
              <div>
                  <h2 className="text-2xl font-bold">Step 3 — Your Career Fit</h2>
                  <p className="text-muted mt-2">Here is your tailored analysis based on your skills and market data.</p>
                  
                  <div className="mt-8 grid gap-6 md:grid-cols-2">
                      {/* Left Column - Insights & Roadmap */}
                      <div className="space-y-6">
                        {insights && (
                            <>
                            <div className="panel-soft rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-4 text-purple-400">
                                    <TrendingUp className="h-6 w-6" />
                                    <h3 className="text-xl font-bold text-white">Skill Gap Analysis</h3>
                                </div>
                                <h4 className="font-semibold mt-4 mb-2 text-red-300">Missing Skills</h4>
                                <div className="flex flex-wrap gap-2">
                                    {insights.missingSkills?.map((s: string, i: number) => (
                                        <span key={i} className="rounded-md bg-red-500/10 border border-red-500/30 px-3 py-1 text-xs text-red-200">{s}</span>
                                    ))}
                                </div>
                                <h4 className="font-semibold mt-6 mb-2 text-green-300">Trending Skills</h4>
                                <div className="flex flex-wrap gap-2">
                                    {insights.trendingSkills?.map((s: string, i: number) => (
                                        <span key={i} className="rounded-md bg-green-500/10 border border-green-500/30 px-3 py-1 text-xs text-green-200">{s}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="panel-soft rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-4 text-blue-400">
                                    <Compass className="h-6 w-6" />
                                    <h3 className="text-xl font-bold text-white">Learning Roadmap</h3>
                                </div>
                                <div className="space-y-4">
                                    {insights.learningRoadmap?.map((step: any, i: number) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="flex flex-col items-center">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 text-blue-300 font-bold text-sm">
                                                    {step.step || i + 1}
                                                </div>
                                                {i < insights.learningRoadmap.length - 1 && <div className="h-full w-px bg-white/10 mt-2"></div>}
                                            </div>
                                            <div className="pb-4">
                                                <h4 className="font-bold text-md text-white">{step.title}</h4>
                                                <p className="text-sm text-muted mt-1">{step.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            </>
                        )}
                      </div>

                      {/* Right Column - Recommended Jobs */}
                      <div className="panel-soft rounded-2xl p-6">
                         <div className="flex items-center gap-3 mb-6 text-yellow-400">
                             <Briefcase className="h-6 w-6" />
                             <h3 className="text-xl font-bold text-white">Recommended Jobs</h3>
                         </div>
                         <div className="space-y-4">
                             {jobs.slice(0, 5).map((job: any, i: number) => (
                                 <a key={i} href={job.url || '#'} target="_blank" rel="noreferrer" className="block rounded-xl border border-white/5 bg-white/5 p-4 hover:border-white/10 hover:bg-white/10 transition cursor-pointer">
                                     <h4 className="font-bold text-lg">{job.title}</h4>
                                     <p className="text-sm text-purple-300">{job.company?.display_name || job.company?.name || 'Company'}</p>
                                     <div className="mt-3 flex items-center gap-2 text-xs text-muted">
                                         <span className="rounded-md bg-white/10 px-2 py-1">{job.location?.display_name || job.location?.name || 'Remote'}</span>
                                         {job.salary_max && <span className="rounded-md bg-green-500/10 text-green-300 px-2 py-1">${Math.round(job.salary_max)}</span>}
                                     </div>
                                 </a>
                             ))}
                             {jobs.length === 0 && <p className="text-muted text-sm">No exact job matches found right now.</p>}
                         </div>
                      </div>
                  </div>

                  <div className="mt-12 flex justify-start">
                    <button onClick={() => setStep(1)} className="btn-secondary">Start Over</button>
                  </div>
              </div>
          )}
        </div>
      </section>
    </AppShell>
  );
}

export default ResumeAI;
