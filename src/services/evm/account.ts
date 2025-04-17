import { ethers, type JsonRpcProvider } from "ethers";
import { getERC20Info } from "./erc20.js";
import { detectERCStandard } from "./nft.js";

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
  const erc20Info = await getERC20Info(address, provider);
  if (erc20Info.isERC20) {
    return "ERC20";
  }

  const nftInfo = await detectERCStandard(address, provider);
  
  if (nftInfo.isERC721) {
    return "ERC721";
  }

  if (nftInfo.isERC1155) {
    return "ERC1155";
  }

  return "CONTRACT";
};
