import api from "../../api/api";
import type { Candidate } from "../../types/admin/admin.candidate.types";

interface CandidateListResponse {
  data: Candidate[];
  total: number;
}

export const getAllCandidatesApi = async (
  page: number,
  limit: number,
  search: string = ""
): Promise<CandidateListResponse> => {
  const response = await api.get(`/admin/candidates`, {
    params: { page, limit, search },
  });
  return response.data;
};

export const blockUnblockCandidateApi = async (
  candidateId: string,
  block: boolean
): Promise<{ candidate: Candidate; message: string }> => {
  const response = await api.patch(`/admin/candidates/block-unblock`, {
    candidateId,
    block,
  });
  return response.data;
};