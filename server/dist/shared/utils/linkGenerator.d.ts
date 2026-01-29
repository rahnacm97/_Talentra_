export declare const generateMeetingLink: (roundId: string) => {
    link: string;
    token: string;
};
export declare const validateMeetingToken: (storedToken: string, providedToken: string, scheduledDate: Date) => boolean;
export declare const canJoinMeeting: (scheduledDate: Date) => boolean;
export declare const getMinutesUntilJoin: (scheduledDate: Date) => number;
//# sourceMappingURL=linkGenerator.d.ts.map