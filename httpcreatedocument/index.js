const { MongoClient } = require('mongodb');

module.exports = async function (context, req) {
    context.log('HTTPCreateDocument function processed a request.');

    const { body } = req;
    const connectionString = "mongodb://cst8917cosmodbaccount.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false";
    const dbName = "cst8917lab2db";
    const collectionName = "cst8917lab2colid";

    try {
        const client = new MongoClient(connectionString, { useNewUrlParser: true, useUnifiedTopology: true, auth: { username: "cst8917cosmodbaccount", password: "bRPhjapcxH7q1zzQAW4aX0aMbofMBVzM9YbzsoAi2RWhI9HcBVeZtkT1Am4O5iTGHaB2jKtq9lfLACDbaYUrgg==" } });
        await client.connect();

        const database = client.db(dbName);
        const collection = database.collection(collectionName);

        const result = await collection.insertOne(body);
        client.close();

        context.res = {
            body: {
                id: result.insertedId.toString(),
                message: 'Document created successfully.'
            },
        };
    } catch (error) {
        context.res = {
            status: 500,
            body: {
                message: 'Error creating document.',
                error: error.message
            }
        };
    }
};
