export interface VideoCallContextType {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
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
  endCall: () => void;
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
  remoteUserInfo: { name: string; image?: string } | null;
  interviewDetails: { jobTitle: string; interviewDate: string } | null;
}
