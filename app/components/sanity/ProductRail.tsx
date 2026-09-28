import {useRef} from 'react';
import {Link} from '~/components/Link';

export type RailProduct = {
  id: string;
  handle: string;
  title: string;
  featuredImage?: {url: string; altText?: string | null} | null;
  priceRange: {minVariantPrice: {amount: string; currencyCode: string}};
};

export function ProductRail({title, products}: {title: string; products: RailProduct[]}) {
  const track = useRef<HTMLDivElement>(null);
  if (!products.length) return null;

  return (
    <section className="sanity-product-rail" aria-label={title}>
      <header className="sanity-product-rail__header">
        <h2>{title}</h2>
        <div className="sanity-product-rail__controls">
          <button type="button" aria-label={`Scroll ${title} backward`} onClick={() => track.current?.scrollBy({left: -track.current.clientWidth * 0.8, behavior: 'smooth'})}>Previous</button>
          <button type="button" aria-label={`Scroll ${title} forward`} onClick={() => track.current?.scrollBy({left: track.current.clientWidth * 0.8, behavior: 'smooth'})}>Next</button>
        </div>
      </header>
      <div className="sanity-product-rail__track" ref={track}>
        {products.map((product) => (
          <Link className="sanity-product-card" key={product.id} to={`/products/${product.handle}`}>
            {product.featuredImage ? <img src={product.featuredImage.url} alt={product.featuredImage.altText || product.title} loading="lazy" /> : <div className="sanity-product-card__placeholder" />}
            <span className="sanity-product-card__title">{product.title}</span>
            <span className="sanity-product-card__price">{new Intl.NumberFormat('it-IT', {style: 'currency', currency: product.priceRange.minVariantPrice.currencyCode}).format(Number(product.priceRange.minVariantPrice.amount))}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}