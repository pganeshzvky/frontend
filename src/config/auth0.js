import { Auth0Client } from '@auth0/auth0-spa-js';

export const auth0Config = {
  domain: process.env.REACT_APP_AUTH0_DOMAIN,
  client_id: process.env.REACT_APP_AUTH0_CLIENT_ID,
  audience: process.env.REACT_APP_AUTH0_AUDIENCE,
  redirect_uri: `${window.location.origin}/auth`,
};

export const auth0 = new Auth0Client({
  ...auth0Config,
  scope: 'openid email profile offline_access',
});