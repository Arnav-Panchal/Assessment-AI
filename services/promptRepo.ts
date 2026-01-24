type Prompt = {
  program: string;
  content: string;
  updatedAt: string;
};

// In-memory fallback (used in dev)
const memoryStore: Record<string, Prompt> = {};

export async function getAllPrompts(): Promise<Prompt[]> {
  return Object.values(memoryStore);
}

export async function upsertPrompt(program: string, content: string): Promise<Prompt> {
  const prompt = {
    program,
    content,
    updatedAt: new Date().toISOString(),
  };

  memoryStore[program] = prompt;
  return prompt;
}
