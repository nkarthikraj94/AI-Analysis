import { GoogleGenerativeAI } from "@google/generative-ai";

const getApiKey = () => {
    const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!key) return "";
    return key.trim().replace(/^["']|["']$/g, "");
};

const genAI = new GoogleGenerativeAI(getApiKey());

export interface ComplaintAnalysis {
  sentiment: "POSITIVE" | "NEGATIVE" | "NEUTRAL";
  priority: "LOW" | "MEDIUM" | "HIGH";
  summary: string;
  category: string;
}

export async function analyzeComplaint(title: string, description: string): Promise<ComplaintAnalysis> {
  const apiKey = getApiKey();
  if (!apiKey) {
      return {
          sentiment: "NEUTRAL",
          priority: "MEDIUM",
          summary: "Manual review required. (Error: Missing API Key)",
          category: "Other"
      };
  }

  // Models available in this environment (April 2026)
  const configs = [
    { model: "gemini-2.5-flash", apiVersion: "v1beta" },
    { model: "gemini-2.0-flash", apiVersion: "v1beta" },
    { model: "gemini-3-flash-preview", apiVersion: "v1beta" },
    { model: "gemini-flash-latest", apiVersion: "v1beta" }
  ];
  
  const prompt = `
    Analyze the following customer complaint and provide a JSON response.
    
    Complaint Title: ${title}
    Complaint Description: ${description}
    
    Return a JSON object with the following fields:
    - sentiment: "POSITIVE", "NEGATIVE", or "NEUTRAL"
    - priority: "LOW", "MEDIUM", or "HIGH"
    - summary: A concise 1-sentence summary of the issue
    - category: Assign a category (e.g., Billing, Technical, Service, Product, Other)
    
    Respond ONLY with the JSON object.
  `;

  let lastError = null;

  for (const config of configs) {
    try {
      // @ts-ignore
      const model = genAI.getGenerativeModel({ model: config.model }, { apiVersion: config.apiVersion });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
      return JSON.parse(cleanedText);
    } catch (error: any) {
      console.error(`AI Analysis failed for ${config.model}:`, error.message);
      lastError = error;
    }
  }

  return {
    sentiment: "NEUTRAL",
    priority: "MEDIUM",
    summary: `Manual review required. (Error: ${lastError?.message || "Model connection failed"})`,
    category: "Other"
  };
}
