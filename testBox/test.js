// new near instance (for NodeJS use InMemoryKeyStore)

// do this for somehwere when the app mounts or loads
const { WalletConnection } = require("near-api-js");
const nearAPI = require("near-api-js");
const path = require("path");

const run = async () => {
  // import keyStores from nearAPI
  const { keyStores, connect, WalletConnection } = nearAPI;

  // build up path to ./nearcredentials
  const homedir = require("os").homedir();
  const CREDENTIALS_DIR = ".near-credentials";
  const credentialsPath = path.join(homedir, CREDENTIALS_DIR);

  // set location to retreive store keys
  const keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);

  // connect to RPC

  const config = {
    networkId: "testnet",
    keyStore, // optional if not signing transactions
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://wallet.testnet.near.org",
    helperUrl: "https://helper.testnet.near.org",
    explorerUrl: "https://explorer.testnet.near.org",
  };

  // with that config info set we can now use it to connect to NEAR
  const near = await connect(config);

  // After you connect to the near blockchain you can now connect to the wallet within the near blockchain

  const wallet = new WalletConnection(near, "my-app");

  const signIn = () => {
    wallet.requestSignIn("example_account12345.testnet");
  };
  //   signIn();
};



// the flow is get keys, set up config, establish connection to blockchian, get connected to wallet via blockchain 
run();
