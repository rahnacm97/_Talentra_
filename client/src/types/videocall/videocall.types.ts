export interface OfferPayload {
  roomId: string;
  offer: RTCSessionDescriptionInit;
}

export interface AnswerPayload {
  roomId: string;
  answer: RTCSessionDescriptionInit;
}

export interface CandidatePayload {
  roomId: string;
  candidate: RTCIceCandidate;
}

export type CallStatus = "idle" | "waiting" | "admitted" | "denied" | "in-call";

export interface WaitingParticipant {
  socketId: string;
  userId: string;
  name: string;
  userType: string;
}

export interface ChatMessage {
  sender: string;
  message: string;
  timestamp: Date;
  isLocal?: boolean;
}

export interface VideoCallContextType {
  localStream: MediaStream | null;
  remoteStreams: Map<string, MediaStream>;
  isCallActive: boolean;
  startCall: (
    roomId: string,
    recipientId: string,
    userInfo: { name: string; image?: string },
    interviewDetails?: { jobTitle: string; interviewDate: string },
  ) => Promise<void>;
  joinCall: (
    roomId: string,
    userInfo: { name: string; image?: string },
    interviewDetails?: { jobTitle: string; interviewDate: string },
  ) => Promise<void>;
  requestJoin: (
    roomId: string,
    userInfo: { name: string; image?: string },
    userType: string,
  ) => Promise<void>;
  endCall: () => void;
  cancelJoinRequest: () => void;
  toggleAudio: () => void;
  toggleVideo: () => void;
  toggleScreenShare: () => void;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
  incomingCall: { roomId: string; from: string } | null;
  acceptCall: () => void;
  rejectCall: () => void;
  localUserInfo: { name: string; image?: string } | null;
  remoteUsers: Map<string, { name: string; image?: string }>;
  interviewDetails: { jobTitle: string; interviewDate: string } | null;

  // Waiting Room & Chat
  callStatus: CallStatus;
  waitingParticipants: WaitingParticipant[];
  admitParticipant: (socketId: string) => void;
  denyParticipant: (socketId: string) => void;

  chatMessages: ChatMessage[];
  sendMessage: (text: string) => void;
}
