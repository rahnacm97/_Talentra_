export interface Candidate {
  id: string;
  name: string;
  email: string;
  resume?: string;
  blocked: boolean;
}

export interface CandidateListResponse {
  data: Candidate[];
  total: number;
}
