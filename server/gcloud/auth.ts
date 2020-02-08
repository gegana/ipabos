/* eslint-disable import/prefer-default-export */
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { getMemoizedSecret, secretsManager } from './secrets';

import mem = require('mem');

async function getAuthClient(): Promise<OAuth2Client> {
  const clientId = await getMemoizedSecret('clientId', secretsManager());
  const clientSecret = await getMemoizedSecret('clientSecret', secretsManager());
  return new google.auth.OAuth2(
    clientId,
    clientSecret,
    'https://www.ipabos.com/approveContact',
  );
}

export const oAuthClient = mem(getAuthClient, { maxAge: 6.048e+8, cachePromiseRejection: false });

export async function oAuthClientWithCredentials(code: string): Promise<OAuth2Client> {
  const authClient = await oAuthClient();
  const { tokens } = await authClient.getToken(code);
  authClient.setCredentials(tokens);
  return authClient;
}
