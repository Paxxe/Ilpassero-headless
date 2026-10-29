import type {ProductVariantFragment} from 'storefrontapi.generated';
import {Image} from '@shopify/hydrogen';

/** Product photo at its real proportions (no cropping). */
export function ProductImage({
  image,
  loading = 'lazy',
  sizes = '(min-width: 64em) 35vw, (min-width: 45em) 50vw, 100vw',
}: {
  image: ProductVariantFragment['image'];
  loading?: 'eager' | 'lazy';
  sizes?: string;
}) {
  if (!image) {
    return <div className="product-image product-image--empty" />;
  }
  return (
    <div className="product-image">
      <Image
        alt={image.altText || ''}
        data={image}
        key={image.id}
        loading={loading}
        sizes={sizes}
      />
    </div>
  );
}
