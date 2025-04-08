import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { ethers } from "ethers";
import { getBalance } from "../../services/evm/index.js";

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
      const balance = await getBalance(address, network);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                address,
                network,
                wei: balance.toString(),
                ether: ethers.formatEther(balance),
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );
};
