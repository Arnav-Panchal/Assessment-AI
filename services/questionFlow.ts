export const QUESTIONS = [
  { key: "age", text: "What is your age?" },
  { key: "education", text: "What is your highest level of education?" },
  { key: "experience_owner", text: "How many years have you been a business owner?" },
  { key: "experience_manager", text: "How many years have you been a senior manager?" },
  { key: "net_worth", text: "What is your total net worth in CAD?" },
  { key: "investment", text: "How much do you plan to invest in CAD?" },
  { key: "ownership", text: "What percentage of the business will you own?" },
  { key: "language", text: "What is your CLB language level?" }
];

export function getNextQuestion(answers: Record<string, any>={}) {
  return QUESTIONS.find(q => !answers[q.key]==undefined);
}
