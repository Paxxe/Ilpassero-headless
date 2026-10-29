import {useNavigate} from 'react-router';
import {Link} from '~/components/Link';
import {type MappedProductOptions} from '@shopify/hydrogen';
import type {
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';
import type {ProductFragment} from 'storefrontapi.generated';

/** Shopify option names are often uppercase (TAGLIA, COLORE): show them as "Taglia". */
function formatOptionName(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

export function ProductForm({
  productOptions,
  selectedVariant,
}: {
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
}) {
  const navigate = useNavigate();
  const {open} = useAside();
  const available = Boolean(selectedVariant?.availableForSale);

  return (
    <div className="product-form">
      {productOptions.map((option) => {
        const label = formatOptionName(option.name);
        const selected = option.optionValues.find((value) => value.selected);

        // A single value is not a choice: show it as plain text
        if (option.optionValues.length === 1) {
          return (
            <p className="product-option product-option--fixed" key={option.name}>
              <span className="product-option__label">{label}:</span>{' '}
              <span className="product-option__value">{option.optionValues[0].name}</span>
            </p>
          );
        }

        return (
          <fieldset className="product-option" key={option.name}>
            <legend className="product-option__legend">
              <span className="product-option__label">{label}:</span>{' '}
              <span className="product-option__value">{selected?.name}</span>
            </legend>
            <div className="product-option__values">
              {option.optionValues.map((value) => {
                const {
                  name,
                  handle,
                  variantUriQuery,
                  selected: isSelected,
                  available: isAvailable,
                  exists,
                  isDifferentProduct,
                  swatch,
                } = value;
                const hasSwatch = Boolean(swatch?.color || swatch?.image?.previewImage?.url);
                const className = [
                  'product-option__item',
                  hasSwatch ? 'product-option__item--swatch' : '',
                  isSelected ? 'is-selected' : '',
                  isAvailable ? '' : 'is-unavailable',
                ]
                  .filter(Boolean)
                  .join(' ');

                if (isDifferentProduct) {
                  // Combined listing child product: a real link (indexable) to the other product
                  return (
                    <Link
                      className={className}
                      key={option.name + name}
                      prefetch="intent"
                      preventScrollReset
                      replace
                      to={`/products/${handle}?${variantUriQuery}`}
                      aria-current={isSelected ? 'true' : undefined}
                      title={name}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </Link>
                  );
                }

                // Same product: a button, so bots do not index each variant as a duplicate page
                return (
                  <button
                    type="button"
                    className={className}
                    key={option.name + name}
                    aria-pressed={isSelected}
                    title={isAvailable ? name : `${name} (esaurito)`}
                    disabled={!exists}
                    onClick={() => {
                      if (!isSelected) {
                        void navigate(`?${variantUriQuery}`, {
                          replace: true,
                          preventScrollReset: true,
                        });
                      }
                    }}
                  >
                    <ProductOptionSwatch swatch={swatch} name={name} />
                  </button>
                );
              })}
            </div>
          </fieldset>
        );
      })}
      <AddToCartButton
        disabled={!available}
        onClick={() => {
          open('cart');
        }}
        pendingLabel="Aggiunta in corso…"
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: 1,
                  selectedVariant,
                },
              ]
            : []
        }
      >
        {available ? 'Aggiungi al carrello' : 'Esaurito'}
      </AddToCartButton>
    </div>
  );
}

function ProductOptionSwatch({
  swatch,
  name,
}: {
  swatch?: Maybe<ProductOptionValueSwatch> | undefined;
  name: string;
}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;

  if (!image && !color) return name;

  return (
    <span
      aria-label={name}
      className="product-option__swatch"
      style={{backgroundColor: color || 'transparent'}}
    >
      {image ? <img src={image} alt="" /> : null}
    </span>
  );
}
