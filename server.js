const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');
const { google } = require('googleapis');
const nodemailer = require('nodemailer');
const app = express();

const privateKeyClientEmail = process.env.PRIVATE_KEY_CLIENT_EMAIL;
const privateKey = process.env.PRIVATE_KEY;
const gmail = 'hello@ipabos.com'
const pass = process.env.GMAIL_PASS;
const port = process.env.PORT || 9000;

/**
 * Create jwt client for googleapis
 */
const jwtClient = new google.auth.JWT(
  privateKeyClientEmail,
  null,
  privateKey,
  [
    'https://www.googleapis.com/auth/contacts'
  ],
  gmail
);

/**
 * Email sender using gmail
 */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmail,
    pass: pass
  }
});

// Authorize jwt client for googleapis
jwtClient.authorize(function (err, tokens) {
  if (err) {
    console.log(err);
    process.exit(1);
  }
});

app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.json());

/**
 * Serve static ReactApp
 */
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

/**
 * Construct a google contact from form data
 * @param formData the form data retrieved from the request as json
 */
function getGoogleContact(formData) {
  return {
    names: [
      {
        givenName: formData.firstName,
        familyName: formData.lastName
      }
    ],
    emailAddresses: [
      {
        value: formData.email,
        type: "work"
      }
    ],
    phoneNumbers: [
      {
        value: `+${formData.countryPrefix}${formData.phone}`,
        type: "work"
      }
    ],
    organizations: [
      {
        name: formData.company,
        title: formData.profession,
        type: "work"
      }
    ],
    occupations: [
      {
        value: formData.profession
      }
    ],
    urls: [
      {
        value: formData.linkedin,
        type: "work"
      }
    ]
  };
}

/**
 * Get the current contact emails to avoid creating duplicates.
 */
async function getCurrentContactsEmails() {
  const response = await axios.get("https://people.googleapis.com/v1/people/me/connections?personFields=emailAddresses", {
    headers: {
      Authorization: `Bearer ${jwtClient.credentials.access_token}`
    }
  });

  if (response.status !== 200 || !response.data || !response.data.connections) {
    throw new Error("Unable to retrieve current email contacts.");
  }
  const emails = {};

  for (let i = 0; i < response.data.connections.length; i++) {
    const connection = response.data.connections[i];
    for (let z = 0; z < connection.emailAddresses; z++) {
      const email = connection.emailAddresses[z];
      emails[email] = 1;
    }
  }

  return emails;
}

const subscribersGroup = process.env.SUBSCRIBERS_RESOURCE_NAME;

/**
 * POST /contacts 
 * Creates new Google contact
 */
app.post('/contacts', async (req, res) => {
  try {
    // Get current contacts
    const currentSubscribers = await getCurrentContactsEmails();
    // Prevent duplicate contact creation
    if (currentSubscribers[req.body.email]) {
      console.log(`Ignoring request with duplicate email ${req.body.email}.`);
      res.json();
      return;
    }

    // Verify recaptcha
    if (!req.body.captchaToken) {
      res.status(400).send({ message: "Missing captcha token." });
      return;
    }
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const recaptchaResponse = await recaptcha(req.body.captchaToken, ip);

    if (!recaptchaResponse) {
      res.status(400).send({ message: "Recaptcha validation failed." });
      return;
    }

    const data = getGoogleContact(req.body);
    const createContactResponse = await axios.post("https://people.googleapis.com/v1/people:createContact", data, {
      headers: {
        Authorization: `Bearer ${jwtClient.credentials.access_token}`
      }
    });

    if (createContactResponse.status !== 200) {
      throw new Error("Unable to create contact");
    }

    // Return valid response to the user
    res.json();

    // These operations are not vital hence done outside of scope of returning response
    try {
      const members = {
        resourceNamesToAdd: [
          createContactResponse.data.resourceName
        ]
      };
  
      // Add new contact to subscribers group
      const group = await axios.post(`https://people.googleapis.com/v1/contactGroups/${subscribersGroup}/members:modify`, members, {
        headers: {
          Authorization: `Bearer ${jwtClient.credentials.access_token}`
        }
      });
  
      if (group) {
        console.log(`User ${req.body.email} added to subscribers group.`);
      }
  
      const message = {
        from: 'hello@ipabos.com',
        to: req.body.email,
        subject: 'Welcome to the Indonesian Professional Association in Boston',
        text: 'Please mark this message as not junk so that you may receive future newsletters and calendar invites in your Inbox.'
      };
  
      transporter.sendMail(message, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    let status = error.status || 500;
    console.log(error);
    res.status(status).send({ message: "We are unable to process your request." });
  }
});

// Secret key used for recaptcha validation
const recaptchaSecretKey = process.env.RECAPTCHA_SECRET;

/**
 * Verify recaptcha token with secret
 * @param {*} recaptchaResponse 
 * @param {*} remoteAddress 
 */
async function recaptcha(recaptchaResponse, remoteAddress) {
  const res = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecretKey}&response=${recaptchaResponse}&remoteip=${remoteAddress}`);
  if (res.status !== 200 || !res.data.success) {
    throw new Error("Recaptcha failed");
  }
  return true; 
}

app.listen(port);