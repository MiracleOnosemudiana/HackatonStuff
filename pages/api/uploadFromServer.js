import * as fs from "fs";
import Bundlr from "@bundlr-network/client";

const { kty, n, e, d, p, q, dp, dq, qi, Private_Key } = process.env;

const ARWEAVE_KEY = { kty, n, e, d, p, q, dp, dq, qi };

const __getBundlrClient = () => {
  const bundlr = new Bundlr(
    "https://devnet.bundlr.network",
    "matic",
    Private_Key,
    {
      providerUrl: "https://rpc-mumbai.maticvigil.com",
    }
  );
  // Print your wallet address
  console.log(`wallet address = ${bundlr.address}`);
  return bundlr;
};



const fundBundlr = async (amountInAtomicUnits) => {
  const bundlr = __getBundlrClient();
  await bundlr.fund(amountInAtomicUnits);
};

const lazyFundNode = async (size) => {
  const bundlr = __getBundlrClient();
  // const { size } = await fs.promises.stat(pathToFile);
  const price = await bundlr.getPrice(size);
  await bundlr.fund(price);
};

const uploadFileToArweave = async (filepath, tags) => {
  const bundlr = __getBundlrClient();
  console.log("filepath ", filepath);
  const { id } = await bundlr.uploadFile(filepath, tags);
  console.log("file uploaded to ", `https://devnet.bundlr.netwok/tx/${id}`);
  return id;
};

export default async function handler(req, res) {
  //metadata is of the type => [{ 'name': key_name, 'value': some_value}]
  try {
    const { filepath, metadata } = JSON.parse(req.body);
    const { size } = await fs.promises.stat(filepath);
    console.log("file size ", size)
    await lazyFundNode(size);
    const transId = await uploadFileToArweave(filepath, metadata);
    //fs.unlinkSync(filepath);
    res.status(200).json(transId);
  } catch (error) {
    console.log("error ", error);
    res.status(400);
  }
}
