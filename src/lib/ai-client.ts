import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function generateRecipeWithAI(prompt: string, maxTokens: number = 8192): Promise<string> {
  // Try Claude first
  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: maxTokens,
      messages: [{ role: "user", content: prompt }],
    });
    const textBlock = response.content.find((b) => b.type === "text");
    if (textBlock && textBlock.type === "text") {
      console.log("[AI] Recipe generated via Claude");
      return textBlock.text;
    }
    throw new Error("No text response from Claude");
  } catch (claudeError) {
    console.warn("[AI] Claude failed, falling back to OpenAI:", claudeError);
  }

  // Fallback to OpenAI
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: maxTokens,
    });
    const text = response.choices[0]?.message?.content;
    if (text) {
      console.log("[AI] Recipe generated via OpenAI");
      return text;
    }
    throw new Error("No text response from OpenAI");
  } catch (openaiError) {
    console.error("[AI] OpenAI also failed:", openaiError);
    throw new Error("Both AI providers failed to generate a recipe. Please check your API keys.");
  }
}

export async function analyzeImageWithAI(
  base64Image: string,
  mimeType: string
): Promise<string> {
  const mediaType = mimeType as "image/jpeg" | "image/png" | "image/gif" | "image/webp";

  // Try Claude Vision first
  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType,
                data: base64Image,
              },
            },
            {
              type: "text",
              text: buildFridgeScanVisionPrompt(),
            },
          ],
        },
      ],
    });
    const textBlock = response.content.find((b) => b.type === "text");
    if (textBlock && textBlock.type === "text") {
      console.log("[AI] Image analyzed via Claude Vision");
      return textBlock.text;
    }
    throw new Error("No text response from Claude Vision");
  } catch (claudeError) {
    console.warn("[AI] Claude Vision failed, falling back to OpenAI:", claudeError);
  }

  // Fallback to OpenAI Vision
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
              },
            },
            {
              type: "text",
              text: buildFridgeScanVisionPrompt(),
            },
          ],
        },
      ],
      max_tokens: 4096,
    });
    const text = response.choices[0]?.message?.content;
    if (text) {
      console.log("[AI] Image analyzed via OpenAI Vision");
      return text;
    }
    throw new Error("No text response from OpenAI Vision");
  } catch (openaiError) {
    console.error("[AI] OpenAI Vision also failed:", openaiError);
    throw new Error("Both AI providers failed to analyze the image. Please check your API keys.");
  }
}

function buildFridgeScanVisionPrompt(): string {
  return `You are a food identification assistant for a low-carb diet app based on the Freshwell program.

Analyze this image of a fridge or food items. Identify every visible food item.

Return ONLY a valid JSON array with no markdown formatting, no code fences. Each item should be:
{
  "name": "specific food name (e.g., 'Cheddar Cheese' not just 'Cheese')",
  "confidence": 0.0 to 1.0
}

Be specific:
- "Chicken Breast" not "Chicken"
- "Cheddar Cheese" not "Cheese"
- "Full-Fat Milk" not "Milk"
- "Bell Peppers" not "Vegetables"

If you see packaging, try to identify the actual food inside.
If confidence is below 0.3, omit the item.

Return ONLY the JSON array, nothing else.`;
}
