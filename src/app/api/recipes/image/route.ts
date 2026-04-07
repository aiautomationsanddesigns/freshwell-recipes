import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function POST(request: NextRequest) {
  try {
    const { title, description, ingredients } = await request.json();

    if (!title) {
      return NextResponse.json({ error: "Recipe title required." }, { status: 400 });
    }

    // Build a food photography prompt
    const ingredientNames = (ingredients || [])
      .slice(0, 5)
      .map((i: { name: string }) => i.name)
      .join(", ");

    const prompt = `Professional food photography of "${title}". ${description || ""}. Key ingredients: ${ingredientNames}. Beautifully plated on a white ceramic plate, overhead angle, natural lighting, shallow depth of field, rustic wooden table background, garnished with fresh herbs. Photorealistic, appetising, magazine quality.`;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    const imageUrl = response.data?.[0]?.url;
    if (!imageUrl) {
      throw new Error("No image generated");
    }

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("[API] Image generation failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate image." },
      { status: 500 }
    );
  }
}
