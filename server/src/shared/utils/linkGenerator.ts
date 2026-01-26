import jwt from "jsonwebtoken";

export const generateMeetingLink = (
  roundId: string,
): { link: string; token: string } => {
  const secret = process.env.JWT_SECRET || "default_limitless_secret";
  const token = jwt.sign({ interviewId: roundId }, secret, {
    expiresIn: "24h",
  });

  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

  const link = `${clientUrl}/meet/${token}`;

  return { link, token };
};

export const validateMeetingToken = (
  storedToken: string,
  providedToken: string,
  scheduledDate: Date,
): boolean => {
  if (storedToken !== providedToken) {
    return false;
  }

  const now = new Date();
  const validStart = new Date(scheduledDate.getTime() - 15 * 60 * 1000);
  const validEnd = new Date(scheduledDate.getTime() + 2 * 60 * 60 * 1000);

  return now >= validStart && now <= validEnd;
};

export const canJoinMeeting = (scheduledDate: Date): boolean => {
  const now = new Date();
  const joinWindowStart = new Date(scheduledDate.getTime() - 15 * 60 * 1000);

  return now >= joinWindowStart;
};

export const getMinutesUntilJoin = (scheduledDate: Date): number => {
  const now = new Date();
  const joinWindowStart = new Date(scheduledDate.getTime() - 15 * 60 * 1000);

  const diffMs = joinWindowStart.getTime() - now.getTime();
  return Math.ceil(diffMs / (60 * 1000));
};
