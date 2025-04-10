import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerBalanceTool } from "./balance.js";
import { registerChainTool } from "./chain.js";
import { registerAccountTool } from "./account.js";

export const registerEvmTools = (server: McpServer) => {
  registerChainTool(server);
  registerAccountTool(server);
  registerBalanceTool(server);
};
