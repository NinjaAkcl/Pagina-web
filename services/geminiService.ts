import { GoogleGenAI } from "@google/genai";

// Función segura para obtener la API Key sin romper la app en navegadores estáticos (GitHub Pages)
const getApiKey = () => {
  try {
    // Verificamos si 'process' existe antes de acceder a él
    if (typeof process !== 'undefined' && process.env) {
      return process.env.API_KEY;
    }
  } catch (e) {
    console.warn("Environment process not defined");
  }
  return undefined;
};

const apiKey = getApiKey();

// Initialize Gemini Client
// Si no hay API Key, inicializamos con un string vacío para evitar error de constructor inmediato,
// pero manejamos el error al intentar enviar mensaje.
const ai = new GoogleGenAI({ apiKey: apiKey || 'NO_KEY_CONFIGURED' });

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!apiKey) {
    return "⚠️ El chat no está disponible en este entorno (Falta API Key). Por favor contáctanos por WhatsApp.";
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