import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { getSocket } from "../socket/socket";
import { endVideoCall } from "../features/videocall/videoCallApi";
import { useSelector } from "react-redux";
import { type RootState } from "../app/store";
import type {
  VideoCallContextType,
  CallStatus,
  WaitingParticipant,
  ChatMessage,
} from "../types/videocall/videocall.types";
import { toast } from "react-toastify";

//Context
const VideoCallContext = createContext<VideoCallContextType | undefined>(
  undefined,
);

//Provider
export const VideoCallProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(
    new Map(),
  );
  const [isCallActive, setIsCallActive] = useState(false);
  const [incomingCall, setIncomingCall] = useState<{
    roomId: string;
    from: string;
  } | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);

  const [localUserInfo, setLocalUserInfo] = useState<{
    name: string;
    image?: string;
  } | null>(null);
  // Multi-party support
  const [remoteUsers, setRemoteUsers] = useState<
    Map<string, { name: string; image?: string }>
  >(new Map());
  const [interviewDetails, setInterviewDetails] = useState<{
    jobTitle: string;
    interviewDate: string;
  } | null>(null);

  // Waiting Room & Chat State
  const [callStatus, setCallStatus] = useState<CallStatus>("idle");
  const [waitingParticipants, setWaitingParticipants] = useState<
    WaitingParticipant[]
  >([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const localStreamRef = useRef<MediaStream | null>(null);
  const localUserInfoRef = useRef<{ name: string; image?: string } | null>(
    null,
  );

  useEffect(() => {
    localStreamRef.current = localStream;
  }, [localStream]);

  useEffect(() => {
    localUserInfoRef.current = localUserInfo;
  }, [localUserInfo]);

  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);

  const peerConnections = useRef<Map<string, RTCPeerConnection>>(new Map());
  const [activeSocket, setActiveSocket] = useState<any | null>(getSocket());
  const currentRoomId = useRef<string | null>(null);
  const currentUser = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const s = getSocket();
    if (s && s !== activeSocket) {
      setActiveSocket(s);
    }
  }, []);

  useEffect(() => {
    if (activeSocket) return;

    const interval = setInterval(() => {
      const s = getSocket();
      if (s) {
        setActiveSocket(s);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [activeSocket]);

  const iceServers = React.useMemo(
    () => ({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:global.stun.twilio.com:3478" },
      ],
    }),
    [],
  );

  const iceCandidatesQueues = useRef<Map<string, RTCIceCandidateInit[]>>(
    new Map(),
  );

  const closeCall = React.useCallback(() => {
    peerConnections.current.forEach((pc) => {
      pc.close();
    });
    peerConnections.current.clear();

    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((track) => track.stop());
      cameraStreamRef.current = null;
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((t) => t.stop());
      screenStreamRef.current = null;
    }
    setRemoteStreams(new Map());
    setRemoteUsers(new Map());
    setIsCallActive(false);
    setIsScreenSharing(false);
    setLocalUserInfo(null);
    setInterviewDetails(null);
    setCallStatus("idle");
    setWaitingParticipants([]);
    setChatMessages([]);
    currentRoomId.current = null;
  }, [localStream]);

  const createPeerConnection = React.useCallback(
    async (userId: string) => {
      const pc = new RTCPeerConnection(iceServers);

      pc.onicecandidate = (event) => {
        if (event.candidate && currentRoomId.current) {
          activeSocket?.emit("ice_candidate", {
            roomId: currentRoomId.current,
            candidate: event.candidate,
            targetUserId: userId,
          });
        }
      };

      pc.ontrack = (event) => {
        setRemoteStreams((prev) => {
          const newMap = new Map(prev);
          newMap.set(userId, event.streams[0]);
          return newMap;
        });
      };

      if (localStreamRef.current) {
        const tracks = localStreamRef.current.getTracks();
        tracks.forEach((track) => {
          pc.addTrack(track, localStreamRef.current!);
        });
      }

      peerConnections.current.set(userId, pc);
      return pc;
    },
    [activeSocket, iceServers],
  );

  const getMediaStream = React.useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);
      localStreamRef.current = stream;
      cameraStreamRef.current = stream;
      return stream;
    } catch (error) {
      console.error("Error accessing media devices:", error);
      toast.error("Failed to access camera/microphone");
      return null;
    }
  }, []);

  const processIceQueue = React.useCallback(async (userId: string) => {
    const pc = peerConnections.current.get(userId);
    if (!pc || !pc.remoteDescription) return;

    const queue = iceCandidatesQueues.current.get(userId) || [];
    while (queue.length > 0) {
      const candidate = queue.shift();
      if (candidate) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) {
          console.error(
            `Error processing queued ice candidate for ${userId}`,
            e,
          );
        }
      }
    }
    iceCandidatesQueues.current.set(userId, []);
  }, []);

  const handleUserJoined = React.useCallback(
    async (userId: string) => {
      await new Promise((resolve) => setTimeout(resolve, 100));

      try {
        const pc = await createPeerConnection(userId);
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        activeSocket?.emit("offer", {
          roomId: currentRoomId.current,
          offer,
          userData: localUserInfoRef.current,
          targetUserId: userId,
        });
      } catch (error) {
        console.error("WebRTC Error in handleUserJoined:", error);
      }
    },
    [activeSocket, createPeerConnection],
  );

  const handleReceiveOffer = React.useCallback(
    async (payload: {
      offer: RTCSessionDescriptionInit;
      userData?: { name: string; image?: string };
      fromUserId: string;
    }) => {
      const { offer, userData, fromUserId } = payload;
      if (userData) {
        setRemoteUsers((prev) => {
          const newMap = new Map(prev);
          newMap.set(fromUserId, userData);
          return newMap;
        });
      }

      const pc =
        peerConnections.current.get(fromUserId) ||
        (await createPeerConnection(fromUserId));
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      await processIceQueue(fromUserId);

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      activeSocket?.emit("answer", {
        roomId: currentRoomId.current,
        answer,
        userData: localUserInfoRef.current,
        targetUserId: fromUserId,
      });
    },
    [activeSocket, createPeerConnection, processIceQueue],
  );

  const handleReceiveAnswer = React.useCallback(
    async (payload: {
      answer: RTCSessionDescriptionInit;
      userData?: { name: string; image?: string };
      fromUserId: string;
    }) => {
      const { answer, userData, fromUserId } = payload;
      if (userData) {
        setRemoteUsers((prev) => {
          const newMap = new Map(prev);
          newMap.set(fromUserId, userData);
          return newMap;
        });
      }

      const pc = peerConnections.current.get(fromUserId);
      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
        await processIceQueue(fromUserId);
      }
    },
    [processIceQueue],
  );

  const handleNewIceCandidate = React.useCallback(
    async (payload: { candidate: RTCIceCandidateInit; fromUserId: string }) => {
      const { candidate, fromUserId } = payload;
      const pc = peerConnections.current.get(fromUserId);
      if (pc && pc.remoteDescription) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) {
          console.error("Error adding received ice candidate", e);
        }
      } else {
        if (!iceCandidatesQueues.current.has(fromUserId)) {
          iceCandidatesQueues.current.set(fromUserId, []);
        }
        iceCandidatesQueues.current.get(fromUserId)!.push(candidate);
      }
    },
    [],
  );

  const handleRemoteEndCall = React.useCallback(() => {
    toast.info("The other party has ended the call.");
    closeCall();
  }, [closeCall]);

  const handleParticipantWaiting = useCallback((data: WaitingParticipant) => {
    setWaitingParticipants((prev) => {
      if (prev.find((p) => p.socketId === data.socketId)) return prev;
      return [...prev, data];
    });
    toast.info(`${data.name} is requesting to join.`);
  }, []);

  const handleParticipantAdmitted = useCallback(
    async (data: { roomId: string }) => {
      setCallStatus("in-call");
      toast.success("You have been admitted to the call!");

      activeSocket?.emit("join_call", {
        roomId: data.roomId,
        userId: currentUser?._id || "guest",
        isHost: false,
      });
    },
    [activeSocket, currentUser],
  );

  const handleParticipantDenied = useCallback(() => {
    setCallStatus("denied");
    toast.error("Your request to join was denied.");
  }, []);

  const handleNewMessage = useCallback((data: ChatMessage) => {
    setChatMessages((prev) => [
      ...prev,
      { ...data, timestamp: new Date(data.timestamp) },
    ]);
  }, []);

  useEffect(() => {
    if (!activeSocket) return;

    const handleJoined = (userId: string) => handleUserJoined(userId);

    activeSocket.on("user_joined", handleJoined);
    activeSocket.on("offer", handleReceiveOffer);
    activeSocket.on("answer", handleReceiveAnswer);
    activeSocket.on("ice_candidate", handleNewIceCandidate);
    activeSocket.on("call_ended", handleRemoteEndCall);

    activeSocket.on("participant_waiting", handleParticipantWaiting);
    activeSocket.on("participant_admitted", handleParticipantAdmitted);
    activeSocket.on("participant_denied", handleParticipantDenied);
    activeSocket.on("new_message", handleNewMessage);

    return () => {
      activeSocket.off("user_joined", handleJoined);
      activeSocket.off("offer", handleReceiveOffer);
      activeSocket.off("answer", handleReceiveAnswer);
      activeSocket.off("ice_candidate", handleNewIceCandidate);
      activeSocket.off("call_ended", handleRemoteEndCall);
      activeSocket.off("participant_waiting", handleParticipantWaiting);
      activeSocket.off("participant_admitted", handleParticipantAdmitted);
      activeSocket.off("participant_denied", handleParticipantDenied);
      activeSocket.off("new_message", handleNewMessage);
    };
  }, [
    activeSocket,
    handleUserJoined,
    handleReceiveOffer,
    handleReceiveAnswer,
    handleNewIceCandidate,
    handleRemoteEndCall,
    handleParticipantWaiting,
    handleParticipantAdmitted,
    handleParticipantDenied,
    handleNewMessage,
  ]);

  const startCall = async (
    roomId: string,
    _recipientId: string,
    userInfo: { name: string; image?: string },
    interviewDetails?: { jobTitle: string; interviewDate: string },
  ) => {
    currentRoomId.current = roomId;
    setLocalUserInfo(userInfo);
    localUserInfoRef.current = userInfo;
    if (interviewDetails) setInterviewDetails(interviewDetails);

    const stream = await getMediaStream();
    if (!stream) return;

    setIsCallActive(true);
    setCallStatus("in-call");
    activeSocket?.emit("join_call", {
      roomId,
      userId: currentUser?._id,
      isHost: true,
    });
  };

  const joinCall = async (
    roomId: string,
    userInfo: { name: string; image?: string },
    interviewDetails?: { jobTitle: string; interviewDate: string },
  ) => {
    currentRoomId.current = roomId;
    setLocalUserInfo(userInfo);
    if (interviewDetails) setInterviewDetails(interviewDetails);

    const stream = await getMediaStream();
    if (!stream) return;

    setIsCallActive(true);
    setCallStatus("in-call");
    activeSocket?.emit("join_call", {
      roomId,
      userId: currentUser?._id,
      isHost: false,
    });
  };

  const requestJoin = async (
    roomId: string,
    userInfo: { name: string; image?: string },
    userType: string,
  ) => {
    currentRoomId.current = roomId;
    setLocalUserInfo(userInfo);
    localUserInfoRef.current = userInfo;

    const stream = await getMediaStream();
    if (!stream) return;

    setIsCallActive(true);
    setCallStatus("waiting");

    activeSocket?.emit("request_to_join", {
      roomId,
      userId: currentUser?._id || "guest-" + Date.now(),
      name: userInfo.name,
      userType,
    });
  };

  const admitParticipant = (socketId: string) => {
    if (currentRoomId.current) {
      activeSocket?.emit("admit_participant", {
        socketId,
        roomId: currentRoomId.current,
      });
      setWaitingParticipants((prev) =>
        prev.filter((p) => p.socketId !== socketId),
      );
    }
  };

  const denyParticipant = (socketId: string) => {
    if (currentRoomId.current) {
      activeSocket?.emit("deny_participant", {
        socketId,
        roomId: currentRoomId.current,
      });
      setWaitingParticipants((prev) =>
        prev.filter((p) => p.socketId !== socketId),
      );
    }
  };

  const sendMessage = (text: string) => {
    if (!currentRoomId.current || !text.trim()) return;
    const messageData = {
      roomId: currentRoomId.current,
      message: text,
      sender: localUserInfo?.name || "Me",
    };
    activeSocket?.emit("group_message", messageData);

    setChatMessages((prev) => [
      ...prev,
      {
        sender: "Me",
        message: text,
        timestamp: new Date(),
        isLocal: true,
      },
    ]);
  };

  const cancelJoinRequest = () => {
    closeCall();
  };

  const endCall = () => {
    if (currentRoomId.current && callStatus === "in-call") {
      activeSocket?.emit("end_call", {
        roomId: currentRoomId.current,
        userId: currentUser?._id,
      });
      endVideoCall(currentRoomId.current);
    }
    closeCall();
  };

  const toggleAudio = () => {
    if (localStream) {
      const enabled = !isAudioEnabled;
      localStream
        .getAudioTracks()
        .forEach((track) => (track.enabled = enabled));
      setIsAudioEnabled(enabled);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const enabled = !isVideoEnabled;
      localStream
        .getVideoTracks()
        .forEach((track) => (track.enabled = enabled));
      setIsVideoEnabled(enabled);
    }
  };

  const stopScreenSharing = async () => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((t) => t.stop());
      screenStreamRef.current = null;
    }

    if (cameraStreamRef.current) {
      const videoTrack = cameraStreamRef.current.getVideoTracks()[0];

      if (peerConnections.current.size > 0) {
        peerConnections.current.forEach(async (pc) => {
          const senders = pc.getSenders();
          const sender = senders.find((s) => s.track?.kind === "video");
          if (sender) {
            await sender.replaceTrack(videoTrack);
          }
        });
      }
      setLocalStream(cameraStreamRef.current);
    }

    setIsScreenSharing(false);
  };

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      await stopScreenSharing();
    } else {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        const screenTrack = stream.getVideoTracks()[0];

        screenTrack.onended = () => {
          stopScreenSharing();
        };

        screenStreamRef.current = stream;

        if (peerConnections.current.size > 0) {
          peerConnections.current.forEach(async (pc) => {
            const senders = pc.getSenders();
            const sender = senders.find((s) => s.track?.kind === "video");
            if (sender) {
              await sender.replaceTrack(screenTrack);
            }
          });
        }

        if (cameraStreamRef.current) {
          const newStream = new MediaStream([
            screenTrack,
            ...cameraStreamRef.current.getAudioTracks(),
          ]);
          setLocalStream(newStream);
        }

        setIsScreenSharing(true);
      } catch (e) {
        console.error("ScreenShare Error:", e);
      }
    }
  };

  const handleUserLeft = React.useCallback((data: { userId: string }) => {
    const pc = peerConnections.current.get(data.userId);
    if (pc) {
      pc.close();
      peerConnections.current.delete(data.userId);
    }
    setRemoteStreams((prev) => {
      const newMap = new Map(prev);
      newMap.delete(data.userId);
      return newMap;
    });
    setRemoteUsers((prev) => {
      const newMap = new Map(prev);
      newMap.delete(data.userId);
      return newMap;
    });
  }, []);

  useEffect(() => {
    if (!activeSocket) return;

    activeSocket.on("user_left", handleUserLeft);
    activeSocket.on("call_ended", handleUserLeft);

    return () => {
      activeSocket.off("user_left", handleUserLeft);
      activeSocket.off("call_ended", handleUserLeft);
    };
  }, [activeSocket, handleUserLeft]);

  const acceptCall = () => {
    if (incomingCall) {
      joinCall(incomingCall.roomId, { name: currentUser?.name || "User" });
    }
    setIncomingCall(null);
  };

  const rejectCall = () => {
    setIncomingCall(null);
  };

  return (
    <VideoCallContext.Provider
      value={{
        localStream,
        remoteStreams,
        isCallActive,
        startCall,
        joinCall,
        requestJoin,
        endCall,
        cancelJoinRequest,
        toggleAudio,
        toggleVideo,
        toggleScreenShare,
        isAudioEnabled,
        isVideoEnabled,
        isScreenSharing,
        incomingCall,
        acceptCall,
        rejectCall,
        localUserInfo,
        remoteUsers,
        interviewDetails,
        callStatus,
        waitingParticipants,
        admitParticipant,
        denyParticipant,
        chatMessages,
        sendMessage,
      }}
    >
      {children}
    </VideoCallContext.Provider>
  );
};

export const useVideoCall = () => {
  const context = useContext(VideoCallContext);
  if (!context) {
    throw new Error("useVideoCall must be used within a VideoCallProvider");
  }
  return context;
};
