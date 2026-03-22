import { formatDate } from "../utils/helpers";

function RepoCard({ repo, language, t }) {
  return (
    <a className="repo-card" href={repo.html_url} target="_blank" rel="noreferrer">
      <div className="repo-head">
        <h3>{repo.name}</h3>
        <span>{repo.language || "General"}</span>
      </div>
      <p className="repo-description">{repo.description || t.repoNoDescription}</p>
      <div className="repo-meta">
        <span>★ {repo.stargazers_count}</span>
        <span>{formatDate(repo.updated_at, language)}</span>
      </div>
    </a>
  );
}

export default RepoCard;
