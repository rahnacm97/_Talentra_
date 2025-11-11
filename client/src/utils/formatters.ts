import type { ExperienceLevel } from "../shared/validations/JobFormValidation";

export const formatExperience = (exp: ExperienceLevel): string => {
  const map: Record<ExperienceLevel, string> = {
    "0": "Fresher",
    "1-2": "1-2 years",
    "3-5": "3-5 years",
    "6-8": "6-8 years",
    "9-12": "9-12 years",
    "13+": "13+ years",
  };
  return map[exp] || exp;
};
