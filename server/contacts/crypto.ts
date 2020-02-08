/* eslint-disable @typescript-eslint/camelcase */
import { v1beta1 } from '@google-cloud/secret-manager';
import crypto from 'crypto';
import { people_v1 } from 'googleapis';
import { getMemoizedSecret } from '../gcloud/secrets';

export class ContactsCrypto {
  key: string;

  constructor(key: string) {
    this.key = key;
  }

  encryptContact(contact: people_v1.Schema$Person): string {
    const iv = crypto.randomBytes(16);
    const asJson = JSON.stringify(contact);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(this.key), iv);
    const encrypted = Buffer.concat([cipher.update(asJson), cipher.final()]);
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
  }

  decryptContact(encryptedContact: string): people_v1.Schema$Person {
    const parts = encryptedContact.split(':');
    const iv = Buffer.from(parts.shift(), 'hex');
    const encryptedText = Buffer.from(parts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(this.key), iv);
    const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
    return JSON.parse(decrypted.toString());
  }
}

export async function createContactsCrypto(
  secretManagerClient: v1beta1.SecretManagerServiceClient,
): Promise<ContactsCrypto> {
  const subscriberContactEncryptionKey = await getMemoizedSecret('subscriberContactEncryptionKey', secretManagerClient);
  return new ContactsCrypto(
    subscriberContactEncryptionKey,
  );
}
