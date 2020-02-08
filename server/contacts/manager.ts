/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from 'moment';
import { google, people_v1 } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { UserEntryForm } from '../types/forms';
import { getMemoizedSecret, secretsManager } from '../gcloud/secrets';

export interface JwtClient {
  credentials: {
    access_token?: string | null;
  };
}

export function emailsFromContact(contact: people_v1.Schema$Person): Array<string> {
  return contact.emailAddresses.map((e) => e.value);
}

export function parseDate(isoDate: string): people_v1.Schema$Date {
  const d = moment(isoDate).utc();
  return {
    year: parseInt(d.format('YYYY'), 10),
    month: parseInt(d.format('M'), 10),
    day: parseInt(d.format('D'), 10),
  };
}

export function* parseWorkOrganizations(
  formData: UserEntryForm,
): Generator<people_v1.Schema$Organization, any, undefined> {
  const companies = Object.keys(formData).filter((k) => k.startsWith('company'));
  for (let i = 0; i < companies.length; i += 1) {
    const affix = i > 0 ? `${i}` : '';
    const name = formData[`company${affix}`];
    const title = formData[`position${affix}`];
    const positionStartDate = formData.positionstartdate;
    const organization: people_v1.Schema$Organization = { name, title, type: 'work' };
    if (positionStartDate != null) {
      organization.startDate = parseDate(positionStartDate);
    }
    yield organization;
  }
}

export function* parseSchoolOrganizations(
  formData: UserEntryForm,
): Generator<people_v1.Schema$Organization, any, undefined> {
  const degrees = Object.keys(formData).filter((k) => k.startsWith('degree'));
  for (let i = 0; i < degrees.length; i += 1) {
    const affix = i > 0 ? `${i}` : '';
    const name = formData[`school${affix}`];
    const title = formData[`degree${affix}`];
    const schoolyear = formData[`schoolyear${affix}`];
    const organization: people_v1.Schema$Organization = {
      name,
      title,
      type: 'school',
      startDate: parseDate(schoolyear),
    };
    yield organization;
  }
}

export function* parseOccupations(
  workOrganizations: Array<people_v1.Schema$Organization>,
): Generator<{ value: string }, any, undefined> {
  for (let i = 0; i < workOrganizations.length; i += 1) {
    const organization = workOrganizations[i];
    yield {
      value: organization.title,
    };
  }
}

export function googleContactFromFormData(formData: UserEntryForm): people_v1.Schema$Person {
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
    userDefined: formData.whatsapp === true
      ? [{ key: 'includeInWAGroup', value: 'true' }] : [],
  };
}

export class ContactsManager {
  private contactGroupName: string;

  private people: people_v1.People;

  constructor(
    oauth2Client: any,
    contactGroupName: string,
  ) {
    this.contactGroupName = contactGroupName;
    this.people = google.people({ version: 'v1', auth: oauth2Client });
  }

  async post(contact: people_v1.Schema$Person): Promise<string> {
    const {
      data: { resourceName },
    } = await this.people.people.createContact({ requestBody: contact });
    return resourceName;
  }

  async enlist(resourceName: string): Promise<void> {
    const requestBody = {
      resourceNamesToAdd: [
        resourceName,
      ],
    };
    await this.people.contactGroups.members.modify({
      resourceName: `contactGroups/${this.contactGroupName}`,
      requestBody,
    });
  }
}

export async function createContactsManager(
  oauth2Client: OAuth2Client,
): Promise<ContactsManager> {
  const subscriberResourceName = await getMemoizedSecret('subscriberResourceName', secretsManager());

  return new ContactsManager(
    oauth2Client,
    subscriberResourceName,
  );
}
