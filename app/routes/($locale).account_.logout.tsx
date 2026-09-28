import {redirect} from 'react-router';
import type {Route} from './+types/($locale).account_.logout';
import {localizePath, toPathPrefix} from '~/lib/i18n';

// if we don't implement this, /account/logout will get caught by account.$.tsx to do login
export async function loader({context}: Route.LoaderArgs) {
  return redirect(localizePath('/', toPathPrefix(context.storefront.i18n)));
}

export async function action({context}: Route.ActionArgs) {
  return context.customerAccount.logout();
}
