const { 
    Client,
    Wallet,
    TransferTransaction,
    PrivateKey,
    AccountBalanceQuery
} = require("@hashgraph/sdk");
require("dotenv").config();

const tokenId = process.env.TOKEN_ID;

const accountId1 = process.env.ACCOUNT_ID_1;
const privateKey1 = PrivateKey.fromString(process.env.PRIVATE_KEY_1);

if (accountId1 == null ||
    privateKey1 == null ||
    tokenId == null) {
    throw new Error("Environment variables tokenId, accountId1 and privateKey2 must be present");
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


const accountId4 = process.env.ACCOUNT_ID_4;
const privateKey4 = PrivateKey.fromString(process.env.PRIVATE_KEY_4);

if (accountId4 == null ||
    privateKey4 == null ) {
    throw new Error("Environment variables accountId4 and privateKey4 must be present");
}

const supplyUser = new Wallet(
    accountId2,
    privateKey2
)

// Create our connection to the Hedera network
// The Hedera JS SDK makes this really easy!
const client = Client.forTestnet();

client.setOperator(accountId1, privateKey1);

async function main()
{
    await tokenTransfer(tokenId, accountId3);
    const walletBalance3 = await queryBalance(accountId3);
    console.log("The balance of the user is: " + walletBalance3.tokens.get(tokenId));

    await tokenTransfer(tokenId, accountId4);
    const walletBalance4 = await queryBalance(accountId4);
    console.log("The balance of the user is: " + walletBalance4.tokens.get(tokenId));

    process.exit()
}

const tokenTransfer = async (tokenId, accountId) => {

    //Create the transfer transaction
    const transaction = await new TransferTransaction()
        .addTokenTransfer(tokenId, accountId1, -2525)
        .addTokenTransfer(tokenId, accountId, 2525)
        .freezeWith(client);

    //Sign with the sender account private key
    const signTx =  await transaction.sign(privateKey1);

    //Sign with the client operator private key and submit to a Hedera network
    const txResponse = await signTx.execute(client);

    //Request the receipt of the transaction
    const receipt = await txResponse.getReceipt(client);

    //Obtain the transaction consensus status
    const transactionStatus = receipt.status;

    console.log("The transaction consensus status " +transactionStatus.toString());
}

const queryBalance = async (accountId) => {
    //Create the query
    const balanceQuery = new AccountBalanceQuery()
        .setAccountId(accountId);

    //Sign with the client operator private key and submit to a Hedera network
    const tokenBalance = await balanceQuery.execute(client);

    return tokenBalance;
}

main();