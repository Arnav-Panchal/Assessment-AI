export function calculateNS(answers: any) {
  let score = 0;
  console.log("NS ANSWERS:", {
  ns_net_worth: answers.ns_net_worth,
  ns_investment: answers.ns_investment,
  ns_ownership_years: answers.ns_ownership_years,
  ns_ownership_percentage: answers.ns_ownership_percentage,
});

  if (answers.ns_net_worth >= 600000) score += 20;
  if (answers.ns_investment >= 150000) score += 20;
  if (answers.ns_ownership_years >= 3) score += 20;
  if (answers.ns_ownership_percentage >= 33) score += 10;

  return score;
}
