import {type FetcherWithComponents} from 'react-router';
import {CartForm, type OptimisticCartLineInput} from '@shopify/hydrogen';
import {useLocalePath} from '~/components/Link';

export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
  className = 'add-to-cart',
  pendingLabel,
}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: Array<OptimisticCartLineInput>;
  onClick?: () => void;
  className?: string;
  /** Label while the line is being added. */
  pendingLabel?: React.ReactNode;
}) {
  const cartRoute = useLocalePath()('/cart');
  return (
    <CartForm route={cartRoute} inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => {
        const pending = fetcher.state !== 'idle';
        return (
          <>
            <input
              name="analytics"
              type="hidden"
              value={JSON.stringify(analytics)}
            />
            <button
              type="submit"
              className={className}
              onClick={onClick}
              disabled={disabled || pending}
              aria-busy={pending}
            >
              {pending && pendingLabel ? pendingLabel : children}
            </button>
          </>
        );
      }}
    </CartForm>
  );
}
