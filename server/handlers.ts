import { BadRequest, NotFound } from 'http-errors';
import { Request, Response } from 'express';
import { v1beta1 } from '@google-cloud/secret-manager';
import { validate } from './recaptcha/validate';
import { googleContactFromFormData, createContactsManager, emailsFromContact } from './contacts/manager';
import { createContactsCrypto } from './contacts/crypto';
import {
  mail, signupConfirmation, getMailer, requestForApproval,
} from './mailer/email';
import { secretsManager } from './gcloud/secrets';
import { oAuthClient, oAuthClientWithCredentials } from './gcloud/auth';

function getIPAddress(request: Request): string {
  return request.headers['x-forwarded-for'] as string
    || request.connection.remoteAddress
    || '';
}

function getCaptchaToken(request: Request): string {
  if (request.body.captchaToken != null) {
    return request.body.captchaToken;
  }
  throw new BadRequest();
}

function getRequestForApprovalLink(encryptedContact: string): string {
  return `https://www.ipabos.com/approveContact?state=${encryptedContact}`;
}

async function redirectToGoogleAuth(request: Request, response: Response): Promise<void> {
  const { query: { state } } = request;
  if (!state) {
    throw new BadRequest();
  }
  request.session.encodedContactRequest = state;
  const url = (await oAuthClient()).generateAuthUrl({
    scope: [
      'https://www.googleapis.com/auth/contacts',
    ],
  });
  request.session.save((err) => {
    if (err) {
      throw err;
    }
    response.redirect(url);
  });
}

export async function newContact(
  request: Request,
  response: Response,
): Promise<void> {
  const sm = secretsManager();
  if (!await validate(getCaptchaToken(request), getIPAddress(request), sm)) {
    throw new BadRequest();
  }
  const contact = googleContactFromFormData(request.body);
  const contactCrypto = await createContactsCrypto(sm);
  const encryptedContact = await contactCrypto.encryptContact(contact);

  if (encryptedContact != null) {
    const mailer = await getMailer(sm);
    await mail(requestForApproval(contact, getRequestForApprovalLink(encryptedContact)), mailer);
  }

  response.json(null);
}

export async function approveContact(
  request: Request,
  response: Response,
): Promise<void> {
  const { query: { code }, session: { encodedContactRequest } } = request;

  if (!code) {
    redirectToGoogleAuth(request, response);
    return;
  }

  if (!encodedContactRequest) {
    throw new BadRequest();
  }

  const sm = secretsManager();
  const contactCrypto = await createContactsCrypto(sm);
  const contact = contactCrypto.decryptContact(encodedContactRequest);

  const contactManager = await createContactsManager(await oAuthClientWithCredentials(code));
  const contactId = await contactManager.post(contact);

  await contactManager.enlist(contactId);
  const mailer = await getMailer(sm);
  emailsFromContact(contact).forEach((email) => mail(signupConfirmation(email), mailer));

  response.json({ message: `Contact ${contactId ?? 'was'} created.` });
}

export async function withHttpErrors(
  fn: (Request, Response) => Promise<void>,
  request: Request,
  response: Response,
): Promise<void> {
  try {
    await fn(request, response);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    switch (error.constructor) {
      case BadRequest:
        response.status(400).send('BadRequest');
        break;
      case NotFound:
        response.status(404).send('NotFound');
        break;
      default:
        response.status(500).send('InternalServerError');
        break;
    }
  }
}
