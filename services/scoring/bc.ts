export function calculateBC(answers: any) {
  let score = 0;

  if (answers.bc_age >= 25 && answers.bc_age <= 35) score += 10;
  if (answers.bc_net_worth >= 600000) score += 20;
  if (answers.bc_investment >= 200000) score += 20;
  if (answers.bc_ownership_experience >= 3) score += 20;

  return score;
}
