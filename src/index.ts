#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import express, { Request, Response } from "express";
import cors from "cors";
import { createServer } from "./server.js";

const app = express();

app.use(cors());

async function main() {
  const PORT = process.env.PORT || 3000;
  const HOST = process.env.HOST || "0.0.0.0";

  console.info(`Configured to listen on ${HOST}:${PORT}`);

  const server: McpServer = createServer();

  let transport: SSEServerTransport | null = null;

  app.get("/sse", (req: Request, res: Response) => {
    transport = new SSEServerTransport("/messages", res);
    server.connect(transport);
  });

  app.post("/messages", (req: Request, res: Response) => {
    if (transport) {
      transport.handlePostMessage(req, res);
    }
  });

  app.listen(3000);
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
