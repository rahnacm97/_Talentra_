import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { getSocket } from "../socket/socket";
import { endVideoCall } from "../features/videocall/videoCallApi";
import { useSelector } from "react-redux";
import { type RootState } from "../app/store";
import type { VideoCallContextType } from "../types/videocall/videocall.types";

//Context
const VideoCallContext = createContext<VideoCallContextType | undefined>(
  undefined,
);

//Provider
export const VideoCallProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
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
  const [remoteUserInfo, setRemoteUserInfo] = useState<{
    name: string;
    image?: string;
  } | null>(null);
  const [interviewDetails, setInterviewDetails] = useState<{
    jobTitle: string;
    interviewDate: string;
  } | null>(null);

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

  const peerConnection = useRef<RTCPeerConnection | null>(null);
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

  const iceCandidatesQueue = useRef<RTCIceCandidateInit[]>([]);

  const closeCall = React.useCallback(() => {
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
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
    setRemoteStream(null);
    setIsCallActive(false);
    setIsScreenSharing(false);
    setRemoteUserInfo(null);
    setLocalUserInfo(null);
    setInterviewDetails(null);
    currentRoomId.current = null;
  }, [localStream]);

  const createPeerConnection = React.useCallback(async () => {
    const pc = new RTCPeerConnection(iceServers);

    pc.onicecandidate = (event) => {
      if (event.candidate && currentRoomId.current) {
        console.log("WebRTC Sending ICE candidate");
        activeSocket?.emit("ice_candidate", {
          roomId: currentRoomId.current,
          candidate: event.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    pc.oniceconnectionstatechange = () => {
      console.log("WebRTC ICE Connection State:", pc.iceConnectionState);
    };

    pc.onsignalingstatechange = () => {
      console.log("WebRTC Signaling State:", pc.signalingState);
    };

    pc.onconnectionstatechange = () => {
      console.log("WebRTC Connection State:", pc.connectionState);
    };

    if (localStreamRef.current) {
      const tracks = localStreamRef.current.getTracks();
      console.log(
        `WebRTC Adding ${tracks.length} tracks to PC:`,
        tracks.map((t) => t.kind),
      );
      tracks.forEach((track) => {
        pc.addTrack(track, localStreamRef.current!);
      });
    } else {
      console.warn("WebRTC No local stream to add to PC!");
    }

    peerConnection.current = pc;
    console.log("WebRTC PeerConnection created successfully");
    return pc;
  }, [activeSocket, iceServers]);

  const createMockStream = React.useCallback(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const stream = canvas.captureStream(30);

    const audioCtx = new AudioContext();
    const osc = audioCtx.createOscillator();
    const dst = audioCtx.createMediaStreamDestination();
    osc.connect(dst);

    const audioTrack = dst.stream.getAudioTracks()[0];
    stream.addTrack(audioTrack);

    let x = 0;
    let speed = 2;
    const draw = () => {
      ctx.fillStyle = "#333";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";
      ctx.font = "40px Arial";
      ctx.fillText("TEST STREAM", 50, 100);

      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(x, 240, 40, 0, Math.PI * 2);
      ctx.fill();

      x += speed;
      if (x > canvas.width || x < 0) speed = -speed;

      requestAnimationFrame(draw);
    };
    draw();

    return stream;
  }, []);

  const getMediaStream = React.useCallback(async () => {
    try {
      const useTestStream = localStorage.getItem("useTestStream") === "true";

      if (useTestStream) {
        const mock = createMockStream();
        if (mock) {
          setLocalStream(mock);
          localStreamRef.current = mock;
          cameraStreamRef.current = mock;
          return mock;
        }
      }

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
      return null;
    }
  }, [createMockStream]);

  const processIceQueue = React.useCallback(async () => {
    const pc = peerConnection.current;
    if (!pc || !pc.remoteDescription) return;

    while (iceCandidatesQueue.current.length > 0) {
      const candidate = iceCandidatesQueue.current.shift();
      if (candidate) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) {
          console.error("Error processing queued ice candidate", e);
        }
      }
    }
  }, []);

  const handleUserJoined = React.useCallback(
    async (userId: string) => {
      console.log("WebRTC User joined:", userId);

      await new Promise((resolve) => setTimeout(resolve, 100));

      try {
        const pc = await createPeerConnection();
        console.log("WebRTC Creating offer...");
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        console.log("WebRTC Offer created and set as local description");

        activeSocket?.emit("offer", {
          roomId: currentRoomId.current,
          offer,
          userData: localUserInfoRef.current,
        });
        console.log("WebRTC Offer sent to room:", currentRoomId.current);
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
    }) => {
      const { offer, userData } = payload;
      if (userData) setRemoteUserInfo(userData);

      const pc = peerConnection.current || (await createPeerConnection());
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      await processIceQueue();

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      activeSocket?.emit("answer", {
        roomId: currentRoomId.current,
        answer,
        userData: localUserInfoRef.current,
      });
    },
    [activeSocket, createPeerConnection, processIceQueue],
  );

  const handleReceiveAnswer = React.useCallback(
    async (payload: {
      answer: RTCSessionDescriptionInit;
      userData?: { name: string; image?: string };
    }) => {
      const { answer, userData } = payload;
      if (userData) setRemoteUserInfo(userData);

      const pc = peerConnection.current;
      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
        await processIceQueue();
      }
    },
    [processIceQueue],
  );

  const handleNewIceCandidate = React.useCallback(
    async (candidate: RTCIceCandidateInit) => {
      const pc = peerConnection.current;
      if (pc && pc.remoteDescription) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) {
          console.error("Error adding received ice candidate", e);
        }
      } else {
        iceCandidatesQueue.current.push(candidate);
      }
    },
    [],
  );

  const handleRemoteEndCall = React.useCallback(() => {
    alert("The other party has ended the call.");
    closeCall();
  }, [closeCall]);

  useEffect(() => {
    if (!activeSocket) {
      return;
    }

    console.log(
      "WebRTC Setting up listeners for socket:",
      activeSocket.id || "connecting...",
    );

    const handleJoined = (userId: string) => {
      handleUserJoined(userId);
    };

    activeSocket.on("user_joined", handleJoined);
    activeSocket.on("offer", handleReceiveOffer);
    activeSocket.on("answer", handleReceiveAnswer);
    activeSocket.on("ice_candidate", handleNewIceCandidate);
    activeSocket.on("call_ended", handleRemoteEndCall);

    console.log("WebRTC Listeners registered on socket:", activeSocket.id);

    return () => {
      activeSocket.off("user_joined", handleJoined);
      activeSocket.off("offer", handleReceiveOffer);
      activeSocket.off("answer", handleReceiveAnswer);
      activeSocket.off("ice_candidate", handleNewIceCandidate);
      activeSocket.off("call_ended", handleRemoteEndCall);
    };
  }, [
    activeSocket,
    handleUserJoined,
    handleReceiveOffer,
    handleReceiveAnswer,
    handleNewIceCandidate,
    handleRemoteEndCall,
  ]);

  //Video call start
  const startCall = async (
    roomId: string,
    _recipientId: string,
    userInfo: { name: string; image?: string },
    interviewDetails?: { jobTitle: string; interviewDate: string },
  ) => {
    console.log("WebRTC START CALL clicked! Room:", roomId);
    currentRoomId.current = roomId;
    setLocalUserInfo(userInfo);
    localUserInfoRef.current = userInfo;
    if (interviewDetails) setInterviewDetails(interviewDetails);
    const stream = await getMediaStream();
    if (!stream) return;

    setIsCallActive(true);
    console.log(
      "WebRTC Emitting join_call to server. Room:",
      roomId,
      "User:",
      currentUser?._id,
    );
    activeSocket?.emit("join_call", { roomId, userId: currentUser?._id });
  };

  //Joining call
  const joinCall = async (
    roomId: string,
    userInfo: { name: string; image?: string },
    interviewDetails?: { jobTitle: string; interviewDate: string },
  ) => {
    console.log("WebRTC JOIN CALL clicked! Room:", roomId);
    currentRoomId.current = roomId;
    setLocalUserInfo(userInfo);
    if (interviewDetails) setInterviewDetails(interviewDetails);
    const stream = await getMediaStream();
    if (!stream) return;

    setIsCallActive(true);
    console.log(
      "WebRTC Emitting join_call to server. Room:",
      roomId,
      "User:",
      currentUser?._id,
    );
    activeSocket?.emit("join_call", { roomId, userId: currentUser?._id });
  };

  //call end
  const endCall = () => {
    if (currentRoomId.current) {
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
      localStream
        .getAudioTracks()
        .forEach((track) => (track.enabled = !track.enabled));
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream
        .getVideoTracks()
        .forEach((track) => (track.enabled = !track.enabled));
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const stopScreenSharing = async () => {
    console.log("ScreenShare Stopping screen share...");
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((t) => t.stop());
      screenStreamRef.current = null;
    }

    if (cameraStreamRef.current) {
      if (peerConnection.current) {
        const videoTrack = cameraStreamRef.current.getVideoTracks()[0];
        const senders = peerConnection.current.getSenders();
        const sender = senders.find((s) => s.track?.kind === "video");
        if (sender) {
          await sender.replaceTrack(videoTrack);
          console.log("ScreenShare Camera track restored to peer connection");
        }
      }
      setLocalStream(cameraStreamRef.current);
    }

    setIsScreenSharing(false);
  };

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      await stopScreenSharing();
    } else {
      console.log("ScreenShare Starting screen share...");
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        const screenTrack = stream.getVideoTracks()[0];

        screenTrack.onended = () => {
          console.log("ScreenShare ended via browser UI");
          stopScreenSharing();
        };

        screenStreamRef.current = stream;

        if (peerConnection.current) {
          const senders = peerConnection.current.getSenders();
          const sender = senders.find((s) => s.track?.kind === "video");
          if (sender) {
            await sender.replaceTrack(screenTrack);
            console.log("ScreenShare Screen track sent to peer connection");
          }
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
        remoteStream,
        isCallActive,
        startCall,
        joinCall,
        endCall,
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
        remoteUserInfo,
        interviewDetails,
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
