/* eslint-disable @typescript-eslint/camelcase */
import { v1beta1 } from '@google-cloud/secret-manager';
import Mail from 'nodemailer/lib/mailer';
import nodemailer from 'nodemailer';
import mem from 'mem';
import { people_v1 } from 'googleapis';
import { getMemoizedSecret } from '../gcloud/secrets';


export interface EmailMessage {
  from: string;
  to: string;
  subject: string;
  text: string;
}

export function requestForApproval(
  contact: people_v1.Schema$Person,
  approveLink: string,
): EmailMessage {
  return {
    from: 'hello@ipabos.com',
    to: 'hello@ipabos.com',
    subject: 'New request for approval',
    text: `${approveLink}:\n${JSON.stringify(contact, null, 2)}`,
  };
}

export function signupConfirmation(recipientEmail: string): EmailMessage {
  return {
    from: 'hello@ipabos.com',
    to: recipientEmail,
    subject: 'Welcome to the Indonesian Professionals Association in Boston',
    text: 'Please mark this message as not junk so that you may receive future newsletters and calendar invites in your Inbox.',
  };
}

export async function mail(message: EmailMessage, mailer: Mail): Promise<void> {
  return new Promise((resolve, reject) => mailer.sendMail(message, (err: Error) => {
    if (err) {
      reject(err);
    } else {
      resolve();
    }
  }));
}

export async function getMailer(
  secretManagerClient: v1beta1.SecretManagerServiceClient,
): Promise<Mail> {
  const gmail = await getMemoizedSecret('gmail', secretManagerClient);
  const gmailSecret = await getMemoizedSecret('gmailSecret', secretManagerClient);
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmail,
      pass: gmailSecret,
    },
  });
}

export const getMemoizedMailer = mem(getMailer, { maxAge: 6.048e+8 });
