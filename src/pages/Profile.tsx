import { AppShell, PageHero } from "../components/Layout";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <AppShell>
        <div className="flex h-[50vh] items-center justify-center text-muted">Loading profile...</div>
      </AppShell>
    );
  }

  const initials = user.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'U';
  return (
    <AppShell>
      <PageHero
        eyebrow="User Profile"
        title="Career Profile"
        subtitle="Your saved preferences, skills, education, and resume status."
      />

      <section className="page-container py-10">
        <div className="panel rounded-2xl p-8">
          <div className="flex items-center gap-5">
            <div className="brand-gradient grid h-16 w-16 place-items-center rounded-full text-xl font-bold">
              {initials}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-muted">{user.email}</p>
            </div>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <section>
              <h3 className="text-xl font-bold">Target Role</h3>
              <p className="mt-3 text-muted">Data Analyst</p>
            </section>

            <section>
              <h3 className="text-xl font-bold">Preferred Location</h3>
              <p className="mt-3 text-muted">Remote / Bengaluru / Hyderabad</p>
            </section>

            <section className="md:col-span-2">
              <h3 className="text-xl font-bold">Skills</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {user.skills && user.skills.length > 0 ? (
                  user.skills.map((skill: string) => (
                    <span key={skill} className="pill">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-muted text-sm">No skills added yet. Upload a resume to analyze your skills.</p>
                )}
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold">Resume Status</h3>
              <p className="mt-3 text-emerald-400">Ready for analysis</p>
            </section>

            <section>
              <h3 className="text-xl font-bold">Profile Strength</h3>
              <div className="progress-track mt-4">
                <div className="progress-fill" style={{ width: "78%" }} />
              </div>
            </section>
          </div>
        </div>
      </section>
    </AppShell>
  );
}

export default Profile;
