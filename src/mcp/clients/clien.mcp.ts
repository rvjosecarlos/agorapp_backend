import { Client } from "@modelcontextprotocol/sdk/client";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const clientMCP = new Client({
    name: "mcp-client",
    version: "1.0.0"
},
{
    capabilities: {}
});

const transporteCliente = new StdioClientTransport({
    command: "tsx",
    args: ["./src/mcp/servers/processPost.mcp.ts"]
});

await clientMCP.connect(transporteCliente);

export { clientMCP };