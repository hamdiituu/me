import ProductPreviewCard from "./ProductPreviewCard";

function ProductsSection({ t, products }) {
  return (
    <section id="products" className="section-card">
      <div className="section-head">
        <h2>{t.productsTitle}</h2>
        <p>{t.productsDescription}</p>
      </div>
      <div className="product-grid">
        {products.map((product) => (
          <ProductPreviewCard key={product.name} product={product} t={t} />
        ))}
      </div>
    </section>
  );
}

export default ProductsSection;
