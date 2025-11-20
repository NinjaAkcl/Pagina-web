import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY;

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: apiKey });

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!apiKey) {
    return "Error: API Key no configurada. El chat no está disponible.";
  }

  try {
    const modelId = 'gemini-2.5-flash'; 
    const systemInstruction = `Eres un asistente virtual para "NextLayer", un emprendimiento innovador de impresión 3D y diseño.
    
    Tono: Profesional, minimalista, emprendedor y servicial.
    
    Objetivo:
    1. Asesorar sobre materiales (PLA, PETG, Flex, Resina) y sus aplicaciones.
    2. Ayudar a navegar el catálogo de productos.
    3. Explicar que al ser un emprendimiento, ofrecemos atención personalizada y diseños a medida.
    
    Información clave:
    - Ubicación: Córdoba, Argentina.
    - Pagos/Envíos: Se coordinan vía WhatsApp al finalizar el pedido.
    - Filosofía: Diseño funcional y estética minimalista.
    
    Si no sabes un precio exacto, sugiere revisar la sección "Catálogo" de la web. Mantén las respuestas breves y directas.`;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: message,
      config: {
        systemInstruction: systemInstruction,
        maxOutputTokens: 300,
      }
    });

    return response.text || "Lo siento, no pude procesar tu respuesta en este momento.";
  } catch (error) {
    console.error("Error communicating with Gemini:", error);
    return "Hubo un error al conectar con el asistente. Por favor intenta más tarde.";
  }
};