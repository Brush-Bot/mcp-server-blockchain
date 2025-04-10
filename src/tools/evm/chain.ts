import { type McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getToolOutput } from "../../utils/tools.js";
import { getChainInfo } from "../../services/evm/index.js";

export const registerChainTool = (server: McpServer) => {
  server.tool(
    "get_chain_info",
    "Get the chain information(chainId, rpc, name, symbol)",
    {
      network: z
        .string()
        .optional()
        .describe(
          "Network name or rpc url (e.g., 'ethereum', 'bsc', 'base', 'https://eth.merkle.io', ) or chain ID. Supports all EVM-compatible networks. Defaults to Ethereum mainnet."
        ),
    },
    async ({ network = "ethereum" }) => {
      const info = getChainInfo(network);
      if (info) {
        return getToolOutput(info);
      } else {
        return getToolOutput({
          error: "NOT_FOUND",
        });
      }
    }
  );
};
