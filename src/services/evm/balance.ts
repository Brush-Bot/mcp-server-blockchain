import { type JsonRpcProvider } from "ethers";

export const getBalance = async (
  address: string,
  provider: JsonRpcProvider
) => {
  const balance = await provider.getBalance(address);
  return balance;
};
