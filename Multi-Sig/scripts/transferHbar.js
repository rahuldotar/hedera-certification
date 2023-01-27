const {
    Client,
    AccountBalanceQuery,
    TransferTransaction,
    Hbar,
    PrivateKey
} = require("@hashgraph/sdk");
require("dotenv").config();



const accountId1 = process.env.ACCOUNT_ID_1;
const privateKey1 = PrivateKey.fromString(process.env.PRIVATE_KEY_1);

if (accountId1 == null ||
    privateKey1 == null ) {
    throw new Error("Environment variables  accountId1 and privateKey2 must be present");
}

const accountId2 = process.env.ACCOUNT_ID_2;
const privateKey2 = PrivateKey.fromString(process.env.PRIVATE_KEY_2);

if (accountId2 == null ||
    privateKey2 == null ) {
    throw new Error("Environment variables accountId2 and privateKey2 must be present");
}


const accountId3 = process.env.ACCOUNT_ID_3;
const privateKey3 = PrivateKey.fromString(process.env.PRIVATE_KEY_3);

if (accountId3 == null ||
    privateKey3 == null ) {
    throw new Error("Environment variables accountId3 and privateKey3 must be present");
}

// Create our connection to the Hedera network
// The Hedera JS SDK makes this really easy!
const client = Client.forTestnet();

client.setOperator(accountId1, privateKey1);

async function main() {
  

    // Create the transfer transaction
    const transaction = new TransferTransaction()
    .addApprovedHbarTransfer(accountId2, new Hbar(-20))
    .addHbarTransfer(accountId3, new Hbar(20)).freezeWith(client);;
    
    console.log(`Doing transfer from ${accountId2} to ${accountId3}`);
    
     //Sign the transaction with the owner account key
     const signTx = await transaction.sign(privateKey2);

    // Sign with the client operator key and submit the transaction to a Hedera network
    const txId = await signTx.execute(client);

    // console.log(JSON.stringify(txId));

    // Request the receipt of the transaction
    const receipt = await txId.getReceipt(client);

    // console.log(JSON.stringify(receipt));

    // Get the transaction consensus status
    const transactionStatus = receipt.status;

    console.log("The transaction consensus status is " + transactionStatus);

   
}

main();
