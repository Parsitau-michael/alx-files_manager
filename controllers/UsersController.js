const crypto = require('crypto');
const dbClient = require('../utils/db');

class UsersController {
  static async postNew(request, response) {
    const { email, password } = request.body;

    if (!email) {
      return response.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return response.status(400).json({ error: 'Missing password' });
    }

    const collection = await dbClient.db.collection('users');

    try {
      // Check if email already exists in db
      const emailExists = await collection.findOne({ email });
      if (emailExists) {
        return response.status(400).json({ error: 'Already exist' });
      }
      const sha1Pw = crypto.createHash('sha1').update(password).digest('hex');

      const result = await collection.insertOne({
        email,
        password: sha1Pw,
      });

      return response.status(201).json({
        id: result.insertedId,
        email,
      });
    } catch (err) {
      return response.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = UsersController;
