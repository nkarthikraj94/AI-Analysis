import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export async function analyzeSustainability(productName: string, description: string, ingredients: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Analyze the sustainability of the following product:
    Product Name: ${productName}
    Description: ${description}
    Ingredients/Materials: ${ingredients}

    Provide a JSON response with the following fields:
    - score: An integer from 0 to 100 indicating overall sustainability.
    - summary: A brief 2-3 sentence summary of the sustainability impact.
    - recommendations: A list of 3 specific ways to improve sustainability.

    Return ONLY the JSON.
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  try {
    // Basic cleanup in case Gemini wraps in markdown blocks
    const jsonString = text.replace(/```json|```/g, "").trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Failed to parse AI response:", text);
    return {
      score: 50,
      summary: "Could not analyze sustainability at this time.",
      recommendations: ["Ensure ingredient data is accurate.", "Research industry standards.", "Consult environmental experts."]
    };
  }
}
