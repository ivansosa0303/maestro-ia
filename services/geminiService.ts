import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserInput, CourseData } from "../types";

const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });

const courseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "A catchy, academic title for the course." },
    subtitle: { type: Type.STRING, description: "A 2-3 sentence description/subtitle." },
    tags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3 tags: Level, Estimated Duration, and Target Profile Summary."
    },
    objectives: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "5-7 learning objectives."
    },
    units: {
      type: Type.ARRAY,
      description: "6 to 8 units/learning paths.",
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Attractive unit title." },
          summary: { type: Type.STRING, description: "Clear summary phrase." },
          lessons: {
            type: Type.ARRAY,
            description: "3 to 5 lessons per unit.",
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                keyIdea: { type: Type.STRING, description: "4-8 sentences explaining the concept." },
                appliedExample: { type: Type.STRING, description: "Real-world application example." },
                practicalActivity: { type: Type.STRING, description: "A practical task for the student." },
                quiz: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      question: { type: Type.STRING },
                      options: { type: Type.ARRAY, items: { type: Type.STRING } },
                      correctOptionIndex: { type: Type.INTEGER }
                    },
                    required: ["question", "options", "correctOptionIndex"]
                  },
                  description: "Exactly 3 distinct multiple choice questions."
                }
              },
              required: ["title", "keyIdea", "appliedExample", "practicalActivity", "quiz"]
            }
          }
        },
        required: ["title", "summary", "lessons"]
      }
    },
    finalAssessment: {
      type: Type.ARRAY,
      description: "8-10 questions covering the entire course.",
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          options: { type: Type.ARRAY, items: { type: Type.STRING } },
          correctOptionIndex: { type: Type.INTEGER }
        },
        required: ["question", "options", "correctOptionIndex"]
      }
    },
    finalProjects: {
      type: Type.ARRAY,
      description: "2 practical final projects.",
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING }
        },
        required: ["title", "description"]
      }
    },
    references: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of real books, reputable websites, or articles used as grounding."
    }
  },
  required: ["title", "subtitle", "tags", "objectives", "units", "finalAssessment", "finalProjects", "references"]
};

export const generateCourse = async (input: UserInput): Promise<CourseData> => {
  const model = "gemini-2.5-flash"; // Supports Search Grounding well
  
  const prompt = `
    Actúa como un Diseñador Instruccional Senior. Crea un curso completo en JSON español basado en:
    - Tema: ${input.topic}
    - Nivel: ${input.level}
    - Perfil del alumno: ${input.profile}
    - Objetivo: ${input.goal}
    - Tiempo disponible: ${input.timeAvailable}
    - Formato: ${input.format}

    Requisitos:
    1. Usa Google Search para encontrar información actualizada y veraz.
    2. Estructura el curso en 6-8 unidades, con 3-5 lecciones cada una.
    3. El tono debe ser educativo pero motivador.
    4. Asegúrate de incluir referencias bibliográficas reales en el campo 'references'.
  `;

  try {
    const response = await genAI.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: courseSchema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    
    // Parse the JSON. Gemini 2.5 Flash is usually very good with JSON schema compliance.
    const data = JSON.parse(text) as CourseData;
    
    // Fallback if grounding didn't populate references inside the JSON but provided chunks
    // (Though the prompt asks for them in the JSON, sometimes it's good to be safe)
    if ((!data.references || data.references.length === 0) && response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
        const chunks = response.candidates[0].groundingMetadata.groundingChunks;
        data.references = chunks
            .map(c => c.web?.uri || c.web?.title)
            .filter((x): x is string => !!x);
    }

    return data;
  } catch (error) {
    console.error("Error generating course:", error);
    throw error;
  }
};
