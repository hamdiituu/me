function ProductPreviewCard({ product, t }) {
  const previewLabel = t.sitePreviewLabel || "Site Preview";

  return (
    <a className="product-card" href={product.href} target="_blank" rel="noreferrer">
      <div className="site-preview-shell">
        <div className="site-preview-toolbar">
          <span>{product.name}</span>
          <span>{previewLabel}</span>
        </div>
        <iframe
          className="site-preview-frame"
          src={product.href}
          title={`${product.name} preview`}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <div className="site-preview-overlay" />
      </div>

      <h3>{product.name}</h3>
      <p className="product-summary">{product.summary}</p>
      <ul className="product-focus">
        {product.focus.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </a>
  );
}

export default ProductPreviewCard;
