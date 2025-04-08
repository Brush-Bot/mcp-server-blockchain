import { ethers } from "ethers";
import { getRpc } from "./chains.js";

export const getCode = async (address: string, network: string) => {
  const rpc = getRpc(network);
  const provider = new ethers.JsonRpcProvider(rpc);
  const code = await provider.getCode(address);
  return code;
};

export const getAddressType = async (address: string, network: string, code: string) => {
  if (code === "0x") {
    return "EOA"; // Externally Owned Account
  }
  return "account";
};
