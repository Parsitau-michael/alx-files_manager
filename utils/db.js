const { MongoClient } = require('mongodb');

class DBClient {
  constructor() {
    this.host = process.env.DB_HOST || 'localhost';
    this.port = process.env.DB_PORT || '27017';
    this.database = process.env.DB_DATABASE || 'files_manager';

    const uri = `mongodb://${this.host}:${this.port}/${this.database}`;
    this.client = new MongoClient(uri, { useUnifiedTopology: true });
  }

  // Initiate Connection
  async connect() {
    try {
      await this.client.connect();
    } catch (err) {
      console.log(err);
    }
  }

  isAlive() {
    return this.client && this.client.topology && this.client.topology.isConnected();
  }

  async nbUsers() {
    if (!this.isAlive) {
      throw new Error('DB not connected!');
    }
    const db = this.client.db(this.database);
    const usersCollection = db.collection('users');
    return usersCollection.countDocuments();
  }

  async nbFiles() {
    if (!this.isAlive) {
      throw new Error('DB not connected!');
    }
    const db = this.client.db(this.database);
    const filesCollection = db.collection('files');
    return filesCollection.countDocuments();
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
