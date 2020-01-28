import Axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';
import { v1beta1 } from '@google-cloud/secret-manager';
import { google } from 'googleapis';
import mem from 'mem';
import crypto from 'crypto';
import { UserEntryForm } from '../types/forms';
import { getMemoizedSecret } from '../gcloud/secrets';

export type GoogleContact = {
  names: Array<{givenName: string; familyName: string}>;
  emailAddresses: Array<{value: string; type: string}>;
  phoneNumbers: Array<{value: string; type: string}>;
  organizations: Array<{name: string; title: string; type: string}>;
  occupations: Array<{value: string}>;
  urls: Array<{value: string; type: string}>;
};

export interface JwtClient {
  credentials: {
    access_token?: string | null;
  };
}

export function emailsFromContact(contact: GoogleContact): Array<string> {
  return contact.emailAddresses.map((e) => e.value);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function googleContactFromFormData(formData: UserEntryForm): GoogleContact {
  return {
    names: [
      {
        givenName: formData.firstName,
        familyName: formData.lastName,
      },
    ],
    emailAddresses: [
      {
        value: formData.email,
        type: 'work',
      },
    ],
    phoneNumbers: [
      {
        value: `+${formData.countryPrefix}${formData.phone}`,
        type: 'work',
      },
    ],
    organizations: [
      {
        name: formData.company,
        title: formData.profession,
        type: 'work',
      },
    ],
    occupations: [
      {
        value: formData.profession,
      },
    ],
    urls: [
      {
        value: formData.linkedin,
        type: 'work',
      },
    ],
  };
}

export class ContactsManager {
  private axios: AxiosInstance;

  private jwt: JwtClient;

  private contactGroupName: string;

  private encryptionKey: string;

  constructor(
    axios: AxiosInstance,
    jwt: JwtClient,
    contactGroupName: string,
    encryptionKey: string,
  ) {
    this.axios = axios;
    this.jwt = jwt;
    this.contactGroupName = contactGroupName;
    this.encryptionKey = encryptionKey;
  }

  private static contactExists(contact: GoogleContact, emails: Set<string>): boolean {
    return contact.emailAddresses.some((email) => emails.has(email.value));
  }

  private withJwtHeaders(): AxiosRequestConfig {
    return {
      headers: {
        Authorization: `Bearer ${this.jwt.credentials.access_token}`,
      },
    };
  }

  private async requestAllEmails(
    pageToken: string | null = null,
    syncToken: string | null = null,
  ): Promise<AxiosResponse> {
    let requestUri = 'https://people.googleapis.com/v1/people/me/connections?personFields=emailAddresses';

    if (pageToken != null && pageToken.length > 0) {
      requestUri += `&pageToken=${pageToken}`;
    }

    if (syncToken != null && syncToken.length > 0) {
      requestUri += `&syncToken=${syncToken}`;
    }

    const response = await this.axios.get(requestUri, this.withJwtHeaders());

    return response;
  }

  private static processAllEmailsResponse(response: AxiosResponse, emails: Set<string>): void {
    response.data.connections.forEach((c: { emailAddresses: { value: string }[] }) => {
      c.emailAddresses.forEach((e: { value: string }) => emails.add(e.value));
    });
  }

  async getAllEmails(): Promise<Set<string>> {
    let nextPageToken: string | null = null;
    const emails = new Set<string>();

    do {
      // eslint-disable-next-line no-await-in-loop
      const response = await this.requestAllEmails(nextPageToken);

      if (response.status === 200 && response.data?.connections != null) {
        ContactsManager.processAllEmailsResponse(response, emails);
        nextPageToken = response.data.nextPageToken;
      }
    } while (nextPageToken != null);

    return emails;
  }

  async post(contact: GoogleContact): Promise<string | null> {
    if (ContactsManager.contactExists(contact, await this.getAllEmails())) {
      return null;
    }

    const response = await this.axios.post(
      'https://people.googleapis.com/v1/people:createContact',
      contact,
      this.withJwtHeaders(),
    );

    if (response?.status === 200 && response.data) {
      return response.data.resourceName;
    }

    throw new Error('Unable to create contact');
  }

  async enlist(contactId: string): Promise<void> {
    const data = {
      resourceNamesToAdd: [
        contactId,
      ],
    };

    const response = await this.axios.post(
      `https://people.googleapis.com/v1/contactGroups/${this.contactGroupName}/members:modify`,
      data,
      this.withJwtHeaders(),
    );

    if (!response) {
      throw new Error(`Unable to enlist contact ${contactId} to contact group ${this.contactGroupName}`);
    }
  }

  async requestForApproval(contact: GoogleContact): Promise<string | null> {
    if (ContactsManager.contactExists(contact, await this.getAllEmails())) {
      return null;
    }
    return this.encryptContact(contact);
  }

  encryptContact(contact: GoogleContact): string {
    const iv = crypto.randomBytes(16);
    const asJson = JSON.stringify(contact);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(this.encryptionKey), iv);
    const encrypted = Buffer.concat([cipher.update(asJson), cipher.final()]);
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
  }

  decryptContact(encryptedContact: string): GoogleContact {
    const parts = encryptedContact.split(':');
    const iv = Buffer.from(parts.shift(), 'hex');
    const encryptedText = Buffer.from(parts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(this.encryptionKey), iv);
    const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
    return JSON.parse(decrypted.toString());
  }
}

async function getJwtClient(
  subscriberPrivateKey: string,
  subscriberPrivateKeyClientEmail: string,
  gmail: string,
): Promise<JwtClient> {
  const jwtClient = new google.auth.JWT(
    subscriberPrivateKeyClientEmail,
    null,
    subscriberPrivateKey,
    [
      'https://www.googleapis.com/auth/contacts',
    ],
    gmail,
  );
  const t = new Promise<void>((resolve, reject) => {
    jwtClient.authorize((err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
  await t;
  return jwtClient;
}

export async function createContactsManager(
  secretManagerClient: v1beta1.SecretManagerServiceClient,
): Promise<ContactsManager> {
  const subscriberPrivateKey = await getMemoizedSecret('subscriberPrivateKey', secretManagerClient);
  const subscriberPrivateKeyClientEmail = await getMemoizedSecret('subscriberPrivateKeyClientEmail', secretManagerClient);
  const subscriberResourceName = await getMemoizedSecret('subscriberResourceName', secretManagerClient);
  const subscriberContactEncryptionKey = await getMemoizedSecret('subscriberContactEncryptionKey', secretManagerClient);

  const gmail = await getMemoizedSecret('gmail', secretManagerClient);
  const jwt = await getJwtClient(subscriberPrivateKey, subscriberPrivateKeyClientEmail, gmail);
  return new ContactsManager(
    Axios.create(),
    jwt, subscriberResourceName,
    subscriberContactEncryptionKey,
  );
}

export const createMemoizedContactsManager = mem(createContactsManager, { maxAge: 6.048e+8 });
