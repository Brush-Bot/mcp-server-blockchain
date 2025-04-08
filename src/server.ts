import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerEvmTools } from "./tools/evm/index.js";

export function createServer(): McpServer {
  const server = new McpServer({
    name: "blockchain mcp server",
    version: "0.1.0",
  });

  registerEvmTools(server);

  return server;
}
