import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerBalanceTool } from "./balance.js";

export const registerEvmTools = (server: McpServer) => {
  registerBalanceTool(server);
};
