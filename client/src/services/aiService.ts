import api from "../api/api";

export const aiService = {
  summarizeCandidate: async (candidateId: string): Promise<string> => {
    try {
      const response = await api.post("/ai/summarize-candidate", {
        candidateId,
      });
      return response.data.summary;
    } catch (error) {
      console.error("Error summarizing candidate:", error);
      throw error;
    }
  },

  getMatchScore: async (
    candidateId: string,
    jobId: string,
  ): Promise<{ score: number; reason: string }> => {
    try {
      const response = await api.post("/ai/match-score", {
        candidateId,
        jobId,
      });
      return response.data;
    } catch (error) {
      console.error("Error getting match score:", error);
      throw error;
    }
  },
};
