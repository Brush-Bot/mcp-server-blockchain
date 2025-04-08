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

export const getRpc = (network: string) => {
  return (
    chainIdMap[network] ||
    nameMap[network.toLocaleLowerCase()] ||
    chainMap[network.toLocaleLowerCase()] ||
    network
  );
};
