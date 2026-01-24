// services/questionFlow.ts
import { query } from "@/lib/db";

interface Question {
  id: number;
  key: string; // scoring_field
  question_text: string;
  question_type: string;
  min: number | null;
  max: number | null;
  program: string;
}

export async function getQuestionsFromDB(program?: string): Promise<Question[]> {
  try {
    const res = await query(
      `SELECT 
         id,
         question_text,
         question_type,
         program,
         scoring_field,
         min_value,
         max_value
       FROM questions
       ORDER BY display_order ASC`
    );

    const questions: Question[] = res.rows.map((q: any) => ({
      id: q.id,
      key: q.scoring_field,
      question_text: q.question_text,
      question_type: q.question_type,
      min: q.min_value,
      max: q.max_value,
      program: q.program,
    }));

    if (program) {
      return questions.filter(q => q.program === program);
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
