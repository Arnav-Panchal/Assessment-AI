import { calculateBC } from "@/services/scoring/bc";
import { calculateNS } from "@/services/scoring/ns";
import { askLLM } from "@/services/llm";

export async function calculateScoreWithSummary(answers: any) {
  const bcScore = calculateBC(answers);
  const nsScore = calculateNS(answers);

  const systemPrompt = `
You are an immigration assessment assistant.
Do NOT calculate scores.
Explain results clearly and professionally.
No legal advice.
`;

  const userPrompt = `
British Columbia Score: ${bcScore}
Nova Scotia Score: ${nsScore}

Write a short, friendly assessment summary explaining what these scores
generally indicate and suggest neutral next steps.
`;

  const summary = await askLLM(systemPrompt, userPrompt);

  return {
    bcScore,
    nsScore,
    summary,
  };
}
