import { v1beta1 } from '@google-cloud/secret-manager';
import mem from 'mem';

export function getProjectId(): string {
  if (process.env.GOOGLE_CLOUD_PROJECT != null) {
    return process.env.GOOGLE_CLOUD_PROJECT;
  }
  throw new Error('GOOGLE_CLOUD_PROJECT env var undefined');
}

export function getSecretLogicalId(secret: string, v = 'latest'): string {
  return `projects/${getProjectId()}/secrets/${secret}/versions/${v}`;
}

export async function getSecret(
  secret: string,
  client: v1beta1.SecretManagerServiceClient,
): Promise<string> {
  const [version] = await client.accessSecretVersion({ name: getSecretLogicalId(secret) });
  if (version?.payload?.data != null) {
    return version.payload.data.toString();
  }
  throw new Error(`Unable to retrieve secret ${secret}`);
}

export const getMemoizedSecret = mem(getSecret, { maxAge: 6.048e+8, cachePromiseRejection: false });
