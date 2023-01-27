const {
    PrivateKey,
    TopicMessageSubmitTransaction,
    Client
} = require("@hashgraph/sdk");
require('dotenv').config();


const topicId = process.env.TOPIC_ID;
const accountId1 = process.env.ACCOUNT_ID_1;
const privateKey1 = PrivateKey.fromString(process.env.PRIVATE_KEY_1);

if (accountId1 == null ||
    privateKey1 == null ||
    topicId == null) {
    throw new Error("Environment variables topicId, accountId1 and privateKey2 must be present");
}

// Create our connection to the Hedera network
// The Hedera JS SDK makes this really easy!
const client = Client.forTestnet();

client.setOperator(accountId1, privateKey1);

async function main() {
    // Send one message
    let sendResponse = await new TopicMessageSubmitTransaction({
        topicId: topicId,
        message: "Current timestamp is " + Date.now(),
    }).execute(client);

    //Get the receipt of the transaction
    const getReceipt = await sendResponse.getReceipt(client);

    //Get the status of the transaction
    const transactionStatus = getReceipt.status;
    console.log("The message transaction status: " + transactionStatus);

    process.exit();
}

main();
