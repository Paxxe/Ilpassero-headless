import {Link} from '~/components/Link';
import {Image, Money} from '@shopify/hydrogen';
import type {ProductCardFragment} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';

const CARD_IMAGE_SIZES =
  '(min-width: 64em) 25vw, (min-width: 45em) 33vw, 50vw';

export function ProductItem({
  product,
  loading,
}: {
  product: ProductCardFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;
  const hoverImage = product.images.nodes.find(
    (node) => node.id !== image?.id,
  );
  const price = product.priceRange.minVariantPrice;
  const compareAtPrice = product.compareAtPriceRange.minVariantPrice;
  const isOnSale = Number(compareAtPrice.amount) > Number(price.amount);

  return (
    <Link
      className={`product-card${product.availableForSale ? '' : ' product-card--sold-out'}`}
      prefetch="intent"
      to={variantUrl}
    >
      <div className="product-card__media">
        {image ? (
          <Image
            className="product-card__image"
            alt={image.altText || product.title}
            aspectRatio="3/4"
            crop="center"
            data={image}
            loading={loading}
            sizes={CARD_IMAGE_SIZES}
          />
        ) : null}
        {hoverImage ? (
          <Image
            className="product-card__image product-card__image--hover"
            alt=""
            aria-hidden
            aspectRatio="3/4"
            crop="center"
            data={hoverImage}
            loading="lazy"
            sizes={CARD_IMAGE_SIZES}
          />
        ) : null}
      </div>
      <div className="product-card__info">
        <h3 className="product-card__title">{product.title}</h3>
        <p className="product-card__price">
          {isOnSale ? (
            <s className="product-card__compare-at">
              <Money as="span" data={compareAtPrice} />
            </s>
          ) : null}
          <Money
            as="span"
            className={isOnSale ? 'product-card__sale-price' : undefined}
            data={price}
          />
        </p>
      </div>
    </Link>
  );
}
