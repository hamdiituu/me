import RepoCard from "./RepoCard";

function ProjectsSection({
  t,
  repos,
  repoState,
  readmePreviews,
  readmeLoadingMap,
  readmeLoading,
  language,
}) {
  const showLoading = repoState.loading || readmeLoading;

  return (
    <section id="projects" className="section-card">
      <div className="section-head">
        <h2>{t.projectsTitle}</h2>
        <p>{t.projectsDescription}</p>
      </div>

      {showLoading ? <div className="repo-status">{t.loadingRepos}</div> : null}
      {repoState.hasError ? <div className="repo-status repo-status--warning">{t.repoError}</div> : null}
      {!showLoading && !repoState.hasError && repos.length === 0 ? (
        <div className="repo-status">{t.noReadmeRepos || t.repoNoDescription}</div>
      ) : null}

      {repos.length > 0 ? (
        <div className="repo-grid">
          {repos.map((repo) => (
            <RepoCard
              key={repo.id}
              repo={repo}
              language={language}
              t={t}
              readmePreview={readmePreviews[repo.id]}
              readmeLoading={Boolean(readmeLoadingMap[repo.id])}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}

export default ProjectsSection;
