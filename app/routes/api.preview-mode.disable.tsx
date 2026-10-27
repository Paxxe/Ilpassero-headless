import {redirect} from 'react-router';
import type {Route} from './+types/api.preview-mode.disable';
import {getPreviewCookie} from '~/lib/sanity.server';

export async function loader({request, context}: Route.LoaderArgs) {
  const redirectTo = new URL(request.url).searchParams.get('redirect') || '/';

  return redirect(redirectTo.startsWith('/') ? redirectTo : '/', {
    headers: {
      'Set-Cookie': await getPreviewCookie(context.env).serialize(false, {maxAge: 0}),
    },
  });
}
