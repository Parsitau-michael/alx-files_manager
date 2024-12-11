const crypto = require('crypto');
const dbClient = require('../utils/db');

class UsersController {
  static async postNew(req, res) {
    const userEmail = req.body.email;
    const userPassword = req.body.password;

    if (!userEmail) {
      return res.status(400).json({ error: 'Missing email' });
    }
    if (!userPassword) {
      return res.status(400).json({ error: 'Missing password' });
    }

    const collection = await dbClient.dbName.collection("users");

    try {
      // Check if email already exists in db
      const emailExists = await collection.findOne({ email: userEmail });
      if (emailExists) {
        return res.status(400).json({ error: 'Already exist' });
      }
      const sha1Pw = crypto.createHash('sha1').update(userPassword).digest('hex');

      const result = await collection.insertOne({
        email: userEmail,
        password: sha1Pw
      });

      res.status(201).json({
        "id": result.insertedId,
	"email": userEmail
      });
    } catch(err) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = UsersController;
