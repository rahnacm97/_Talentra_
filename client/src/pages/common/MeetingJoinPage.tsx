import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { loginSuccess } from "../../features/auth/authSlice";
import { useVideoCall } from "../../contexts/VideoCallContext";
import { Loader2, AlertCircle, Video, User } from "lucide-react";
import { type MeetingData } from "../../types/interview/interview.types";
import axios from "axios";
import { toast } from "react-toastify";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

const MeetingJoinPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { joinCall, requestJoin } = useVideoCall();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [guestName, setGuestName] = useState("");
  const [meetingData, setMeetingData] = useState<MeetingData | null>(null);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.post(`${API_BASE_URL}/meeting/verify`, {
          token,
        });
        setMeetingData(response.data.data);
      } catch (err) {
        console.error(err);
        setError("Invalid or expired meeting link.");
      } finally {
        setLoading(false);
      }
    };
    if (token) verifyToken();
  }, [token]);

  const handleJoin = async () => {
    if (!meetingData) return;
    setJoining(true);

    try {
      let currentUser = user;

      if (!currentUser) {
        if (!guestName.trim()) {
          toast.error("Please enter your name");
          setJoining(false);
          return;
        }

        const response = await axios.post(
          `${API_BASE_URL}/meeting/join-guest`,
          {
            token,
            name: guestName,
          },
        );

        const { user: guestUser, accessToken } = response.data;
        dispatch(loginSuccess({ user: guestUser, accessToken }));
        currentUser = guestUser;
      }

      if (currentUser?.role === "Employer") {
        await joinCall(meetingData.interviewId, {
          name: currentUser.name,
          image: currentUser.profileImage,
        });
      } else {
        // Candidate or Guest
        await requestJoin(
          meetingData.interviewId,
          {
            name: currentUser?.name || "Guest",
            image: currentUser?.profileImage,
          },
          currentUser?.role || "Guest",
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to join meeting");
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 p-8 rounded-2xl border border-red-500/20 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">
            Access Denied
          </h2>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[100px]" />

      <div className="bg-gray-800/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl w-full max-w-md shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Video className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Video Interview
          </h1>
          <p className="text-gray-400">Ready to join the session?</p>
        </div>

        <div className="space-y-6">
          {user ? (
            <div className="bg-gray-700/50 p-4 rounded-xl flex items-center gap-4 border border-white/5">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold text-xl border-2 border-indigo-500/30">
                  {user.name.charAt(0)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-400">Joining as</p>
                <p className="text-white font-medium truncate">{user.name}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">
                Your Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
          )}

          <button
            onClick={handleJoin}
            disabled={joining}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {joining ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Joining...
              </span>
            ) : (
              "Join Meeting"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeetingJoinPage;
