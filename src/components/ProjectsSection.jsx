import RepoCard from "./RepoCard";

function ProjectsSection({ t, repos, repoState, readmePreviews, readmeLoadingMap, language }) {
  return (
    <section id="projects" className="section-card">
      <div className="section-head">
        <h2>{t.projectsTitle}</h2>
        <p>{t.projectsDescription}</p>
      </div>

      {repoState.loading ? <div className="repo-status">{t.loadingRepos}</div> : null}
      {repoState.hasError ? <div className="repo-status repo-status--warning">{t.repoError}</div> : null}

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
    </section>
  );
}

export default ProjectsSection;
