import { InferenceClient } from "@huggingface/inference";
import { MessageLLM } from "../../types/index.js";
import { ListToolsResult } from "@modelcontextprotocol/sdk/types.js";
import { clientMCP } from "../../mcp/clients/clien.mcp.js";

type ListToolsFormat = {
    type: string;
    function: {
        name: string;
        description: string;
        parameters: {
            type: string;
            properties: {
                [x: string]: object;
            };
            required: string[];
        };
    };
}[]

type GenerarSolicitudType = {
    apiKey: string,
    model: string,
    messages: MessageLLM[],
    listToolFormat: ListToolsFormat
}

export class HuggingFaceAI {
    static adapterTools = (listTools: ListToolsResult) => {
        const listToolsFormat = listTools.tools.map( toolMCP => {
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

    static toolCalls = async (message: any) => {};

    static generarSolicitud = async ({ apiKey, model, messages, listToolFormat }: GenerarSolicitudType) => {
        console.log("Genera interface");
        const hf = new InferenceClient(apiKey);
        console.log({ hf } );

        /*
        const res = await hf.textGeneration({
            model,
            inputs: messages,
            provider: 'hf-inference'
        });
        */


        const response = await hf.chatCompletion({
            model,
            messages,
            tools: listToolFormat,
            max_tokens: 128
        });

        const { choices } = response;
                const { message } = choices[0];

                console.log({ response, choices, message});

                if( message.tool_calls.length > 0 ){
                    // Llama a las funciones
                    const toolRes = await this.toolCalls(message.tool_calls);
                    if( !toolRes[0].content ){
                        throw new Error("Error en LLM");
                    }
                    else if( !Array.isArray(toolRes[0].content) ){
                        throw new Error("Error LLM no es un arreglo");
                    };

                    toolRes[0].content.forEach( tool => {
                        if( tool.type === "text" ){
                            messages.push({ role: "system", content: `Resultado de la llamada a la herramietna: ${tool.text}` });
                        };
                    });
                    console.log({ messages });
                    const resultadoRecurrencia = this.generarSolicitud({ apiKey, model, messages, listToolFormat });
                    return resultadoRecurrencia;
                };

                console.log({ IA: response });
                console.log({ message });

                return message.content;
                
        
    };
};