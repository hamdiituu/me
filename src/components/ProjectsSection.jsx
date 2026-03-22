import RepoCard from "./RepoCard";

function ProjectsSection({
  t,
  repos,
  repoState,
  language,
}) {
  const errorMessage = t[repoState.errorKey] || t.repoError;

  return (
    <section id="projects" className="section-card">
      <div className="section-head">
        <h2>{t.projectsTitle}</h2>
        <p>{t.projectsDescription}</p>
      </div>

      {repoState.loading ? <div className="repo-status">{t.loadingRepos}</div> : null}
      {repoState.hasError ? <div className="repo-status repo-status--warning">{errorMessage}</div> : null}
      {!repoState.loading && !repoState.hasError && repos.length === 0 ? (
        <div className="repo-status">{t.repoNoDescription}</div>
      ) : null}

      {repos.length > 0 ? (
        <div className="repo-grid">
          {repos.map((repo) => (
            <RepoCard key={repo.id} repo={repo} language={language} t={t} />
          ))}
        </div>
      ) : null}
    </section>
  );
}

export default ProjectsSection;
