function HeroSection({ t }) {
  return (
    <section id="top" className="hero">
      <div className="hero-copy">
        <span className="hero-chip">Hamdi Tug | {t.tag}</span>
        <h1>{t.heroTitle}</h1>
        <p>{t.heroDescription}</p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="#products">
            {t.actionProducts}
          </a>
          <a className="btn btn-ghost" href="#projects">
            {t.actionProjects}
          </a>
        </div>
      </div>

      <div className="hero-quick">
        {t.quickCards.map((card) => (
          <article key={card.title}>
            <h3>{card.title}</h3>
            <p>{card.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default HeroSection;
