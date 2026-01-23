export function calculateBC(answers: any) {
  let score = 0;

  if (answers.age >= 25 && answers.age <= 35) score += 10;
  if (answers.education === "post_secondary") score += 20;
  if (answers.experience_owner >= 3) score += 20;
  if (answers.net_worth >= 600000) score += 20;
  if (answers.investment >= 200000) score += 20;

  return score;
}
