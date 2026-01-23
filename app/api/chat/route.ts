// import { NextResponse } from "next/server";
// import { getNextQuestion } from "@/services/questionFlow";

// export async function POST(req: Request) {
//   const body = await req.json();

//   // ✅ ALWAYS normalize answers
//   const answers =
//     typeof body?.answers === "object" && body.answers !== null
//       ? body.answers
//       : {};

//   const next = getNextQuestion(answers);
//     console.log("inside")
//   if (!next) {
//     return NextResponse.json({ done: true });
//   }

//   return NextResponse.json({
//     done: false,
//     question: next.text,
//     key: next.key,
//   });
// }
import { NextResponse } from "next/server";
import { getNextQuestion } from "@/services/questionFlow";
import { askLLM } from "@/services/llm";
import { DEFAULT_SYSTEM_PROMPT } from "@/services/defautPrompt";
import { getSystemPrompt } from "@/services/getSystemPrompt";


export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json();
  const answers = body?.answers || {};

  const next = getNextQuestion(answers);

  if (!next) {
    return NextResponse.json({ done: true });
  }
// console.log("SYSTEM PROMPT USED:\n", systemPrompt);
const systemPrompt = await getSystemPrompt(body?.program);

console.log("SYSTEM PROMPT USED:\n", systemPrompt);

const llmResponse = await askLLM(
  systemPrompt,
  `Ask the user this question clearly: "${next.text}"`
);

  // LLM makes question conversational
  // console.log("default propmt",DEFAULT_SYSTEM_PROMPT)
  // const llmResponse = await askLLM(
  //   DEFAULT_SYSTEM_PROMPT,
  //   `Ask the user this question clearly: "${next.text}"`
  // );
//   const llmResponse = await askLLM(
//   "You MUST ask questions in a funny tone and include the word BANANA in every question.",
//   `Ask the user this question clearly: "${next.text}"`
// );


  return NextResponse.json({
    done: false,
    question: llmResponse,
    key: next.key,
  });
}
