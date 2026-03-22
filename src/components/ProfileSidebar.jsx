function ProfileSidebar({ t, productCount, repoCount }) {
  const overviewLabel = t.navOverview || "Overview";
  const pinnedLabel = t.sidebarPinned || "Pinned";
  const linksLabel = t.sidebarLinks || "Live Links";

  return (
    <aside className="sidebar">
      <section className="sidebar-card sidebar-profile">
        <img
          className="sidebar-avatar"
          src="https://avatars.githubusercontent.com/hamdiituu?size=220"
          alt="hamdiituu"
        />
        <h2>hamdiituu</h2>
        <p className="sidebar-handle">@hamdiituu</p>
        <p className="sidebar-tag">{t.tag}</p>
      </section>

      <section className="sidebar-card sidebar-nav">
        <a href="#top">{overviewLabel}</a>
        <a href="#products">{t.navProducts}</a>
        <a href="#projects">{t.navProjects}</a>
      </section>

      <section className="sidebar-card sidebar-metrics">
        <h3>{pinnedLabel}</h3>
        <div className="metric-row">
          <span>{t.navProducts}</span>
          <strong>{productCount}</strong>
        </div>
        <div className="metric-row">
          <span>{t.navProjects}</span>
          <strong>{repoCount}</strong>
        </div>
      </section>

      <section className="sidebar-card sidebar-links">
        <h3>{linksLabel}</h3>
        <a href="https://cvmakes.com" target="_blank" rel="noreferrer">
          cvmakes.com
        </a>
        <a href="https://adres100.com" target="_blank" rel="noreferrer">
          adres100.com
        </a>
        <a href="https://legiflare.com" target="_blank" rel="noreferrer">
          legiflare.com
        </a>
      </section>
    </aside>
  );
}

export default ProfileSidebar;
