import { ICandidate } from "../../interfaces/users/candidate/ICandidate";

export const getCandidateSummaryPrompt = (profileData: Partial<ICandidate>) => `
        You are an expert technical recruiter. Summarize the following candidate profile for a hiring manager.
        
        Candidate Name: ${profileData.name}
        Title: ${profileData.title}
        About: ${profileData.about}
        Skills: ${profileData.skills?.join(", ")}
        Experience: ${JSON.stringify(profileData.experience)}
        
        Please provide a concise summary in the following format:
        
        **Key Strengths:**
        - [Strength 1]
        - [Strength 2]
        
        **Experience Overview:**
        [1-2 sentences on their experience level and background]
        
        **Best Fit Role:**
        [Suggested role based on profile]
      `;

export const getMatchScorePrompt = (
  candidate: Partial<ICandidate>,
  jobTitle: string,
  jobDescription: string,
) => `
        You are an expert ATS (Applicant Tracking System). Analyze the match between the candidate and the job.

        **Job Title:** ${jobTitle}
        **Job Description:**
        ${jobDescription}

        **Candidate Profile:**
        - Title: ${candidate.title}
        - Skills: ${candidate.skills?.join(", ")}
        - Experience: ${JSON.stringify(candidate.experience)}
        - About: ${candidate.about}

        Rate the compatibility from 0 to 100. Provide a brief reason (max 2 sentences) explaining the score to the candidate.
        
        Return ONLY valid JSON in this format:
        {
          "score": number, 
          "reason": "string"
        }
      `;
