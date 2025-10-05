export interface BlockCandidateDTO{
    candidateId: string;
    block: boolean;
}

export interface CandidateResponseDTO{
    id: string;
    name: string;
    email: string;
    blocked: boolean;
    resume?: string;
}