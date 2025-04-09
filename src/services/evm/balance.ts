import { ethers } from "ethers";
import { getRpc } from "./chains.js";

export const getBalance = async (address: string, network: string) => {
  const rpc = getRpc(network);
  console.log("rpc", rpc);
  const provider = new ethers.JsonRpcProvider(rpc);
  provider.pollingInterval = 0;
  const balance = await provider.getBalance(address);
  return balance;
};
