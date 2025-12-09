import { useEffect } from "react";
import { useAppDispatch } from "../hooks/hooks";
import { getSocket } from "../socket/socket";
import { addNotification } from "../features/notification/notificationSlice";
import { fetchNotificationStats } from "../thunks/notification.thunk";
import { toast } from "react-toastify";
import type { Notification } from "../types/notification/notification.types";

export const useNotifications = () => {
  const dispatch = useAppDispatch();
  const socket = getSocket();

  useEffect(() => {
    if (!socket) return;

    const handleNotification = (notification: Notification) => {
      dispatch(addNotification(notification));

      toast.info(notification.title, {
        position: "top-right",
        autoClose: 3000,
      });

      dispatch(fetchNotificationStats());
    };

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
    };
  }, [socket, dispatch]);
};
