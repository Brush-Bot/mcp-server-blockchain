import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerBalanceTool } from "./balance.js";
import { registerAccountTool } from "./account.js";

export const registerEvmTools = (server: McpServer) => {
  registerAccountTool(server);
  registerBalanceTool(server);
};
