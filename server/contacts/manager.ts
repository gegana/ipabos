/* eslint-disable @typescript-eslint/no-explicit-any */
import Axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';
import moment from 'moment';
import { v1beta1 } from '@google-cloud/secret-manager';
import { google } from 'googleapis';
import { UserEntryForm } from '../types/forms';
import { getMemoizedSecret } from '../gcloud/secrets';

export type GoogleContactDate = {
  year: number;
  month: number;
  day: number;
}


export type GoogleContactOrganization = {
  name: string; title: string; type: 'work' | 'school'; startDate?: GoogleContactDate;
};

export type GoogleContact = {
  names: Array<{givenName: string; familyName: string}>;
  emailAddresses: Array<{value: string; type: string}>;
  phoneNumbers: Array<{value: string; type: string}>;
  organizations: Array<GoogleContactOrganization>;
  occupations: Array<{value: string}>;
  urls: Array<{value: string; type: string}>;
  userDefined: Array<{key: string; value: string }>;
};

export interface JwtClient {
  credentials: {
    access_token?: string | null;
  };
}

export function emailsFromContact(contact: GoogleContact): Array<string> {
  return contact.emailAddresses.map((e) => e.value);
}

export function* parseWorkOrganizations(
  formData: UserEntryForm,
): Generator<GoogleContactOrganization, any, undefined> {
  const companies = Object.keys(formData).filter((k) => k.startsWith('company'));
  for (let i = 0; i < companies.length; i += 1) {
    const affix = i > 0 ? `${i}` : '';
    const name = formData[`company${affix}`];
    const title = formData[`position${affix}`];
    const positionStartDate = formData.positionstartdate;
    const organization: GoogleContactOrganization = {
      name,
      title,
      type: 'work',
    };
    if (positionStartDate != null) {
      const d = moment.utc(positionStartDate);
      organization.startDate = {
        year: d.year(),
        month: d.month(),
        day: d.day(),
      };
    }
    yield organization;
  }
}

export function* parseSchoolOrganizations(
  formData: UserEntryForm,
): Generator<GoogleContactOrganization, any, undefined> {
  const degrees = Object.keys(formData).filter((k) => k.startsWith('degree'));
  for (let i = 0; i < degrees.length; i += 1) {
    const affix = i > 0 ? `${i}` : '';
    const name = formData[`school${affix}`];
    const title = formData[`degree${affix}`];
    const schoolyear = formData[`schoolyear${affix}`];
    const d = moment.utc(schoolyear);
    const organization: GoogleContactOrganization = {
      name,
      title,
      type: 'school',
      startDate: {
        year: d.year(),
        month: d.month(),
        day: d.day(),
      },
    };
    yield organization;
  }
}

export function* parseOccupations(
  workOrganizations: Array<GoogleContactOrganization>,
): Generator<{ value: string }, any, undefined> {
  for (let i = 0; i < workOrganizations.length; i += 1) {
    const organization = workOrganizations[i];
    yield {
      value: organization.title,
    };
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function googleContactFromFormData(formData: UserEntryForm): GoogleContact {
  const workOrganizations = Array.from(parseWorkOrganizations(formData));
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
    organizations: workOrganizations.concat(...Array.from(parseSchoolOrganizations(formData))),
    occupations: Array.from(parseOccupations(workOrganizations)),
    urls: [
      {
        value: formData.linkedIn,
        type: 'work',
      },
    ],
    userDefined: formData.whatsapp === true ? [{ key: 'includeInWAGroup', value: 'true' }] : [],
  };
}

export class ContactsManager {
  private axios: AxiosInstance;

  private jwt: JwtClient;

  private contactGroupName: string;

  constructor(
    axios: AxiosInstance,
    jwt: JwtClient,
    contactGroupName: string,
  ) {
    this.axios = axios;
    this.jwt = jwt;
    this.contactGroupName = contactGroupName;
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

  const gmail = await getMemoizedSecret('gmail', secretManagerClient);
  const jwt = await getJwtClient(subscriberPrivateKey, subscriberPrivateKeyClientEmail, gmail);
  return new ContactsManager(
    Axios.create(),
    jwt, subscriberResourceName,
  );
}
