export function mapAnswersForScoring(raw: Record<string, any>) {
    return {
      // BC mappings
      bc_age: raw.bc_age,
      bc_net_worth: raw.bc_net_worth,
      bc_investment: raw.bc_investment,
      bc_education: raw.bc_education,
      bc_ownership_experience: raw.bc_ownership_experience,
      bc_management_experience: raw.bc_management_experience,
  
      // NS mappings
      ns_net_worth: raw.ns_net_worth,
      ns_investment: raw.ns_investment,
      ns_ownership_years: raw.ns_ownership_years,
      ns_ownership_percentage: raw.ns_ownership_percentage,
    };
  }
  