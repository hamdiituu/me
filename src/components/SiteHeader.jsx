function SiteHeader({
  t,
  language,
  localeOptions,
  theme,
  onLanguageChange,
  onThemeToggle,
}) {
  return (
    <header className="site-header">
      <a className="brand" href="#top">
        hamdiituu
      </a>
      <nav className="main-nav">
        <a href="#products">{t.navProducts}</a>
        <a href="#projects">{t.navProjects}</a>
        <a href="https://github.com/hamdiituu" target="_blank" rel="noreferrer">
          {t.navGithub}
        </a>
      </nav>
      <div className="header-controls">
        <select
          className="language-select"
          value={language}
          onChange={(event) => onLanguageChange(event.target.value)}
          aria-label="Language"
        >
          {localeOptions.map((locale) => (
            <option key={locale.code} value={locale.code}>
              {locale.label}
            </option>
          ))}
        </select>
        <button type="button" className="theme-switch" onClick={onThemeToggle}>
          {theme === "light" ? "Dark" : "Light"}
        </button>
      </div>
    </header>
  );
}

export default SiteHeader;
