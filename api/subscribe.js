const axios = require('axios');

module.exports = async (req, res) => {
  let body = '';

  // Middleware to parse JSON
  req.on('data', chunk => {
    body += chunk.toString(); // convert Buffer to string
  });

  req.on('end', async () => {
    try {
      req.body = JSON.parse(body);
    } catch (err) {
      console.error('Error parsing JSON', err);
      return res.status(400).json({ message: 'Bad request' });
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
  });
};

