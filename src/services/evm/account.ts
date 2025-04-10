import { ethers } from "ethers";
import { getRpc } from "./chains.js";
import { getERC20Info } from "./erc20.js";

export const getCode = async (address: string, network: string) => {
  const rpc = getRpc(network);
  const provider = new ethers.JsonRpcProvider(rpc);
  const code = await provider.getCode(address);
  return code;
};

export const getAddressType = async (
  address: string,
  network: string,
  code: string
) => {
  const rpc = getRpc(network);
  const provider = new ethers.JsonRpcProvider(rpc);
  if (code === "0x") {
    return "EOA"; // Externally Owned Account
  }
  const erc20Info = await getERC20Info(provider, address);
  if (erc20Info.isERC20) {
    return "ERC20";
  }
  return "CONTRACT";
};
