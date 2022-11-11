if (process.argv.length < 6) {
  console.log(
    "\n\nUsage: node dist/index <secret_type> <secret> <destination_address> <amount>\n\n"
  );
  console.log("secret type\n1, Mnemonic\n2, familySeed\n\n");
  process.exit(1);
}

import { XrplClient } from "xrpl-client";
import { derive, sign, utils } from "xrpl-accountlib";
import { verifySignature } from "verify-xrpl-signature";

// Please only do this if you want to build your own platform & sign headless.
// It's bad practice to add your secret to source code or a config file. In
// this case it's for demonstration/educational purposes only.
//
// If you want to interact with end users, please use the XUMM SDK, and
// NEVER ask for end user secrets! You do not want that responsibility!
//    > https://www.npmjs.com/package/xumm-sdk
//    > https://dev.to/wietse/how-to-use-the-xumm-sdk-in-node-js-5380

const client = new XrplClient("wss://s.altnet.rippletest.net:51233");

const main = async () => {
  let account: any;
  if (isNaN(Number(process.argv[5]))) {
    console.log("\nPlease enter a valid amount to transfer\n");
    process.exit(1);
  }
  if (process.argv[2] !== "1" && process.argv[2] !== "2") {
    console.log("\nPlease enter appropriate secret_type from the menu!\n");
    process.exit(1);
  }
  if (!utils.isValidAddress(process.argv[4])) {
    console.log("\nYou have entered an invalid r-address\n");
    process.exit(1);
  }
  if (process.argv[2] === "1") {
    if (!utils.isValidMnemnic(process.argv[3])) {
      console.log("Mnemonic is invalid!");
      process.exit(1);
    }
    account = derive.mnemonic(process.argv[3]);
  }
  if (process.argv[2] === "2") {
    if (!utils.isValidSeed(process.argv[3])) {
      console.log("Seed is invalid!");
      process.exit(1);
    }
    account = derive.familySeed(process.argv[3]);
  }
  const data = await client.send({
    command: "account_info",
    account: account.address,
    strict: true,
  });
  // console.log("Data: ", data);
  if (data.error) {
    console.log("Error: ", data.error_message);
    process.exit(1);
  }

  if (Number(data.account_data.Balance) / 1000000 < Number(process.argv[5])) {
    console.log("Warning: Your balance is low");
    console.log("You must have 10 XRP + the amount you are sending\n");
    process.exit(1);
  }
  const { id, signedTransaction } = sign(
    {
      TransactionType: "Payment",
      Account: account.address,
      Destination: process.argv[4],
      Amount: String(1_000_000),
      Sequence: data.account_data.Sequence,
      Fee: String(12),
    },
    account
  );
  console.log("id:  ", id);
  console.log("Signed Transaction:  ", signedTransaction);

  const result = await client.send({
    command: "submit",
    tx_blob: signedTransaction,
  });

  console.log("result ", result);

  //const verifyResult = verifySignature(signedTransaction);
  //console.log("Verified ", verifyResult);

  /*
  if (data.error) {
    console.log("Error: ", data.error_message);
    process.exit(1);
  }
  
  console.log("LedgerEntryType: ", data.account_data.LedgerEntryType);
  console.log("Balance: ", data.account_data.Balance / 1000000, " XRP");
  console.log("OwnerCount: ", data.account_data.OwnerCount);
  console.log("Sequence: ", data.account_data.Sequence);
  console.log("Current Ledger Index: ", data.ledger_current_index);
  */

  process.exit(1);
};

main();
