import type { ExperienceLevel } from "../shared/validations/JobFormValidation";

//Experience format
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
//Fullname format
export const formatFullName = (name: any) => {
  if (!name) return "Unknown";
  return name
    .split(" ")
    .map(
      (word: any) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    )
    .join(" ");
};
//Date and time
export const formatDateTime = (dateIso: string) => {
  const date = new Date(dateIso);
  return (
    date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }) +
    " at " +
    date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  );
};

const commonOptions = {
  month: "long" as const,
  day: "numeric" as const,
  year: "numeric" as const,
  hour: "numeric" as const,
  minute: "2-digit" as const,
  hour12: true as const,
};

//Date format
export const formatDate = (dateInput: string | Date) => {
  if (!dateInput) return "Date not set";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "Date not set";

  return date.toLocaleDateString("en-US", commonOptions);
};

//Interview date with week day
export const formatInterviewDate = (dateInput?: string) => {
  if (!dateInput) return "Date not set";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "Date not set";

  return date.toLocaleDateString("en-US", {
    ...commonOptions,
    weekday: "long",
  });
};
