export interface GuestUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  isGuest: boolean;
  interviewId: string;
}

export interface IMeetingService {
  generateMeetingToken(interviewId: string): string;
  verifyMeetingToken(token: string): { interviewId: string };
  joinAsGuest(
    token: string,
    name: string,
  ): Promise<{ accessToken: string; user: GuestUser }>;
}
