import express from 'express';
import { Datastore } from '@google-cloud/datastore';
import datastoreConnect from '@google-cloud/connect-datastore';
import session from 'express-session';
import bodyParser from 'body-parser';
import path from 'path';
import { newContact, approveContact } from './handlers';

const port = process.env.PORT || 8080;
const DatastoreStore = datastoreConnect(session);

const app = express();
app.use(express.static(path.join(__dirname, '../build')));
app.use(bodyParser.json());
app.use(session({
  secret: 'session',
  saveUninitialized: false,
  resave: false,
  cookie: { maxAge: 60000 },
  store: new DatastoreStore({
    kind: 'express-sessions',
    dataset: new Datastore(),
  }),
}));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});


app.post('/contacts', newContact);
app.get('/approveContact', approveContact);
app.listen(port);
