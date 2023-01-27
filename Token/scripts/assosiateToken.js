const { 
    Client,
    TokenAssociateTransaction,
    PrivateKey
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


// Create our connection to the Hedera network
// The Hedera JS SDK makes this really easy!
const client = Client.forTestnet();

client.setOperator(accountId1, privateKey1);

async function main(){

    //assosiating a token with the account 3 & 4 before transfer
    await assosiateAccountWithToken(tokenId, accountId3, privateKey3)
    await assosiateAccountWithToken(tokenId, accountId4, privateKey4)

    process.exit();
}

const assosiateAccountWithToken = async (tokenId, accountId, accountPrivateKey) => {
    //  Before an account that is not the treasury for a token can receive or send this specific token ID, the account
    //  must become “associated” with the token.
    let associateOtherWalletTx = await new TokenAssociateTransaction()
        .setAccountId(accountId)
        .setTokenIds([tokenId])
        .freezeWith(client)
        .sign(accountPrivateKey)

    //SUBMIT THE TRANSACTION
    let associateOtherWalletTxSubmit = await associateOtherWalletTx.execute(client);

    //GET THE RECEIPT OF THE TRANSACTION
    let associateOtherWalletRx = await associateOtherWalletTxSubmit.getReceipt(client);

    //LOG THE TRANSACTION STATUS
    console.log(`- Token association with the users account: ${accountId} - ${associateOtherWalletRx.status} \n`);
}

main();