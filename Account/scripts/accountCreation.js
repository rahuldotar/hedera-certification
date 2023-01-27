const { Client, PrivateKey, AccountCreateTransaction, AccountBalanceQuery, Hbar} = require("@hashgraph/sdk");
require("dotenv").config();

//Grab your Hedera testnet account ID and private key from your .env file
const {
	MY_ACCOUNT_ID,
	MY_PRIVATE_KEY
} = process.env;

const main = async () => {
	//Create new keys
	const keyPairs = await generateKeys(5);

    //Create account1 with 1,000 hbar starting balance
    const accountId1 = await createAccount(keyPairs.privateKeys[0]);
    await accountBalance(accountId1);

    //Create account2 with 1,000 hbar starting balance
    const accountId2 = await createAccount(keyPairs.privateKeys[1]);
    await accountBalance(accountId2);

    //Create account3 with 1,000 hbar starting balance
    const accountId3 = await createAccount(keyPairs.privateKeys[2]);
    await accountBalance(accountId3);

    //Create account4 with 1,000 hbar starting balance
    const accountId4 = await createAccount(keyPairs.privateKeys[3]);
    await accountBalance(accountId4);

    //Create account5 with 1,000 hbar starting balance
    const accountId5 = await createAccount(keyPairs.privateKeys[4]);
    await accountBalance(accountId5);


}

const getClient = async () => {
    // If we weren't able to grab it, we should throw a new error
    if (MY_ACCOUNT_ID == null || MY_PRIVATE_KEY == null) {
        throw new Error(
            'Environment variables MY_ACCOUNT_ID and MY_PRIVATE_KEY must be present'
        );
    }

    // Create our connection to the Hedera network
    return Client.forTestnet().setOperator(MY_ACCOUNT_ID, MY_PRIVATE_KEY);
};

const generateKeys = async (numOfKeys) => {
	const privateKeys = [];
	const publicKeys = [];

	for (let i = 0; i < numOfKeys; i++) {
		const privateKey1 = PrivateKey.generateED25519();
		const publicKey1 = privateKey1.publicKey;
		privateKeys.push(privateKey1);
		publicKeys.push(publicKey1);

		console.log(`\n\nGenerated Key Pairs ${i + 1}`);
		console.log(`Public Key: ${publicKey1.toStringRaw()}`);
		console.log(`Private Key: ${privateKey1.toStringRaw()}`);
	}

	return { privateKeys, publicKeys };
};

const createAccount = async (publicKey) => {
	const client = await getClient();
	const myAccount = await new AccountCreateTransaction()
		.setKey(publicKey)
		.setInitialBalance(Hbar.fromString('1000'))
		.execute(client);

	// Get the new account ID
	const getReceipt = await myAccount.getReceipt(client);
	const myAccountID = getReceipt.accountId;

	console.log(
		'\n\nThe Account ID is: ' + myAccountID 
	);
	return myAccountID;
};

const accountBalance = async (accountID) => {
	const client = await getClient();
	//Check the account's balance
	const getBalance = await new AccountBalanceQuery()
		.setAccountId(accountID)
		.execute(client);

	console.log(
		`\nBalance of ${accountID}: ` + getBalance.hbars.toTinybars() + ' tinybars.'
	);
};

main();