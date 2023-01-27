const {
    Client,
    TokenUnpauseTransaction,
    Wallet,
    PrivateKey
} = require("@hashgraph/sdk");
require('dotenv').config();

const tokenId = process.env.TOKEN_ID;

const accountId1 = process.env.ACCOUNT_ID_1;
const privateKey1 = PrivateKey.fromString(process.env.PRIVATE_KEY_1);

if (accountId1 == null ||
    privateKey1 == null ||
    tokenId == null) {
    throw new Error("Environment variables tokenId, accountId1 and privateKey2 must be present");
}

// Create our connection to the Hedera network
// The Hedera JS SDK makes this really easy!
const client = Client.forTestnet();

client.setOperator(accountId1, privateKey1);

async function main() {

    //Create the transaction and freeze the unsigned transaction for manual signing
    const transaction = await new TokenUnpauseTransaction()
        .setTokenId(tokenId)
        .freezeWith(client);

    //Sign with the admin private key of the token
    const signTx = await transaction.sign(privateKey1);

    //Submit the transaction to a Hedera network
    const txResponse = await signTx.execute(client);

    //Request the receipt of the transaction
    const receipt = await txResponse.getReceipt(client);

    //Get the transaction consensus status
    const transactionStatus = receipt.status;

    console.log("The transaction consensus status " +transactionStatus.toString());

    process.exit();
}

main();
