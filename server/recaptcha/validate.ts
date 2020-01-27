/* eslint-disable import/prefer-default-export */
import Axios from 'axios';
import { v1beta1 } from '@google-cloud/secret-manager';
import { getMemoizedSecret } from '../gcloud/secrets';

export async function validate(
  recaptcha: string,
  remoteAddress: string,
  secretManagerClient: v1beta1.SecretManagerServiceClient,
): Promise<boolean> {
  const recaptchaSecret = await getMemoizedSecret('recaptchaSecret', secretManagerClient);
  const response = await Axios.post(
    `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${recaptcha}&remoteip=${remoteAddress}`,
  );
  if (response?.status === 200 && response.data?.success) {
    return true;
  }
  return false;
}
