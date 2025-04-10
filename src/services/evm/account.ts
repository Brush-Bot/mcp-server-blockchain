import { ethers, type JsonRpcProvider } from "ethers";
import { getERC20Info } from "./erc20.js";

export const getCode = async (address: string, provider: JsonRpcProvider) => {
  const code = await provider.getCode(address);
  return code;
};

export const getAddressType = async (
  address: string,
  code: string,
  provider: JsonRpcProvider
) => {
  if (code === "0x") {
    return "EOA"; // Externally Owned Account
  }
  const erc20Info = await getERC20Info(provider, address);
  if (erc20Info.isERC20) {
    return "ERC20";
  }
  return "CONTRACT";
};
