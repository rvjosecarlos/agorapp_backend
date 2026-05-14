import { categoriasData } from "../data/categorias.js";
import { UserDescription } from "../dtos/agenteLLM/agenteLLM.dto.js";
import { IAError } from "../errors/IAError.js";
import { GoogleLLM } from "../llms/google/Gemini.llm.js";
import { HuggingFaceAI } from "../llms/huggingface/HuggingFace.llm.js";
import { OpenAILLM } from "../llms/openai/OpenAI.llm.js";
import { clientMCP } from "../mcp/clients/clien.mcp.js";
import { refiningDescripcionPrompt, refiningDescripcionPromptV2, refiningDescripcionPromptV3, refiningDescripcionPromptV4, refiningDescripcionPromptV7 } from "../mcp/prompts/index.js";
import { LlmResponseRefiningSchema, MessageLLM } from "../types/index.js";

const llms = [
    //"gemma-3-1b-it", //No es muy inteligente 
    //"gemma-3-2b-it", Not found 404
    //"gemma-3-4b-it", Descontinuado
    //"gemma-3-12b-it", Descontinuado
    //"gemma-3-27b-it", Descontinuado
    "gemma-4-26b-a4b-it",
    "gemma-4-26b-a4b-it-res",
    "github", 
    "gemini", 
    "openai",  
    "deepseek", 
    "copilot", 
    "huggingface"
];

export class AgenteServices {
    static refiningDescription = async (dto: UserDescription) => {

        console.log("AGENTE", dto);

        const listTools = await clientMCP.listTools();
        const messages: MessageLLM[] = [];
        messages.push({ role: "system", content: refiningDescripcionPromptV4 });
        messages.push({ role: "user", content: dto.description });

        const listToolsFormat = OpenAILLM.adapterTools(listTools);

        const erroresLLM = [{ error: "Error al procesar la solicitud de refinacion de texto", llm: "system" }]
        
        for( let llm of llms ){
            if( llm === "github" ){
                console.log({ llm });
                const resLlm = await OpenAILLM.generarSolicitud({
                    listToolsFormat,
                    messages, 
                    baseURL: process.env.GITHUB_LLM_URL, 
                    apiKey: process.env.GITHUB_OPENAI_API_KEY,
                    model: "gpt-4o-mini"
                });
                console.log("Respuesta", resLlm);
                const { data, success, error } = LlmResponseRefiningSchema.safeParse(resLlm);
                if( !success ){
                    console.log("Error github.",error);
                    erroresLLM.push({ error: JSON.stringify(resLlm), llm })
                    continue;
                };
                return data[0].structuredContent;
            }
            else if( llm === "gemma-4-26b-a4b-it" ){
                const userPrompt = dto.description;
                const resLlm = await GoogleLLM.generarSolicitudGoogle({ 
                    userPrompt, 
                    model: llm, 
                    apiKey: process.env.GEMINI_LLM_API_KEY, 
                    cuenta: "JC"
                });
                const { success, data, error } = LlmResponseRefiningSchema.safeParse(resLlm);
                if( !success ){
                    console.log(error);
                    erroresLLM.push({ error: error.message, llm });
                    continue;
                };
                return data[0].structuredContent;
            }
            else if( llm === "gemma-4-26b-a4b-it-res" ){
                const userPrompt = dto.description;
                const resLlm = await GoogleLLM.generarSolicitudGoogle({ 
                    userPrompt, 
                    model: "gemma-4-26b-a4b-it", 
                    apiKey: process.env.GEMMA_LLM_API_KEY_RESPALDO,
                    cuenta: "NRV"
                });
                const { success, data, error } = LlmResponseRefiningSchema.safeParse(resLlm);
                if( !success ){
                    //console.log(error);
                    erroresLLM.push({ error: error.message, llm });
                    continue;
                };
                return data[0].structuredContent;
            }
            /*
            else if( llm === "gemma-3-1b-it" || llm === "gemma-3-4b-it" || llm === "gemma-3-12b-it" || llm === "gemma-3-27b-it" ){
                console.log({ llm });
                const prompt = refiningDescripcionPromptV7 + "Categoriza esta descripcion: " + dto.description;
                const resLlm = await GoogleLLM.generarSolicitudGemma({ prompt, model: llm });
                console.log({ resLlm });
                const { success, data, error } = LlmResponseRefiningSchema.safeParse(resLlm);
                if( !success ){
                    console.log(error);
                    erroresLLM.push({ error: error.message, llm });
                    continue;
                };
                return data[0].structuredContent;
                
            }
            else if( llm === "gemini" ){
                console.log({ llm });
                
                const resLlm = await GoogleLLM.generarSolicitudGemini({
                    tools: listTools,
                    messages
                });

                const { data, success, error } = LlmResponseRefiningSchema.safeParse(resLlm);
                if( !success ){
                    console.log(error);
                    erroresLLM.push({ error: error.message, llm });
                    continue;
                };
                return data[0].structuredContent;
            }*/
            else if( llm === "deepseek" ){
                console.log({ llm });
                // Sin cuenta en Deepseek
                continue;
                const resLlm = await OpenAILLM.generarSolicitud({
                    listToolsFormat,
                    messages, 
                    baseURL: process.env.DEEPSEEK_LLM_URL, 
                    apiKey: process.env.DEEPSEEK_LLM_API_KEY,
                    model: "https://api.deepseek.com"
                });

                const { data, success, error } = LlmResponseRefiningSchema.safeParse(resLlm);
                if( !success ){
                    console.log(error);
                    continue;
                };
                return data[0].structuredContent;
            }
            else if( llm === "huggingface" ){
                console.log({ llm });
                // Sin creditos ni llms que soporten tools
                continue;
                console.log("HUGGINGFACE");
                const listToolFormat = HuggingFaceAI.adapterTools(listTools);
                const resLlm = await HuggingFaceAI.generarSolicitud({
                    model: "google/gemma-2-2b-it",
                    messages,
                    listToolFormat,
                    apiKey: process.env.HUGGINGFACE_LLM_API_KEY
                });
                const { data, success, error } = LlmResponseRefiningSchema.safeParse(JSON.parse(resLlm));
                if( !success ){
                    continue;
                };
                return data;
            };
        };
        throw new IAError(JSON.stringify(erroresLLM[0].error) + "Intentalo de nuevo", 500);
    };
};