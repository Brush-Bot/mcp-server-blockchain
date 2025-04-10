import { ethers } from "ethers";
import * as chains from "viem/chains";

const cleanName = (name: string) => {
  return name
    .replace("Chain", "")
    .replace("Network", "")
    .replace("Mainnet", "");
};

const chainIdMap: Record<string, chains.Chain> = Object.keys(chains).reduce(
  (prev, name) => {
    const chain = chains[name as keyof typeof chains] as chains.Chain;
    return {
      ...prev,
      [`${chain.id}`]: chain,
    };
  },
  {}
);

const nameMap: Record<string, chains.Chain> = Object.keys(chains).reduce(
  (prev, name) => {
    const chain = chains[name as keyof typeof chains] as chains.Chain;
    return {
      ...prev,
      [chain.name.toLocaleLowerCase()]: chainIdMap[chain.id],
    };
  },
  {}
);

const chainMap: Record<string, chains.Chain> = Object.keys(chains).reduce(
  (prev, name) => {
    const chain = chains[name as keyof typeof chains] as chains.Chain;
    const chainName = cleanName(chain.name);
    return {
      ...prev,
      [chainName.toLocaleLowerCase()]: chainIdMap[chain.id],
    };
  },
  {}
);

const shortMap: Record<string, chains.Chain> = {
  arb: chainIdMap[`${42_161}`],
  op: chainIdMap[`${10}`],
  zk: chainIdMap[`${324}`],
};

export const getChainInfo = (network: string) => {
  const chain =
    nameMap[network.toLocaleLowerCase()] ||
    chainMap[network.toLocaleLowerCase()] ||
    shortMap[network] ||
    chainIdMap[network];
  return chain;
};

export const getProvider = (network: string) => {
  const chain = getChainInfo(network);

  const rpc = chain?.rpcUrls?.default?.http?.[0] || network;

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
