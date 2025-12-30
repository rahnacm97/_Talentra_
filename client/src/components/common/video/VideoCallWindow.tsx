import React, { useEffect, useRef } from "react";
import { useVideoCall } from "../../../contexts/VideoCallContext";
import {
  Camera,
  CameraOff,
  Mic,
  MicOff,
  PhoneOff,
  Monitor,
  MonitorOff,
} from "lucide-react";

export const VideoCallWindow: React.FC = () => {
  const {
    localStream,
    remoteStream,
    isCallActive,
    endCall,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
    isAudioEnabled,
    isVideoEnabled,
    isScreenSharing,
    localUserInfo,
    remoteUserInfo,
    interviewDetails,
  } = useVideoCall();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  if (!isCallActive) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
      <div className="relative w-full max-w-4xl h-[80vh] bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
        <div className="w-full h-full relative">
          {remoteStream ? (
            <>
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-8 left-8 text-white text-xl font-semibold bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm">
                {remoteUserInfo?.name || "Participant"}
              </div>

              {interviewDetails && (
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-indigo-600/90 to-purple-600/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-2xl border border-white/20">
                  <div className="text-center">
                    <h3 className="text-white font-bold text-lg mb-1">
                      {interviewDetails.jobTitle}
                    </h3>
                    <p className="text-indigo-100 text-sm">
                      {new Date(
                        interviewDetails.interviewDate,
                      ).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}{" "}
                      at{" "}
                      {new Date(
                        interviewDetails.interviewDate,
                      ).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-xl animate-pulse flex-col gap-4">
              <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <span>Waiting for participant...</span>
            </div>
          )}
        </div>

        <div className="absolute top-4 right-4 w-48 h-36 bg-black rounded-xl overflow-hidden shadow-lg border-2 border-gray-800 group">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover transform scale-x-[-1]"
          />

          <div className="absolute bottom-1 left-2 text-white text-xs font-medium bg-black/60 px-2 py-1 rounded truncate max-w-[80%]">
            {localUserInfo?.name || "You"}
          </div>

          <button
            onClick={() => {
              const current = localStorage.getItem("useTestStream") === "true";
              localStorage.setItem("useTestStream", (!current).toString());
              window.location.reload();
            }}
            className="absolute bottom-1 right-1 bg-gray-800/80 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
            title="Toggle Test Animation Stream (Requires Reload)"
          >
            Test Mode
          </button>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-6 bg-gray-800/80 backdrop-blur-md px-8 py-4 rounded-full shadow-xl">
          <button
            onClick={toggleAudio}
            className={`p-4 rounded-full transition-all duration-300 ${
              isAudioEnabled
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-red-500 hover:bg-red-600 text-white"
            }`}
            title={isAudioEnabled ? "Mute Audio" : "Unmute Audio"}
          >
            {isAudioEnabled ? <Mic size={24} /> : <MicOff size={24} />}
          </button>

          <button
            onClick={toggleVideo}
            className={`p-4 rounded-full transition-all duration-300 ${
              isVideoEnabled
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-red-500 hover:bg-red-600 text-white"
            }`}
            title={isVideoEnabled ? "Stop Video" : "Start Video"}
          >
            {isVideoEnabled ? <Camera size={24} /> : <CameraOff size={24} />}
          </button>

          <button
            onClick={toggleScreenShare}
            className={`p-4 rounded-full transition-all duration-300 ${
              isScreenSharing
                ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                : "bg-gray-700 hover:bg-gray-600 text-white"
            }`}
            title={isScreenSharing ? "Stop Sharing" : "Share Screen"}
          >
            {isScreenSharing ? <MonitorOff size={24} /> : <Monitor size={24} />}
          </button>

          <button
            onClick={endCall}
            className="p-4 rounded-full bg-red-600 hover:bg-red-700 text-white transition-all duration-300 shadow-lg hover:shadow-red-500/30"
            title="End Call"
          >
            <PhoneOff size={28} />
          </button>
        </div>
      </div>
    </div>
  );
};
