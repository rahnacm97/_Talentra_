import React, { useEffect, useRef, useState } from "react";
import { useVideoCall } from "../../../contexts/VideoCallContext";
import {
  Camera,
  CameraOff,
  Mic,
  MicOff,
  PhoneOff,
  Monitor,
  MonitorOff,
  MessageSquare,
  Users,
  X,
  Send,
  CheckCircle,
  XCircle,
} from "lucide-react";

const RemoteVideo: React.FC<{ stream: MediaStream; name: string }> = ({
  stream,
  name,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="w-full h-full relative group bg-black">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-6 left-6 text-white text-lg font-bold bg-black/40 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {name}
      </div>
    </div>
  );
};

export const VideoCallWindow: React.FC = () => {
  const {
    localStream,
    remoteStreams,
    isCallActive,
    endCall,
    cancelJoinRequest,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
    isAudioEnabled,
    isVideoEnabled,
    isScreenSharing,
    localUserInfo,
    remoteUsers,
    interviewDetails,
    callStatus,
    waitingParticipants,
    admitParticipant,
    denyParticipant,
    chatMessages,
    sendMessage,
  } = useVideoCall();

  const setLocalVideoRef = React.useCallback(
    (node: HTMLVideoElement | null) => {
      if (node && localStream) {
        node.srcObject = localStream;
        localVideoRef.current = node;
      }
    },
    [localStream],
  );

  const localVideoRef = useRef<HTMLVideoElement | null>(null);

  const [showChat, setShowChat] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim()) {
      sendMessage(messageInput);
      setMessageInput("");
    }
  };

  const participants = React.useMemo(() => {
    const list = [];
    // Local user always first
    list.push({
      id: "local",
      stream: localStream,
      name: localUserInfo?.name || "You",
      isLocal: true,
    });

    // Remote users
    Array.from(remoteStreams.entries()).forEach(([userId, stream]) => {
      list.push({
        id: userId,
        stream,
        name: remoteUsers.get(userId)?.name || "Remote User",
        isLocal: false,
      });
    });

    return list;
  }, [localStream, remoteStreams, localUserInfo, remoteUsers]);

  if (!isCallActive) return null;

  if (callStatus === "waiting") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-95">
        <div className="text-center text-white space-y-6 p-8 bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl max-w-md w-full">
          <div className="relative">
            <div className="w-20 h-20 mx-auto rounded-full bg-indigo-600/20 flex items-center justify-center animate-pulse">
              <div className="w-16 h-16 rounded-full bg-indigo-600/40 flex items-center justify-center">
                <Users className="w-8 h-8 text-indigo-400" />
              </div>
            </div>
            <div className="absolute top-0 right-0 left-0 bottom-0 animate-ping opacity-20 rounded-full bg-indigo-500"></div>
          </div>
          <h2 className="text-2xl font-bold">Waiting to Join</h2>
          <p className="text-gray-400">
            Please wait while the host admits you to the meeting.
          </p>
          <div className="bg-gray-800/50 p-4 rounded-xl">
            <p className="text-sm text-gray-500 mb-1">Joining as</p>
            <p className="font-semibold text-lg">{localUserInfo?.name}</p>
          </div>
          <button
            onClick={cancelJoinRequest}
            className="px-6 py-2 bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded-lg transition-colors text-sm font-medium"
          >
            Cancel Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-300">
      <div className="relative w-full h-full bg-gray-900 overflow-hidden shadow-2xl flex">
        {/* Main Video Area */}
        <div className="flex-1 relative bg-black flex flex-col">
            <div className="flex-1 min-h-0 relative bg-black flex items-center justify-center p-2 overflow-hidden">
              <div
                className={`w-full h-full grid gap-2 ${
                  participants.length === 1
                    ? "grid-cols-1"
                    : participants.length === 2
                      ? "grid-cols-1 md:grid-cols-2"
                      : "grid-cols-2"
                }`}
              >
                {participants.map((p) => (
                  <div
                    key={p.id}
                    className="relative group bg-gray-900 rounded-xl overflow-hidden border border-white/5 shadow-2xl min-h-[150px] h-full"
                  >
                    {p.isLocal ? (
                      <video
                        ref={setLocalVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover transform scale-x-[-1]"
                      />
                    ) : (
                      <RemoteVideo stream={p.stream!} name={p.name} />
                    )}

                    <div className="absolute bottom-4 left-4 text-white text-sm font-bold bg-black/40 px-3 py-1.5 rounded-lg backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                      {p.name} {p.isLocal ? "(You)" : ""}
                    </div>

                    {p.isLocal && remoteStreams.size === 0 && (
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-3">
                        <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-white text-xs font-semibold tracking-wide whitespace-nowrap">
                          Waiting for others to join...
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>


            {/* Header Info */}
            {interviewDetails && (
              <div className="absolute top-6 left-6 z-10">
                <div className="bg-gray-900/80 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 shadow-lg">
                  <h3 className="text-white font-bold text-sm tracking-wide">
                    {interviewDetails.jobTitle}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">
                      Live Interview
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Waiting Participants Toast - Host View */}
            {waitingParticipants.length > 0 && (
              <div className="absolute top-20 left-6 z-30 space-y-2">
                {waitingParticipants.map((p) => (
                  <div
                    key={p.socketId}
                    className="bg-gray-900/95 backdrop-blur-md text-white p-4 rounded-xl border border-indigo-500/50 shadow-xl w-72 animate-slide-in-right"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-bold text-sm">{p.name}</p>
                        <p className="text-xs text-indigo-300">
                          wants to join ({p.userType})
                        </p>
                      </div>
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => admitParticipant(p.socketId)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-1"
                      >
                        <CheckCircle className="w-3 h-3" /> Admit
                      </button>
                      <button
                        onClick={() => denyParticipant(p.socketId)}
                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-xs px-3 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-1"
                      >
                        <XCircle className="w-3 h-3" /> Deny
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          {/* Controls Bar */}
          <div className="h-20 bg-gray-900 border-t border-gray-800 flex items-center justify-center gap-4 px-6 flex-shrink-0">
            <button
              onClick={toggleAudio}
              className={`p-4 rounded-full transition-all duration-200 ${
                isAudioEnabled
                  ? "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700"
                  : "bg-red-500/90 text-white hover:bg-red-600 border border-red-500"
              }`}
              title={isAudioEnabled ? "Mute" : "Unmute"}
            >
              {isAudioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
            </button>

            <button
              onClick={toggleVideo}
              className={`p-4 rounded-full transition-all duration-200 ${
                isVideoEnabled
                  ? "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700"
                  : "bg-red-500/90 text-white hover:bg-red-600 border border-red-500"
              }`}
              title={isVideoEnabled ? "Turn Off Camera" : "Turn On Camera"}
            >
              {isVideoEnabled ? <Camera size={20} /> : <CameraOff size={20} />}
            </button>

            <button
              onClick={toggleScreenShare}
              className={`p-4 rounded-full transition-all duration-200 ${
                isScreenSharing
                  ? "bg-indigo-600 text-white hover:bg-indigo-700 border border-indigo-500"
                  : "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700"
              }`}
              title="Share Screen"
            >
              {isScreenSharing ? (
                <MonitorOff size={20} />
              ) : (
                <Monitor size={20} />
              )}
            </button>

            <div className="w-px h-8 bg-gray-700 mx-2"></div>

            <button
              onClick={() => setShowChat(!showChat)}
              className={`p-4 rounded-full transition-all duration-200 relative ${
                showChat
                  ? "bg-indigo-600 text-white border border-indigo-500"
                  : "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700"
              }`}
              title="Chat"
            >
              <MessageSquare size={20} />
              {!showChat && chatMessages.length > 0 && (
                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-gray-900"></span>
              )}
            </button>

            <button
              onClick={endCall}
              className="p-4 rounded-full bg-red-600 text-white hover:bg-red-700 transition-all duration-200 shadow-lg shadow-red-900/20 border border-red-500"
              title="Leave Call"
            >
              <PhoneOff size={20} />
            </button>
          </div>
        </div>

        {/* Chat Sidebar */}
        {showChat && (
          <div className="w-80 bg-gray-900 border-l border-gray-800 flex flex-col transition-all duration-300 ease-in-out">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-500" />
                Meeting Chat
              </h3>
              <button
                onClick={() => setShowChat(false)}
                className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-800 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {chatMessages.length === 0 ? (
                <div className="text-center text-gray-500 mt-10 text-sm">
                  <p>No messages yet.</p>
                  <p>Start the conversation!</p>
                </div>
              ) : (
                chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${
                      msg.isLocal ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`flex items-baseline gap-2 mb-1 ${
                        msg.isLocal ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      <span className="text-xs font-bold text-gray-300">
                        {msg.sender}
                      </span>
                      <span className="text-[10px] text-gray-500">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div
                      className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm ${
                        msg.isLocal
                          ? "bg-indigo-600 text-white rounded-tr-sm"
                          : "bg-gray-800 text-gray-200 rounded-tl-sm border border-gray-700"
                      }`}
                    >
                      {msg.message}
                    </div>
                  </div>
                ))
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 border-t border-gray-800 bg-gray-900">
              <form onSubmit={handleSendMessage} className="relative">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder-gray-500 transition-all"
                />
                <button
                  type="submit"
                  disabled={!messageInput.trim()}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
