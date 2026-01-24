import { NextResponse } from "next/server";
import { getNextQuestion } from "@/services/questionFlow";
import { askLLM } from "@/services/llm";
import { getSystemPrompt } from "@/services/getSystemPrompt";

export const runtime = "nodejs";

interface ChatRequestBody {
  answers?: Record<string, any>;
  lastAnswer?: string;
  program?: string;
}

export async function POST(req: Request) {
  try {
    const body: ChatRequestBody = await req.json();
    const { answers = {}, lastAnswer, program } = body;

    // 1️⃣ Get current question
    const currentQuestion = await getNextQuestion(answers, program);

    if (!currentQuestion) {
      return NextResponse.json({ done: true });
    }

    // 2️⃣ First request → just ask the question
    if (lastAnswer === undefined) {
      const systemPrompt = await getSystemPrompt(program);
      const llmQuestion = await askLLM(
        systemPrompt,
        `Ask the user this question clearly: "${currentQuestion.question_text}"`
      );

      return NextResponse.json({
        done: false,
        question: llmQuestion,
        key: currentQuestion.key,
      });
    }

    // 3️⃣ Validate numeric answer
    const value = Number(lastAnswer);

    if (Number.isNaN(value)) {
      return NextResponse.json({
        error: "Please enter a valid number.",
      });
    }

    if (
      (currentQuestion.min !== null && value < currentQuestion.min) ||
      (currentQuestion.max !== null && value > currentQuestion.max)
    ) {
      return NextResponse.json({
        error: `Please enter a value between ${currentQuestion.min} and ${currentQuestion.max}.`,
      });
    }

    // 4️⃣ Save answer
    const updatedAnswers = {
      ...answers,
      [currentQuestion.key]: value,
    };

    // 5️⃣ Get next question
    const nextQuestion = await getNextQuestion(updatedAnswers, program);

    if (!nextQuestion) {
      return NextResponse.json({ done: true });
    }

    // 6️⃣ Ask next question
    const systemPrompt = await getSystemPrompt(program);
    const llmQuestion = await askLLM(
      systemPrompt,
      `Ask the user this question clearly: "${nextQuestion.question_text}"`
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
