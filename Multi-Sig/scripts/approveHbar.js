const {
	Client,
	PrivateKey,
	AccountAllowanceApproveTransaction,
	ScheduleCreateTransaction,
	ScheduleSignTransaction,
	TransferTransaction,
	AccountBalanceQuery,
	ScheduleInfoQuery,
	Hbar,
	KeyList,
	ScheduleId,
	AccountId,
	Timestamp,
} = require('@hashgraph/sdk');
require('dotenv').config();


const accountId1 = process.env.ACCOUNT_ID_1;
const privateKey1 = PrivateKey.fromString(process.env.PRIVATE_KEY_1);

if (accountId1 == null ||
    privateKey1 == null ) {
    throw new Error("Environment variables tokenId, accountId1 and privateKey2 must be present");
}

const accountId2 = process.env.ACCOUNT_ID_2;
const privateKey2 = PrivateKey.fromString(process.env.PRIVATE_KEY_2);

if (accountId2 == null ||
    privateKey2 == null ) {
    throw new Error("Environment variables accountId2 and privateKey2 must be present");
}


// Create our connection to the Hedera network
// The Hedera JS SDK makes this really easy!
const client = Client.forTestnet();

client.setOperator(accountId1, privateKey1);

const main = async () => {
	

    //Create the transaction
    const transaction = new AccountAllowanceApproveTransaction()
    .approveHbarAllowance(accountId1, accountId2, Hbar.from(1000000)).freezeWith(client);

    //Sign the transaction with the owner account key
    const signTx = await transaction.sign(privateKey1);

    //Sign the transaction with the client operator private key and submit to a Hedera network
    const txResponse = await signTx.execute(client);

    //Request the receipt of the transaction
    const receipt = await txResponse.getReceipt(client);

    //Get the transaction consensus status
    const transactionStatus = receipt.status;

    console.log("The transaction consensus status is " +transactionStatus.toString());
    
}

main()