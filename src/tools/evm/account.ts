import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  getCode,
  getAddressType,
  getProvider,
} from "../../services/evm/index.js";
import { getToolOutput } from "../../utils/tools.js";

export const registerAccountTool = (server: McpServer) => {
  server.tool(
    "get_evm_address_transaction_count",
    "Get the transaction count(nonce) of an EVM address.",
    {
      address: z
        .string()
        .describe(
          "The address (e.g., '0x1234...') to check the transaction count for"
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
        const provider = getProvider(network);
        const count = await provider.getTransactionCount(address);
        return getToolOutput({
          address,
          network,
          count,
        });
      } catch (error) {
        throw new Error(
          `Failed to get transaction count for address ${address} on network ${network}: ${error}`
        );
      }
    }
  );

  server.tool(
    "get_evm_address_type",
    "Get the type of an EVM address.",
    {
      address: z
        .string()
        .describe(
          "The contract address (e.g., '0x1234...') to check the type for"
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
        const provider = getProvider(network);
        const code = await getCode(address, provider);
        const type = await getAddressType(address, code, provider);
        return getToolOutput({
          address,
          network,
          code,
          type,
        });
      } catch (error) {
        throw new Error(
          `Failed to get address type for address ${address} on network ${network}: ${error}`
        );
      }
    }
  );
};
