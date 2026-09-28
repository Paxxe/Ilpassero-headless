import {redirect} from 'react-router';
import type {Route} from './+types/($locale).account.$';
import {localizePath, toPathPrefix} from '~/lib/i18n';

// fallback wild card for all unauthenticated routes in account section
export async function loader({context}: Route.LoaderArgs) {
  await context.customerAccount.handleAuthStatus();

  return redirect(localizePath('/account', toPathPrefix(context.storefront.i18n)));
}
