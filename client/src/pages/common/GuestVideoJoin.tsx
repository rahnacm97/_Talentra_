import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useVideoCall } from "../../contexts/VideoCallContext";
import { Video, User, ArrowRight } from "lucide-react";
import { toast } from "react-toastify";

const GuestVideoJoin: React.FC = () => {
  const { roundId } = useParams<{ roundId: string; token: string }>();
  const { requestJoin, callStatus } = useVideoCall();

  const [name, setName] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    if (callStatus === "in-call" || callStatus === "admitted") {
    }
  }, [callStatus]);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !roundId) return;

    setIsJoining(true);
    try {
      await requestJoin(roundId, { name, image: "" }, "Guest");
    } catch (error) {
      console.error(error);
      toast.error("Failed to join meeting");
      setIsJoining(false);
    }
  };

  if (callStatus === "waiting") {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white p-4">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-bold mb-2">Waiting for Host</h2>
        <p className="text-gray-400">
          Please wait while the host admits you to the meeting.
        </p>
      </div>
    );
  }

  if (callStatus === "denied") {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white p-4">
        <div className="bg-red-500/10 p-4 rounded-full mb-6">
          <Video className="w-12 h-12 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-gray-400">
          The host has denied your request to join this meeting.
        </p>
      </div>
    );
  }

  if (callStatus === "in-call" || callStatus === "admitted") {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white p-4">
        <h2 className="text-2xl font-bold mb-2">You are in the meeting</h2>
        <p className="text-gray-400">Don't close this tab.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="bg-indigo-600 p-6 text-center">
          <div className="mx-auto bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
            <Video className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Join Interview</h1>
          <p className="text-indigo-100 text-sm">
            Enter your name to join the secure video call
          </p>
        </div>

        <div className="p-8">
          <form onSubmit={handleJoin} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Your Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="e.g. John Doe"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isJoining}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all ${
                isJoining ? "opacity-75 cursor-wait" : ""
              }`}
            >
              {isJoining ? (
                "Requesting to Join..."
              ) : (
                <>
                  Join Meeting <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GuestVideoJoin;
