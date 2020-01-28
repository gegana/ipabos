import { BadRequest, NotFound } from 'http-errors';
import { Request, Response } from 'express';
import { v1beta1 } from '@google-cloud/secret-manager';
import { validate } from './recaptcha/validate';
import { googleContactFromFormData, createMemoizedContactsManager, emailsFromContact } from './contacts/manager';
import {
  mail, signupConfirmation, getMailer, requestForApproval,
} from './mailer/email';

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
  return `https://www.ipabos.com/approveContact/${encryptedContact}`;
}

export async function newContact(
  request: Request,
  response: Response,
  secretManagerClient: v1beta1.SecretManagerServiceClient,
): Promise<void> {
  if (!await validate(
    getCaptchaToken(request),
    getIPAddress(request), secretManagerClient,
  )) {
    throw new BadRequest();
  }
  const contact = googleContactFromFormData(request.body);
  const contactManager = await createMemoizedContactsManager(secretManagerClient);
  const encryptedContact = await contactManager.requestForApproval(contact);

  if (encryptedContact != null) {
    const mailer = await getMailer(secretManagerClient);
    await mail(requestForApproval(contact, getRequestForApprovalLink(encryptedContact)), mailer);
  }

  response.json(null);
}

export async function approveContact(
  request: Request,
  response: Response,
  secretManagerClient: v1beta1.SecretManagerServiceClient,
): Promise<void> {
  if (!request.params.encryptedContact) {
    throw new BadRequest();
  }
  const contactManager = await createMemoizedContactsManager(secretManagerClient);
  const contact = contactManager.decryptContact(request.params.encryptedContact);
  const contactId = await contactManager.post(
    contact,
  );
  response.json({ message: `Contact ${contactId} created.` });
  try {
    if (contactId != null) {
      await contactManager.enlist(contactId);
      const mailer = await getMailer(secretManagerClient);
      emailsFromContact(contact).forEach((email) => mail(signupConfirmation(email), mailer));
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

export async function withHttpErrors(
  fn: (Request, Response, secretManagerClient: v1beta1.SecretManagerServiceClient) => Promise<void>,
  request: Request,
  response: Response,
  secretManagerClient: v1beta1.SecretManagerServiceClient,
): Promise<void> {
  try {
    await fn(request, response, secretManagerClient);
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
