import { NextResponse } from "next/server";
import { generateText } from "ai";
import { model } from "@/lib/ai";
import { getNextQuestion } from "@/services/questionFlow";
import { askLLM } from "@/services/llm";
import { getSystemPrompt } from "@/services/getSystemPrompt";

export const runtime = "nodejs";

// Type for request body
interface ChatRequestBody {
  answers?: Record<string, any>;
  lastAnswer?: string;
  program?: string;
}

export async function POST(req: Request) {
  try {
    const body: ChatRequestBody = await req.json();
    const { answers = {}, lastAnswer, program } = body;

    // 1️⃣ Get the next unanswered question (NOW WITH AWAIT)
    const currentQuestion = await getNextQuestion(answers, program);

    if (!currentQuestion) {
      // No more questions left
      return NextResponse.json({ done: true });
    }

    // 2️⃣ FIRST CALL → Just ask the question (no lastAnswer yet)
    if (!lastAnswer) {
      const systemPrompt = await getSystemPrompt(program);
      const llmQuestion = await askLLM(
        systemPrompt,
        `Ask the user this question clearly: "${currentQuestion.question_text}"` // CHANGED FROM .text
      );

      return NextResponse.json({
        done: false,
        question: llmQuestion,
        key: currentQuestion.key,
      });
    }

    // 3️⃣ Normalize last answer using AI
    const { text } = await generateText({
      model,
      temperature: 0,
      system: `
You are a data normalizer.
Convert user answers into clean JSON.
Return ONLY valid JSON.
No explanations.
`,
      prompt: `
Question key: ${currentQuestion.key}
User answer: "${lastAnswer}"

Return JSON in this format:
{ "${currentQuestion.key}": value }
`,
    });

    let parsedAnswer: Record<string, any>;
    try {
      parsedAnswer = JSON.parse(text);
    } catch {
      return NextResponse.json({
        error: "Could not understand your answer. Please reply clearly.",
      });
    }

    // 4️⃣ Merge answers
    const updatedAnswers = { ...answers, ...parsedAnswer };

    // 5️⃣ Get next question (NOW WITH AWAIT)
    const nextQuestion = await getNextQuestion(updatedAnswers, program);

    if (!nextQuestion) {
      return NextResponse.json({ done: true });
    }

    // 6️⃣ Ask LLM to phrase the next question
    const systemPrompt = await getSystemPrompt(program);
    const llmQuestion = await askLLM(
      systemPrompt,
      `Ask the user this question clearly: "${nextQuestion.question_text}"` // CHANGED FROM .text
    );

    return NextResponse.json({
      done: false,
      question: llmQuestion,
      key: nextQuestion.key,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error. Try again later." },
      { status: 500 }
    );
  }
}