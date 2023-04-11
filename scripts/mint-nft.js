require("dotenv").config();
const API_URL = process.env.API_URL;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const alchemyWeb3 = createAlchemyWeb3(API_URL);
const contract = require('../artifacts/contracts/myNFT.sol/MyNFT.json');
const contractAddress = "0x5E945cB966931720352cF543642a55025B0891BC";
const nftContract = new alchemyWeb3.eth.Contract(contract.abi, contractAddress);
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const key = "0x5E945cB966931720352cF543642a55025B0891BC";


async function mintNFT(tokenURI) {
  const nonce = await alchemyWeb3.eth.getTransactionCount(PUBLIC_KEY, "latest");
  const tx = {
    from: PUBLIC_KEY,
    to: contractAddress,
    nonce: nonce,
    gas: 1000000,
    data: nftContract.methods.mintNFT(key, tokenURI).encodeABI(),
  };

  //sign off on transaction
  const signPromise = alchemyWeb3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
  signPromise
    .then((signedTx) => {
      alchemyWeb3.eth.sendSignedTransaction(
        signedTx.rawTransaction,
        function (err, hash) {
          if (!err) {
            console.log(
              "The hash of our transaction is: ",
              hash,
              "\ncheck the dashboard to view the status of your transaction"
            );
          } else {
            console.log(
              "Something went wrong when submitting our transaction:",
              err
            );
          }
        }
      );
    })
    .catch((err) => {
      console.log(" Promise failed:", err);
    });
}
mintNFT("https://ipfs.io/ipfs/QmNoaZbCwgoZ7PzPLtaeYM5rAziojBTt9QBCcxq1g23Xz5");

