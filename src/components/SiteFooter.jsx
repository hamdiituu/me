function SiteFooter({ t }) {
  return (
    <footer className="footer">
      <p>{t.footerOwner}</p>
      <div className="footer-links">
        <a href="https://cvmakes.com" target="_blank" rel="noreferrer">
          cvmakes.com
        </a>
        <a href="https://adres100.com" target="_blank" rel="noreferrer">
          adres100.com
        </a>
        <a href="https://legiflare.com" target="_blank" rel="noreferrer">
          legiflare.com
        </a>
        <a href="https://github.com/hamdiituu" target="_blank" rel="noreferrer">
          github.com/hamdiituu
        </a>
      </div>
    </footer>
  );
}

export default SiteFooter;
