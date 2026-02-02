const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://ronyroyrox_db_user:Dgreatreset1!@lesociety.lalld11.mongodb.net/lesociety?appName=lesociety';

async function checkUser() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db('lesociety');

        // Find all users
        const users = await db.collection('users').find({}).toArray();

        console.log('=== All users in database ===');
        users.forEach(user => {
            console.log(`Email: ${user.email}, Status: ${user.status}, Name: ${user.name || 'N/A'}`);
        });

        // Check specific user
        const user = await db.collection('users').findOne({ email: 'manman@yopmail.com' });
        console.log('\n=== Searching for manman@yopmail.com ===');
        console.log('Found:', user ? 'YES' : 'NO');
        if (user) {
            console.log('User data:', JSON.stringify(user, null, 2));
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
    }
}

checkUser();
