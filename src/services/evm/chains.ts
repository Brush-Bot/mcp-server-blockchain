import { ethers } from "ethers";
import * as chains from "viem/chains";

const chainIdMap: Record<string, string> = Object.keys(chains).reduce(
  (prev, name) => {
    const chain = chains[name as keyof typeof chains] as chains.Chain;
    return {
      ...prev,
      [`${chain.id}`]: chain.rpcUrls.default.http[0],
    };
  },
  {}
);

const nameMap: Record<string, string> = Object.keys(chains).reduce(
  (prev, name) => {
    const chain = chains[name as keyof typeof chains] as chains.Chain;
    return {
      ...prev,
      [chain.name.toLocaleLowerCase()]: chain.id,
    };
  },
  {}
);

const cleanName = (name: string) => {
  return name
    .replace("Chain", "")
    .replace("Network", "")
    .replace("Mainnet", "");
};

const chainMap: Record<string, string> = Object.keys(chains).reduce(
  (prev, name) => {
    const chain = chains[name as keyof typeof chains] as chains.Chain;
    const chainName = cleanName(chain.name);
    return {
      ...prev,
      [chainName.toLocaleLowerCase()]: chain.id,
    };
  },
  {}
);

export const getProvider = (network: string) => {
  const rpc =
    chainIdMap[network] ||
    nameMap[network.toLocaleLowerCase()] ||
    chainMap[network.toLocaleLowerCase()] ||
    network;

  if (isLink(rpc)) {
    return new ethers.JsonRpcProvider(rpc);
  } else {
    throw new Error("rpc is required.");
  }
};

function isLink(rpc: string) {
  try {
    const url = new URL(rpc);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
}
