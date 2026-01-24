// services/questionFlow.ts
import { query } from "@/lib/db";

interface Question {
  id: number;
  key: string;
  question_text: string;
  program: string;
}

export async function getQuestionsFromDB(program?: string): Promise<Question[]> {
  try {
    const res = await query(
      "SELECT id, question_text, program FROM questions ORDER BY id ASC"
    );

    const questions = res.rows.map((q: any) => ({
      id: q.id,
      key: `q${q.id}`,
      question_text: q.question_text,
      program: q.program,
    }));

    // Filter by program if specified
    if (program) {
      return questions.filter((q: Question) => q.program === program);
    }

    return questions;
  } catch (error) {
    console.error("Error fetching questions from database:", error);
    throw new Error("Failed to fetch questions");
  }
}

export async function getNextQuestion(
  answers: Record<string, any> = {},
  program?: string
) {
  const questions = await getQuestionsFromDB(program);
  return questions.find(q => !(q.key in answers));
}