import { GoogleGenAI } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

// Función segura para obtener la API Key sin romper la app
const getApiKey = () => {
  try {
    if (typeof process !== 'undefined' && process.env) {
      return process.env.API_KEY;
    }
  } catch (e) {
    // Ignoramos errores de acceso a process en navegadores antiguos
  }
  return undefined;
};

// Inicialización perezosa (Lazy Load): Solo creamos la instancia cuando se necesita.
// Esto evita que la app se rompa al cargar (pantalla blanca) si no hay API Key configurada.
const getAiInstance = () => {
  if (aiInstance) return aiInstance;

  const apiKey = getApiKey();
  
  // Si no hay key, retornamos null sin intentar crear el objeto, evitando el crash.
  if (!apiKey) return null;

  try {
    aiInstance = new GoogleGenAI({ apiKey });
    return aiInstance;
  } catch (error) {
    console.warn("Error inicializando Gemini:", error);
    return null;
  }
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  const ai = getAiInstance();

  if (!ai) {
    return "⚠️ El asistente virtual no está disponible en esta versión demo (Falta API Key). Por favor contáctanos directamente por WhatsApp para una atención inmediata.";
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