import {
  connect,
  Contract,
  keyStores,
  WalletConnection,
  Account,
  ConnectedWalletAccount,
  Near,
  Connection,
} from "near-api-js";
import getConfig from "./config";

const nearConfig = getConfig(process.env.NODE_ENV || "development");

// Initialize contract & set global variables
export async function initContract() {
  // Initialize connection to the NEAR testnet
  const near = await connect(
    Object.assign(
      { deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } },
      nearConfig
    )
  );

  // Initializing Wallet based Account. It can work with NEAR testnet wallet that
  // is hosted at https://wallet.testnet.near.org
  window.walletConnection = new WalletConnection(near);

  // Getting the Account ID. If still unauthorized, it's just empty string
  window.accountId = window.walletConnection.getAccountId();
  window.account = new Account(near, window.accountId);
  console.log(
    await near.connection.signer.getPublicKey(
      window.accountId,
      nearConfig.networkId
    )
  );

  window.connectedWallet = new ConnectedWalletAccount(
    window.walletConnection,
    near.connection,
    window.accountId
  );
  // Initializing our contract APIs by contract name and configuration
  window.contract = await new Contract(
    window.walletConnection.account(),
    nearConfig.contractName,
    {
      // View methods are read only. They don't modify the state, but usually return some value.
      viewMethods: [
        "get_token",
        "get_total_number_of_tokens",
        "get_greeting",
        "get_user_token_array",
      ],
      changeMethods: ["add_token", "set_greeting"],
    }
  );
}

export function logout() {
  window.walletConnection.signOut();
  // reload page
  window.location.replace(window.location.origin + window.location.pathname);
}

export function login() {
  // Allow the current app to make calls to the specified contract on the
  // user's behalf.
  // This works by creating a new access key for the user's account and storing
  // the private key in localStorage.
  window.walletConnection.requestSignIn(nearConfig.contractName);
}
