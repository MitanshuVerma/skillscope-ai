import { FileText, Upload } from "lucide-react";
import { AppShell, PageHero } from "../components/Layout";

function ResumeAI() {
  return (
    <AppShell>
      <PageHero
        eyebrow="AI Resume Intelligence"
        title="Resume AI"
        subtitle="Upload or enter your details. Get gap analysis, role matches, and actionable improvements."
      />

      <section className="page-container py-12">
        <div className="panel mx-auto max-w-4xl rounded-2xl p-5">
          <div className="grid items-center gap-4 md:grid-cols-[1fr_1fr_1fr]">
            {["Choose input", "Review profile", "Analyze career fit"].map((step, index) => (
              <div key={step} className="flex items-center gap-4">
                <div className={`grid h-10 w-10 place-items-center rounded-full ${index === 0 ? "brand-gradient" : "bg-white/10"}`}>
                  {index + 1}
                </div>
                <span className={index === 0 ? "font-bold" : "text-muted"}>{step}</span>
                {index < 2 && <div className="hidden h-px flex-1 bg-white/10 md:block" />}
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-4xl">
          <h2 className="text-2xl font-bold">Step 1 — Choose input method</h2>

          <div className="mt-7 grid gap-5 md:grid-cols-2">
            <button className="panel-soft rounded-2xl p-8 text-left transition hover:border-purple-400/40">
              <Upload className="h-7 w-7 text-white" />
              <h3 className="mt-6 text-lg font-bold">Upload Resume</h3>
              <p className="mt-2 text-muted">PDF, DOCX, PNG, JPG</p>
            </button>

            <button className="panel-soft rounded-2xl p-8 text-left transition hover:border-purple-400/40">
              <FileText className="h-7 w-7 text-white" />
              <h3 className="mt-6 text-lg font-bold">Enter Details Manually</h3>
              <p className="mt-2 text-muted">Use our guided form</p>
            </button>
          </div>

          <div className="mt-8 flex justify-end">
            <button className="btn-primary opacity-60">Continue →</button>
          </div>
        </div>
      </section>
    </AppShell>
  );
}

export default ResumeAI;