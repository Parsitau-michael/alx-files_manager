const { MongoClient } = require('mongodb');

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || '27017';
    const database = process.env.DB_DATABASE || 'files_manager';

    const uri = `mongodb://${host}:${port}/${database}`;

    // Create MongoDB Client
    this.client = new MongoClient(uri, { useUnifiedTopology: true });

    // Connect to the database
    this.client.connect()
      .then(() => {
        console.log('MongoDB Connected');
        this.db = this.client.db(database);
      })
      .catch((err) => {
        console.error('Failed to connect to Database:', err.message);
        process.exit(1);
      });
  }

  isAlive() {
    return this.client && this.client.topology && this.client.topology.isConnected();
  }

  async nbUsers() {
    try {
      const usersCollection = this.db.collection('users');
      return await usersCollection.countDocuments();
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async nbFiles() {
    try {
      const filesCollection = this.db.collection('files');
      return await filesCollection.countDocuments();
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
