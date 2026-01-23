export function calculateNS(answers: any) {
  let score = 0;

  if (answers.age >= 21) score += 10;
  if (answers.net_worth >= 600000) score += 20;
  if (answers.investment >= 150000) score += 20;
  if (answers.ownership >= 33) score += 10;
  if (answers.experience_owner >= 3) score += 20;

  return score;
}
