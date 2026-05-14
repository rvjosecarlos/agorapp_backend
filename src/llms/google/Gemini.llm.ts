//import { EnhancedGenerateContentResponse, FunctionCall, FunctionDeclaration, GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenAI, Type } from "@google/genai";
import { clientMCP } from "../../mcp/clients/clien.mcp.js";
import { ListToolsResult } from "@modelcontextprotocol/sdk/types.js";
import { MessageLLM } from "../../types/index.js";
import { AppError } from "../../errors/AppError.js";
import { refiningDescripcionPromptV7 } from "../../mcp/prompts/index.js";

export class GoogleLLM {

    static generarSolicitudGoogle = async ({ userPrompt, model, apiKey, cuenta }: { userPrompt: string, model: string, apiKey: string, cuenta: string }) => {
        try{
            console.log({ cuenta });
            const ai = new GoogleGenAI({ apiKey });

            const response =  await ai.models.generateContent({
                model,
                contents: userPrompt,
                config: {
                    systemInstruction: refiningDescripcionPromptV7,
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            titulo: { type: Type.STRING },
                            descripcion: { type: Type.STRING },
                            categoriaId: { type: Type.INTEGER }
                        },
                        required: ["titulo", "descripcion", "categoriaId"]
                    }
                } 
            });

            const jsonText = response.text ?? "{}";
            const structuredContent = JSON.parse(jsonText);

            return [{ 
            content: [{
                type: "text",
                text: jsonText
            }],
            structuredContent
        }]
        }
        catch(error){
            console.error(`Error en gemma 4: ${error.message}`);
            return null;
        };
    };

    /*
    static generarSolicitudGemini = async ({ tools, messages }: { tools: ListToolsResult, messages: MessageLLM[] }) => {
        try{
            
            const genIA = new GoogleGenerativeAI(process.env.GEMINI_LLM_API_KEY);
            
            const model = genIA.getGenerativeModel({
                model: "gemini-2.5-flash-lite",
                tools: [{
                    functionDeclarations: this.toolsAdapter(tools)
                }],
                systemInstruction: messages[0].content
            });

            const chat = model.startChat();
            const res = await chat.sendMessage(messages[1].content);

            if( res.response.functionCalls && res.response.functionCalls().length > 0 ){
                const toolRes = await this.toolCalls(res.response.functionCalls());
                if( !toolRes[0].content || !Array.isArray(toolRes) ){
                    throw new Error("Error en servicio GeminiLLM");
                };

                return toolRes;
            };

            return res.response.text();
        }
        catch(error){
            return error;
        };
    };

    static toolsAdapter = (tools:ListToolsResult) => {
        const toolsGoole = tools.tools.map( tool => {
            const { name, description, inputSchema } = tool;

            let properties = {};
            Object.entries(inputSchema.properties).forEach( ([ clave, valor ]: [clave: string, valor: {type: string, description: string}]) => {
                properties = { ...properties,
                    [clave]: { ...valor, type: valor.type.toUpperCase() } 
                };
            });

            return {
                name: name,
                description: description,
                parameters: {
                    type: inputSchema.type.toUpperCase(),
                    properties,
                    required: inputSchema.required
                }
            } as FunctionDeclaration;
        });
        return toolsGoole;
    };

    static toolCalls = async (tools: FunctionCall[]) => {
        const resFunctioncalls = tools.map( async tool => {
                return await clientMCP.callTool({
                    name: tool.name,
                    arguments: tool.args as { [x: string]: unknown; }
                });
        });

        const resultCallTools = await Promise.all(resFunctioncalls);
        return resultCallTools;
    };

    static generarSolicitudGemma = async ({ prompt, model }: { prompt: string, model: string }) => {
        
        const genIA = new GoogleGenerativeAI(process.env.GEMINI_LLM_API_KEY);
        const modelLLM = genIA.getGenerativeModel({
            model
        });
        const chat = modelLLM.startChat();
        const response = await chat.sendMessage(prompt);
        const jsonText = response.response.text();

        let textoFormateado = "";
        if( jsonText.includes("json") ){
            const inicio = jsonText.indexOf("{");
            const fin = jsonText.indexOf("}");
            textoFormateado = jsonText.slice(inicio, fin+1);
        };
        
        const structuredContent = JSON.parse(textoFormateado ? textoFormateado : jsonText);
        return [{ 
            content: [{
                type: "text",
                text: response.response.text()
            }],
            structuredContent
        }]
    };

    /*
    static generarSolicitudGemma = async ({ messages, tools }) => {
        const genIA = new GoogleGenerativeAI(process.env.GEMINI_LLM_API_KEY);
        const model = genIA.getGenerativeModel({ 
            model: "gemma-3-27b-it", 
            tools: [{
                functionDeclarations: this.toolsAdapter(tools)
            }],
            systemInstruction: messages[0].content
        });
        console.log("MODELO DE GEMMA CON HERRAMIETNAS", model);
        const chat = model.startChat();
        const res = await chat.sendMessage(messages[1].content)
        //const result = await model.generateContent(messages[1]);
        console.log({ gemmaResult: res });
    }
    */
};