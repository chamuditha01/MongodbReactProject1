const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = 5000;

// Middleware for handling CORS
app.use(cors());

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });

// MongoDB connection URI
const uri = 'mongodb+srv://user1:Chamu123@cluster0.alycqcg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const dbName = 'db1'; // Replace 'your_database_name' with your actual database name

// Function to get MongoDB database instance
async function getDb() {
  const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  return client.db(dbName);
}

// Endpoint to insert a new person
app.post('/insertPerson', upload.single('image'), async (req, res) => {
  try {
    const db = await getDb();
    const { name, age } = req.body;
    const imageBuffer = req.file.buffer; // File buffer

    // Insert the new document into the MongoDB collection
    await db.collection('collection1').insertOne({ name, age, image: imageBuffer });

    res.status(201).json({ success: true, message: 'Person inserted successfully' });
  } catch (err) {
    console.error('Error inserting person into MongoDB:', err);
    res.status(500).json({ success: false, error: 'Failed to insert person into MongoDB' });
  }
});

app.get('/getPersons', async (req, res) => {
  try {
    const db = await getDb();
    const persons = await db.collection('collection1').find({}).toArray();
    res.status(200).json(persons);
  } catch (err) {
    console.error('Error fetching persons from MongoDB:', err);
    res.status(500).json({ error: 'Failed to fetch persons from MongoDB' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
