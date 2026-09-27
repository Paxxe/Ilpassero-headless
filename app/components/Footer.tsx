import {Suspense} from 'react';
import {Await, NavLink} from 'react-router';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';
import {resolveMenuUrl} from '~/lib/menu-url';

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

export function Footer({
  footer: footerPromise,
  header,
  publicStoreDomain,
}: FooterProps) {
  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {(footer) => (
          <footer className="footer">
            {footer?.menu && header.shop.primaryDomain?.url && (
              <FooterMenu
                menu={footer.menu}
                primaryDomainUrl={header.shop.primaryDomain.url}
                publicStoreDomain={publicStoreDomain}
              />
            )}
            <div className="footer-bottom">
              <span>Il Passero</span>
              <span>© {new Date().getFullYear()} Il Passero</span>
            </div>
          </footer>
        )}
      </Await>
    </Suspense>
  );
}

function FooterMenu({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: FooterQuery['menu'];
  primaryDomainUrl: FooterProps['header']['shop']['primaryDomain']['url'];
  publicStoreDomain: string;
}) {
  return (
    <nav className="footer-menu" role="navigation" aria-label="Footer">
      {(menu || FALLBACK_FOOTER_MENU).items.map((item) => {
        const destination = resolveMenuUrl(item, {publicStoreDomain, primaryDomainUrl});
        if (!destination) return null;
        return (
          <section className="footer-menu__column" key={item.id}>
            {destination.external ? <a className="footer-menu__heading" href={destination.href} rel="noopener noreferrer" target="_blank">{item.title}</a> : <NavLink className="footer-menu__heading" end prefetch="intent" style={activeLinkStyle} to={destination.href}>{item.title}</NavLink>}
            {item.items?.length ? (
              <ul>
                {item.items.map((child) => {
                  const childDestination = resolveMenuUrl(child, {publicStoreDomain, primaryDomainUrl});
                  if (!childDestination) return null;
                  return <li key={child.id}>{childDestination.external ? <a href={childDestination.href} rel="noopener noreferrer" target="_blank">{child.title}</a> : <NavLink end prefetch="intent" style={activeLinkStyle} to={childDestination.href}>{child.title}</NavLink>}</li>;
                })}
              </ul>
            ) : null}
          </section>
        );
      })}
    </nav>
  );
}

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'gid://shopify/MenuItem/461633060920',
      resourceId: 'gid://shopify/ShopPolicy/23358046264',
      tags: [],
      title: 'Privacy Policy',
      type: 'SHOP_POLICY',
      url: '/policies/privacy-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633093688',
      resourceId: 'gid://shopify/ShopPolicy/23358013496',
      tags: [],
      title: 'Refund Policy',
      type: 'SHOP_POLICY',
      url: '/policies/refund-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633126456',
      resourceId: 'gid://shopify/ShopPolicy/23358111800',
      tags: [],
      title: 'Shipping Policy',
      type: 'SHOP_POLICY',
      url: '/policies/shipping-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633159224',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: 'Terms of Service',
      type: 'SHOP_POLICY',
      url: '/policies/terms-of-service',
      items: [],
    },
  ],
};

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'white',
  };
}
