const { MongoClient } = require('mongodb');

async function checkDb() {
    const uri = 'mongodb+srv://Malith_Induwara:malith123@event.puotuo9.mongodb.net/smartCampusDB?retryWrites=true&w=majority';
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db('smartCampusDB');
        const tickets = await db.collection('tickets').find({}).toArray();
        console.log('Tickets:', JSON.stringify(tickets, null, 2));
        
        const users = await db.collection('users').find({}).toArray();
        console.log('Users:', JSON.stringify(users, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}
checkDb();
