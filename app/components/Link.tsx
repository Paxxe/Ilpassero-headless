import {forwardRef, useCallback} from 'react';
import {
  Link as RouterLink,
  NavLink as RouterNavLink,
  useParams,
  type LinkProps,
  type NavLinkProps,
} from 'react-router';
import {localizePath} from '~/lib/i18n';

/** Returns a function that prefixes absolute in-app paths with the current locale. */
export function useLocalePath() {
  const {locale} = useParams();
  const pathPrefix = locale ? `/${locale.toLowerCase()}` : '';
  return useCallback(
    (path: string) => localizePath(path, pathPrefix),
    [pathPrefix],
  );
}

/** Drop-in replacement for react-router's Link that keeps the locale prefix. */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  {to, ...props},
  ref,
) {
  const localize = useLocalePath();
  return (
    <RouterLink
      ref={ref}
      to={typeof to === 'string' ? localize(to) : to}
      {...props}
    />
  );
});

/** Drop-in replacement for react-router's NavLink that keeps the locale prefix. */
export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  function NavLink({to, ...props}, ref) {
    const localize = useLocalePath();
    return (
      <RouterNavLink
        ref={ref}
        to={typeof to === 'string' ? localize(to) : to}
        {...props}
      />
    );
  },
);
