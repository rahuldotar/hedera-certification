const { 
    Client,
    Wallet,
    TokenCreateTransaction,
    PrivateKey,
    TokenType,
    TokenSupplyType,
    TokenInfoQuery,
    AccountBalanceQuery
} = require("@hashgraph/sdk");
require("dotenv").config();


const accountId1 = process.env.ACCOUNT_ID_1;
const privateKey1 = PrivateKey.fromString(process.env.PRIVATE_KEY_1);

if (accountId1 == null ||
    privateKey1 == null ) {
    throw new Error("Environment variables accountId1 and privateKey1 must be present");
}

const accountId2 = process.env.ACCOUNT_ID_2;
const privateKey2 = PrivateKey.fromString(process.env.PRIVATE_KEY_2);

if (accountId2 == null ||
    privateKey2 == null ) {
    throw new Error("Environment variables accountId2 and privateKey2 must be present");
}

const adminUser = new Wallet(
    accountId1,
    privateKey1
)

const supplyUser = new Wallet(
    accountId2,
    privateKey2
)

// Create our connection to the Hedera network
// The Hedera JS SDK makes this really easy!
const client = Client.forTestnet();

client.setOperator(accountId1, privateKey1);

async function main(){

    
    //Create the transaction and freeze for manual signing
    const transaction = await new TokenCreateTransaction()
        .setTokenName("Awesome Game Token")
        .setTokenSymbol("AGT")
        .setTokenType(TokenType.FungibleCommon)
        .setTreasuryAccountId(accountId1)
        .setInitialSupply(35050)
        .setMaxSupply(50000)
        .setSupplyType(TokenSupplyType.Finite)
        .setPauseKey(adminUser.publicKey)
        .setDecimals(2)
        .setAdminKey(adminUser.publicKey)
        .setSupplyKey(supplyUser.publicKey)
        .freezeWith(client);

    //Sign the transaction with the client, who is set as admin and treasury account
    const signTx =  await transaction.sign(privateKey1);

    //Submit to a Hedera network
    const txResponse = await signTx.execute(client);

    //Get the receipt of the transaction
    const receipt = await txResponse.getReceipt(client);

    //Get the token ID from the receipt
    const tokenId = receipt.tokenId;

    console.log("The new token ID is " + tokenId);

    const name = await queryTokenFunction("name", tokenId);
    const symbol = await queryTokenFunction("symbol", tokenId);
    const tokenSupply = await queryTokenFunction("totalSupply", tokenId);
    const maxSupply = await queryTokenFunction("maxSupply", tokenId);
    console.log('The total supply of the ' + name + ' token is ' + tokenSupply + ' of ' + symbol + ' and Max supply is '+maxSupply);

    //Create the query
    const balanceQuery = new AccountBalanceQuery()
        .setAccountId(adminUser.accountId);

    //Sign with the client operator private key and submit to a Hedera network
    const tokenBalance = await balanceQuery.execute(client);

    console.log("The balance of the user is: " + tokenBalance.tokens.get(tokenId));

    process.exit();
}

async function queryTokenFunction(functionName, tokenId) {
    //Create the query
    const query = new TokenInfoQuery()
        .setTokenId(tokenId);

    console.log("retrieveing the " + functionName);
    const body = await query.execute(client);

    //Sign with the client operator private key, submit the query to the network and get the token supply
    let result;
    if (functionName === "name") {
        result = body.name;
    } else if(functionName ==="symbol") {
        result = body.symbol;
    } else if(functionName === "totalSupply") {
        result = body.totalSupply;
    } else if(functionName === "maxSupply") {
        result = body.maxSupply;
    } else {
        return;
    }

    return result
}


main();