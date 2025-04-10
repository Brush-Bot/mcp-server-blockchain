import { type McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerRootDataSearchTool } from "./serch.js";

export const registerRootDataTools = (server: McpServer) => {
  registerRootDataSearchTool(server);
};
