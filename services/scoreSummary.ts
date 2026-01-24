import { askLLM } from "@/services/llm";
import { buildScoreSummaryPrompt } from "@/services/scoreSummaryPrompt";

export async function generateScoreSummary(data: {
  bcScore: number;
  nsScore: number;
}) {
  const systemPrompt = buildScoreSummaryPrompt(data);

  const summary = await askLLM(
    systemPrompt,
    "Generate the assessment summary."
  );

  return summary;
}
