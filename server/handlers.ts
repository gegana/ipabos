import { BadRequest, NotFound } from 'http-errors';
import { Request, Response } from 'express';
import { v1beta1 } from '@google-cloud/secret-manager';
import { validate } from './recaptcha/validate';
import { googleContactFromFormData, createMemoizedContactsManager } from './contacts/manager';
import { mail, signupConfirmation, getMailer } from './mailer/email';

function getIPAddress(request: Request): string {
  return request.headers['x-forwarded-for'] as string
    || request.connection.remoteAddress
    || '';
}

function getRecipientEmail(request: Request): string | null {
  return request.body.email;
}

function getCaptchaToken(request: Request): string {
  if (request.body.captchaToken != null) {
    return request.body.captchaToken;
  }
  throw new BadRequest();
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
  const contactManager = await createMemoizedContactsManager(secretManagerClient);
  const contactId = await contactManager.post(googleContactFromFormData(request.body));
  response.json(null);
  try {
    if (contactId != null) {
      await contactManager.enlist(contactId);
      const recipientEmail = getRecipientEmail(request);
      const mailer = await getMailer(secretManagerClient);
      if (recipientEmail && mailer) {
        await mail(signupConfirmation(recipientEmail), mailer);
      }
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
