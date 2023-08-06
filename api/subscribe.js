const axios = require('axios');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // If it's an OPTIONS request (the preflight request), respond right away
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (!req.body) {
    return res.status(400).json({ message: 'Request body is missing' });
  }

  const { email, name } = req.body;

  if (!email || !name) {
    return res.status(400).json({ message: 'Name and email are required' });
  }

  try {
    const response = await axios.post(
      `https://api.mailerlite.com/api/v2/groups/${process.env.MAILERLITE_GROUP_ID}/subscribers`,
      {
        email: email,
        name: name
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-MailerLite-ApiKey': process.env.MAILERLITE_API_KEY
        }
      }
    );

    return res.status(200).json({ message: 'Subscription successful' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred' });
  }
};

