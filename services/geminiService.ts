import { GoogleGenAI, Type, Schema } from "@google/genai";
import { TopicId, Definition, Question, FamilyFeudQuestion } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const modelName = 'gemini-2.5-flash';

const getTopicName = (id: TopicId): string => {
  switch (id) {
    case TopicId.HUMAN_REPRO: return "Reproducción en los seres humanos";
    case TopicId.FETAL_DEV: return "Etapas de desarrollo del feto";
    case TopicId.MENSTRUAL: return "Ciclo menstrual";
    case TopicId.MALE_SYSTEM: return "Estructura aparato reproductor masculino";
    case TopicId.FEMALE_SYSTEM: return "Estructura aparato reproductor femenino";
    default: return "Biología humana";
  }
};

export const generateDefinitions = async (topicId: TopicId): Promise<Definition[]> => {
  const topicName = getTopicName(topicId);
  
  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        term: { type: Type.STRING },
        definition: { type: Type.STRING }
      },
      required: ["term", "definition"]
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: `Genera 10 definiciones clave e importantes sobre el tema: "${topicName}". 
      Deben ser precisas y educativas para estudiantes de ciencias naturales.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.3
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as Definition[];
    }
    return [];
  } catch (error) {
    console.error("Error generating definitions:", error);
    return [];
  }
};

export const generateQuiz = async (topicId: TopicId): Promise<Question[]> => {
  const topicName = getTopicName(topicId);
  
  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.INTEGER },
        question: { type: Type.STRING },
        options: { 
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
        correctAnswer: { type: Type.INTEGER, description: "Index 0-3 of the correct option" },
        explanation: { type: Type.STRING }
      },
      required: ["id", "question", "options", "correctAnswer", "explanation"]
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: `Genera 20 preguntas de opción múltiple tipo quiz sobre: "${topicName}".
      Cada pregunta debe tener 4 opciones. La respuesta debe ser educativa.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.4
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as Question[];
    }
    return [];
  } catch (error) {
    console.error("Error generating quiz:", error);
    return [];
  }
};

export const generateJeopardyData = async (): Promise<{category: string, questions: {points: number, question: string, answer: string}[]}[]> => {
    // Generate simplified Jeopardy board
    const schema: Schema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                category: { type: Type.STRING },
                questions: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            points: { type: Type.INTEGER },
                            question: { type: Type.STRING },
                            answer: { type: Type.STRING }
                        }
                    }
                }
            }
        }
    };

    try {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: `Genera un tablero de Jeopardy con 5 categorías basadas en reproducción humana (Feto, Menstruación, Masculino, Femenino, General).
            Para cada categoría, genera 3 preguntas con dificultad creciente (100, 200, 300 puntos).
            Respuestas cortas.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema
            }
        });
        return response.text ? JSON.parse(response.text) : [];
    } catch (e) {
        console.error(e);
        return [];
    }
}

export const generateFeudQuestion = async (): Promise<FamilyFeudQuestion | null> => {
   const schema: Schema = {
     type: Type.OBJECT,
     properties: {
       question: { type: Type.STRING },
       answers: {
         type: Type.ARRAY,
         items: {
           type: Type.OBJECT,
           properties: {
             answer: { type: Type.STRING },
             points: { type: Type.INTEGER }
           }
         }
       }
     }
   };

   try {
     const response = await ai.models.generateContent({
       model: modelName,
       contents: `Genera una pregunta estilo "100 Ecuatorianos/Latinos Dicen" relacionada con la reproducción humana o anatomía.
       Ejemplo: "Menciona un síntoma común del embarazo".
       Provee 5 respuestas populares con puntajes simulados (suma total cercana a 100).`,
       config: {
         responseMimeType: "application/json",
         responseSchema: schema,
         temperature: 0.7
       }
     });
     return response.text ? JSON.parse(response.text) : null;
   } catch (e) {
     return null;
   }
}

export const generateSingleTriviaQuestion = async (): Promise<{question: string, answer: string}> => {
    // For Tic Tac Toe
    try {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: `Genera una pregunta de trivia de una sola palabra de respuesta sobre reproducción humana. Formato JSON: { "question": "...", "answer": "..." }`,
            config: { responseMimeType: "application/json" }
        });
        return response.text ? JSON.parse(response.text) : { question: "Error", answer: "Error" };
    } catch(e) { return { question: "Error", answer: "Error" }; }
}
