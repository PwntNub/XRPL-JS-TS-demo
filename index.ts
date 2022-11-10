if (process.argv.length < 3) {
  console.log("Usage: node dist/index <r-address>");
  process.exit(1);
}

import { XrplClient } from "xrpl-client";
import { derive, sign, utils } from "xrpl-accountlib";

// Please only do this if you want to build your own platform & sign headless.
// It's bad practice to add your secret to source code or a config file. In
// this case it's for demonstration/educational purposes only.
//
// If you want to interact with end users, please use the XUMM SDK, and
// NEVER ask for end user secrets! You do not want that responsibility!
//    > https://www.npmjs.com/package/xumm-sdk
//    > https://dev.to/wietse/how-to-use-the-xumm-sdk-in-node-js-5380

//const secret = "sEdTriaMMLbaWru9eZRbrQhPdMP4Q3v";
// account = rsDT47FbAU8dwifYoDGrFTEUp6RYta5ZJ4
const client = new XrplClient();

const main = async () => {
  if (!utils.isValidAddress(process.argv[2])) {
    console.log("Account not found or is invalid!");
    process.exit(1);
  }

  const data = await client.send({
    command: "account_info",
    account: process.argv[2],
    strict: true,
  });

  if (data.error) {
    console.log("Error: ", data.error_message);
    process.exit(1);
  }

  console.log("Data ", data);
  console.log("LedgerEntryType: ", data.account_data.LedgerEntryType);
  console.log("Balance: ", data.account_data.Balance / 1000000, " XRP");
  console.log("OwnerCount: ", data.account_data.OwnerCount);
  console.log("Sequence: ", data.account_data.Sequence);
  console.log("Current Ledger Index: ", data.ledger_current_index);
};

main();
