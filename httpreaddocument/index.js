// httpreaddocument.js

const { MongoClient, ObjectId } = require('mongodb');

module.exports = async function (context, req) {
    context.log('HTTPReadDocument function processed a request.');

    let documentId;

    // Check if 'id' is directly in the query or inside a JSON object
    if (req.query.id) {
        documentId = req.query.id;
    } else if (req.body && req.body.id) {
        documentId = req.body.id;
    } else {
        context.res = {
            status: 400,
            body: {
                message: 'Missing document id in the request.'
            }
        };
        return;
    }

    context.log('Request Query:', documentId); // Log the processed documentId

    const connectionString = "mongodb://cst8917cosmodbaccount.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb";
    const dbName = "cst8917lab2db";
    const collectionName = "cst8917lab2colid";

    try {
        // Connect to MongoDB
        context.log('Connecting to MongoDB...');
        const client = new MongoClient(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            auth: {
                username: "cst8917cosmodbaccount",
                password: "pass=="
            }
        });
        await client.connect();
        context.log('Connected to MongoDB.');

        const database = client.db(dbName);
        const collection = database.collection(collectionName);

        // Find document in MongoDB using ObjectId
        context.log('Finding document in MongoDB...');
        const document = await collection.findOne({ _id: new ObjectId(documentId) });
        if (!document) {
            context.log('Document not found in MongoDB.');
            context.res = {
                status: 404,
                body: {
                    message: 'Your document was not found.'
                }
            };
            return;
        }
        context.log('Document found in MongoDB:', document);

        // TODO: Process the retrieved document as needed

        // Close the MongoDB connection
        await client.close();

        // Return the document in the response
        context.res = {
            status: 200,
            body: {
                document
            }
        };
    } catch (error) {
        context.log.error('Error occurred:', error);
        context.res = {
            status: 500,
            body: {
                message: 'An error occurred while processing the request.'
            }
        };
    }
};
