const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

// MongoDB connection
const uri = 'mongodb+srv://ronyroyrox_db_user:Dgreatreset1!@lesociety.lalld11.mongodb.net/lesociety?appName=lesociety';
const dbName = 'lesociety';

// BSON data directory
const bsonDir = '/home/benzom/Downloads/v2/database/lesociety';

// Collections to restore
const collections = [
    'users',
    'categories',
    'aspirations',
    'dates',
    'chats',
    'chatrooms',
    'notifications',
    'countries',
    'defaultmessages',
    'influencers',
    'promotions'
];

async function restoreDatabase() {
    const client = new MongoClient(uri);

    try {
        console.log('Connecting to MongoDB...');
        await client.connect();
        console.log('Connected!');

        const db = client.db(dbName);

        for (const collection of collections) {
            const bsonFile = path.join(bsonDir, `${collection}.bson`);
            const metadataFile = path.join(bsonDir, `${collection}.metadata.json`);

            if (!fs.existsSync(bsonFile)) {
                console.log(`Skipping ${collection} - BSON file not found`);
                continue;
            }

            console.log(`\nRestoring ${collection}...`);

            // Read metadata if exists
            let metadata = {};
            if (fs.existsSync(metadataFile)) {
                const metadataContent = fs.readFileSync(metadataFile, 'utf8');
                metadata = JSON.parse(metadataContent);
            }

            // Read BSON file
            const bsonData = fs.readFileSync(bsonFile);

            // Parse BSON data
            const { BSON } = require('bson');
            const documents = [];

            // Deserialize BSON
            let offset = 0;
            while (offset < bsonData.length) {
                try {
                    // Read document size
                    const size = bsonData.readUInt32LE(offset);

                    // Extract single BSON document
                    const docBuffer = bsonData.slice(offset, offset + size);

                    // Deserialize
                    const doc = BSON.deserialize(docBuffer);
                    documents.push(doc);

                    offset += size;
                } catch (e) {
                    console.error(`Error parsing document at offset ${offset}:`, e.message);
                    break;
                }
            }

            console.log(`Found ${documents.length} documents for ${collection}`);

            if (documents.length > 0) {
                // Drop existing collection
                try {
                    await db.collection(collection).drop();
                    console.log(`Dropped existing ${collection} collection`);
                } catch (e) {
                    console.log(`Collection ${collection} didn't exist or couldn't be dropped`);
                }

                // Insert documents
                const result = await db.collection(collection).insertMany(documents);
                console.log(`Inserted ${result.insertedCount} documents into ${collection}`);
            }
        }

        console.log('\n=== Database restore complete! ===');

        // Check for user
        const user = await db.collection('users').findOne({ email: 'manman@yopmail.com' });
        if (user) {
            console.log('\n✓ Found user manman@yopmail.com');
            console.log('User status:', user.status);
        } else {
            console.log('\n✗ User manman@yopmail.com not found');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
    }
}

restoreDatabase();
