import { createTransaction } from "arweavekit/transaction";
import fs from "fs/promises";
import { getAddress, getBalance } from "arweavekit/wallet";
import fs from "fs";

const { kty, n, e, d, p, q, dp, dq, qi } = process.env;

const ARWEAVE_KEY = { kty, n, e, d, p, q, dp, dq, qi };

const __checkWalletBalance = async function () {
  const wallet = await getAddress({
    key: ARWEAVE_KEY,
    environment: "mainnet",
  });

  console.log("wallet address ", wallet);

  const balance = await getBalance({
    address: wallet,
    environment: "mainnet",
  });

  return `${balance / 1000000000000} AR`;
};

export default async function handler(req, res) {
  //metadata is of the type => [{ 'name': key_name, 'value': some_value}]
  try {
    const { filepath, metadata } = JSON.parse(req.body);
    const data = Buffer.from(await fs.readFile(filepath));
    const arrayBuffer = data.buffer.slice(
      data.byteOffset,
      data.byteOffset + data.byteLength
    );
    console.log("file ", arrayBuffer instanceof ArrayBuffer);
    const walletBalance = await __checkWalletBalance();
    console.log("wallet balance ", walletBalance);
    const transaction = await createTransaction({
      data: arrayBuffer,
      key: ARWEAVE_KEY,
      type: "data",
      environment: "mainnet",
      options: {
        tags: metadata,
        signAndPost: true,
        useBundlr: true,
      },
    });
    const {
      postedTransaction, // { id, timestamp }
    } = transaction;
    console.log("bundlr transaction ", postedTransaction);
    //1yrBOuzdI12yUAUa-Dtwzm3PQgkbpH1I1TR3JNUHsCk
    fs.unlinkSync(filePath);
    res.status(200).json({ postedTransaction })
  } catch (error) {
    console.log("error ", error);
    res.status(400);
  }
}
