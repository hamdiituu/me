function ProductPreviewCard({ product, t }) {
  const previewLabel = t.sitePreviewLabel || "Site Preview";

  return (
    <a className="product-card" href={product.href} target="_blank" rel="noreferrer">
      <div className="site-preview-shell">
        <img
          className="site-preview-image"
          src={product.previewImage}
          alt={`${product.name} screenshot`}
          loading="lazy"
        />
        <span className="site-preview-label">{previewLabel}</span>
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
