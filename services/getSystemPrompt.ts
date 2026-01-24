import { getAllPrompts } from "@/services/promptRepo";

const FALLBACK_PROMPT = `
You are an immigration assessment assistant.
Ask one question at a time.
tell the user in what format the answer is expected eg age :23 .
Do not calculate scores.
`;

export async function getSystemPrompt(program = "GLOBAL") {
  const prompts = await getAllPrompts();

  // Find GLOBAL prompt
  const globalPrompt = prompts.find(p => p.program === "GLOBAL");

  // Find program-specific prompt (BC / NS)
  const programPrompt = prompts.find(p => p.program === program);

  return (
    [globalPrompt?.content, programPrompt?.content, FALLBACK_PROMPT]
      .filter(Boolean)
      .join("\n\n")
  );
}
