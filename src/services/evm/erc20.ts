import { JsonRpcProvider } from "ethers";
import { ethers } from "ethers";

const abis = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address) view returns (uint256)",
  "function allowance(address, address) view returns (uint256)",
  "function approve(address, uint256) external returns (bool)",
];

export const getERC20Info = async (
  address: string,
  provider: JsonRpcProvider
) => {
  try {
    const token = new ethers.Contract(address, abis, provider);
    const [name, symbol, decimals] = await Promise.all([
      token.name(),
      token.symbol(),
      token.decimals(),
    ]);
    return {
      isERC20: true,
      name,
      symbol,
      decimals,
    };
  } catch {
    return {
      isERC20: false,
    };
  }
};

export const getERC20Balance = async (
  walletAddress: string,
  tokenAddress: string,
  provider: JsonRpcProvider
) => {
  const token = new ethers.Contract(tokenAddress, abis, provider);
  const [balance, decimals] = await Promise.all([
    token.balanceOf(walletAddress),
    token.decimals(),
  ]);
  return {
    balance,
    decimals,
  };
};

