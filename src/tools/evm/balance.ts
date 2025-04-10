import {
  McpServer,
  ToolCallback,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { ethers } from "ethers";
import { getBalance, getERC20Balance, getProvider } from "../../services/evm/index.js";
import { getToolOutput } from "../../utils/tools.js";

export const registerBalanceTool = (server: McpServer) => {
  server.tool(
    "get_evm_balance",
    "Get the native token balance for an EVM address.",
    {
      address: z
        .string()
        .describe(
          "The wallet address (e.g., '0x1234...') to check the balance for"
        ),
      network: z
        .string()
        .optional()
        .describe(
          "Network name or rpc url (e.g., 'ethereum', 'bsc', 'base', 'https://eth.merkle.io', ) or chain ID. Supports all EVM-compatible networks. Defaults to Ethereum mainnet."
        ),
    },
    async ({ address, network = "ethereum" }) => {
      if (!address) {
        throw new Error("address is required.");
      }
      try {
        const provider = getProvider(network)
        const balance = await getBalance(address, provider);
        return getToolOutput({
          address,
          network,
          wei: balance.toString(),
          ether: ethers.formatEther(balance),
        });
      } catch (error) {
        throw new Error(
          `Failed to get balance for address ${address} on network ${network}: ${error}`
        );
      }
    }
  );

  server.tool(
    "get_evm_erc20_balance",
    "Get the ERC20 token balance for an EVM address.",
    {
      walletAddress: z
        .string()
        .describe(
          "The wallet address (e.g., '0x1234...') to check the balance for"
        ),
      tokenAddress: z
        .string()
        .describe("The Token address (e.g., '0x1234...') "),
      network: z
        .string()
        .optional()
        .describe(
          "Network name or rpc url (e.g., 'ethereum', 'bsc', 'base', 'https://eth.merkle.io', ) or chain ID. Supports all EVM-compatible networks. Defaults to Ethereum mainnet."
        ),
    },
    async ({ walletAddress, tokenAddress, network = "ethereum" }) => {
      if (!walletAddress || !tokenAddress) {
        throw new Error("walletAddress and tokenAddress is required.");
      }
      try {
        const provider = getProvider(network)
        const { balance, decimals } = await getERC20Balance(
          walletAddress,
          tokenAddress,
          provider
        );
        return getToolOutput({
          walletAddress,
          tokenAddress,
          network,
          wei: balance.toString(),
          ether: ethers.formatUnits(balance, decimals),
        });
      } catch (error) {
        throw new Error(
          `Failed to get token(${tokenAddress}) balance for address ${walletAddress} on network ${network}: ${error}`
        );
      }
    }
  );
};
