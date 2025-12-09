import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getSocket } from "../socket/socket";
import { logout } from "../features/auth/authSlice";

export const useSocketAuth = (userId: string | undefined) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const socket = getSocket();

    if (!userId || !socket) return;

    const handleUserBlocked = (data: {
      message: string;
      timestamp: string;
    }) => {
      console.log("Received user:blocked event", data);

      dispatch(logout());

      toast.error(data.message || "Your account has been blocked by admin");

      navigate("/login", { replace: true });
    };

    const handleUserUnblocked = (data: {
      message: string;
      timestamp: string;
    }) => {
      console.log("Received user:unblocked event", data);
      toast.success(data.message || "Your account has been unblocked");
    };

    socket.on("user:blocked", handleUserBlocked);
    socket.on("user:unblocked", handleUserUnblocked);

    return () => {
      socket.off("user:blocked", handleUserBlocked);
      socket.off("user:unblocked", handleUserUnblocked);
    };
  }, [userId, dispatch, navigate]);
};
