import OpenAI from "openai";
import type { ListToolsResult } from "@modelcontextprotocol/sdk/types.js";
import { clientMCP } from "../../mcp/clients/clien.mcp.js";
import { MessageLLM } from "../../types/index.js";
import { IAError } from "../../errors/IAError.js";

type GenerarSolicitudType = {
    listToolsFormat: OpenAI.Chat.Completions.ChatCompletionTool[], 
    messages: MessageLLM[], 
    baseURL: string, 
    apiKey: string,
    model: string
};

export class OpenAILLM {
    static adapterTools = (listTools: ListToolsResult) => {
        const listToolsFormat: OpenAI.Chat.Completions.ChatCompletionTool[] = listTools.tools.map( toolMCP => {
            return {
                type: "function",
                function: {
                    name: toolMCP.name,
                    description: toolMCP.description,
                    parameters: {
                        type: "object",
                        properties: toolMCP.inputSchema.properties,
                        required: toolMCP.inputSchema.required
                    }
                }
            };
        }); 
        return listToolsFormat;              
    };

    static toolCalls = async (toolCalls: OpenAI.Chat.Completions.ChatCompletionMessageToolCall[]) => {
        const toolResPromise = toolCalls.map( async tool => {
            // @ts-ignore
            const { name, arguments: arg } = tool.function;
            const resultCallTool = await clientMCP.callTool({
                name,
                arguments: JSON.parse(arg)
            });
            return resultCallTool;
        });
        const toolRes = await Promise.all(toolResPromise);
        return toolRes;
    };

    static generarSolicitud = async ({ baseURL, apiKey, model, messages, listToolsFormat }: GenerarSolicitudType) => {
        try{
                const openai = new OpenAI({
                    baseURL,
                    apiKey
                });
                const response = await openai.chat.completions.create({
                    model,
                    //@ts-ignore
                    messages: messages,
                    tools: listToolsFormat,
                    max_completion_tokens: 128
                });

                const { choices } = response;
                const { message } = choices[0];

                if( message.tool_calls ){
                    // Llama a las funciones
                    const toolsResult = await this.toolCalls(message.tool_calls);
                    if( !toolsResult[0].content || !Array.isArray(toolsResult[0].content)){
                        throw new Error("Error en LLM no es un arreglo");
                    };

                    return toolsResult;
                };
                return response;
        }
        catch( error ){
            if( error instanceof Error ) {
                if(!error.message.includes("402")) throw new IAError(error.message, 500);
                return [];
            };
        };
    };
};