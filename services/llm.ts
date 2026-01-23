import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";

// Supported & fast Groq model
// const model = groq("mixtral-8x7b-32768");
const model=groq("llama-3.1-8b-instant")

export async function askLLM(
  systemPrompt: string,
  userPrompt: string
) {
  const result = await generateText({
    model,
    system: systemPrompt,
    prompt: userPrompt,
  });
 console.log("inside the groq",result.text)
  return result.text;
}
