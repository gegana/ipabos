import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { newContact, withHttpErrors } from './handlers';

const port = process.env.PORT || 8080;
const smsClient = new SecretManagerServiceClient();
const app = express();
app.use(express.static(path.join(__dirname, '../build')));
app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

const withHandler = (
  fn: (Request, Response, SecretManagerServiceClient) => Promise<void>,
): (Request, Response
  ) => Promise<void> => (request: Request, response: Response): Promise<void> => withHttpErrors(
  fn,
  request, response, smsClient,
);

app.post('/contacts', withHandler(newContact));
app.listen(port);
