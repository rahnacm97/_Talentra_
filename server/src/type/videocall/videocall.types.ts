export interface SignalData {
  roomId: string;
  userData?: Record<string, unknown>;
}

export interface OfferPayload extends SignalData {
  offer: Record<string, unknown>;
}

export interface AnswerPayload extends SignalData {
  answer: Record<string, unknown>;
}

export interface CandidatePayload {
  roomId: string;
  candidate: Record<string, unknown>;
}
