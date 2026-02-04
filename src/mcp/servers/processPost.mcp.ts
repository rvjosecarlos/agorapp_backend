import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

( async () => {
    const processPostServer = new McpServer({
        name: "processPostServer",
        version: "1.0.0"
    },
    {
        capabilities: {
            prompts: {},
            tools: {}
        }
    });

    processPostServer.registerTool(
        "build-json-from-user-description",
        {
            title: "Constructor de json a partir de la descripcion del usuario",
            description: 'Construye un texto con forma de JSON a partir de la descripcion del usuario, con las propiedades de titulo, descripcion y categoriaId. Ejemplo: { "titulo": "Bache en avenida principal", "descripcion": "Hay un bache muy grande en una avenida principal", "categoriaId": "2"  }',
            inputSchema: z.object({
                titulo: z.string().describe("Es el titulo breve y claro"),
                descripcion: z.string().describe("descripción mejorada"),
                categoriaId: z.string().describe("id de la categoria adecuada")
            }),
            outputSchema: z.object({
                titulo: z.string(),
                descripcion: z.string(),
                categoriaId: z.string()
            })
        },
        ({ titulo, descripcion, categoriaId }) => ({
            content: [{ type: "text", text: JSON.stringify({ titulo, descripcion, categoriaId }) }],
            structuredContent: {
                titulo,
                descripcion,
                categoriaId
            }
        })
    );

    
    const transporteStream = new StdioServerTransport();
    await processPostServer.connect(transporteStream);
})();