import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../app/store";
import {
  getUserChats,
  getChatMessages,
  sendMessage,
  markAsRead,
  initiateChat,
  deleteChat,
} from "../../thunks/chat.thunks";
import {
  setActiveChat,
  addMessage,
  incrementUnreadCount,
  clearUnreadCount,
  updateUserOnlineStatus,
  removeChat,
} from "../../features/chat/chatSlice";
import { Send, Search, User, Trash2 } from "lucide-react";
import type { IMessage } from "../../types/chat/chat";
import { getSocket } from "../../socket/socket";
import DeleteChatModal from "../../components/common/chat/DeleteChatModal";
import { toast } from "react-toastify";

const Chat: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { chats, activeChat, messages, loading } = useSelector(
    (state: RootState) => state.chat,
  );

  const [inputText, setInputText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Socket listeners
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleReceiveMessage = (message: IMessage) => {
      if (activeChat && message.chatId === activeChat.id) {
        dispatch(addMessage(message));
        dispatch(markAsRead(activeChat.id));
      } else {
        dispatch(incrementUnreadCount(message.chatId));
      }
    };

    const handleNotification = (data: any) => {
      console.log("Notification received in chat:", data);
    };

    const handleUserOnline = (userId: string) => {
      dispatch(updateUserOnlineStatus({ userId, isOnline: true }));
    };

    const handleUserOffline = (userId: string) => {
      dispatch(updateUserOnlineStatus({ userId, isOnline: false }));
    };

    const handleChatDeleted = (chatId: string) => {
      dispatch(removeChat(chatId));
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("notification", handleNotification);
    socket.on("user_online", handleUserOnline);
    socket.on("user_offline", handleUserOffline);
    socket.on("chat_deleted", handleChatDeleted);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("notification", handleNotification);
      socket.off("user_online", handleUserOnline);
      socket.off("user_offline", handleUserOffline);
      socket.off("chat_deleted", handleChatDeleted);
    };
  }, [dispatch, activeChat?.id]);

  const location = useLocation();
  const initState = location.state as {
    candidateId?: string;
    applicationId?: string;
    jobId?: string;
    employerId?: string;
  } | null;

  useEffect(() => {
    dispatch(getUserChats());
  }, [dispatch]);

  useEffect(() => {
    if (
      initState &&
      initState.candidateId &&
      initState.applicationId &&
      initState.jobId
    ) {
      dispatch(
        initiateChat({
          candidateId: initState.candidateId,
          applicationId: initState.applicationId,
          jobId: initState.jobId,
        }),
      );
      window.history.replaceState({}, document.title);
    }
  }, [initState, dispatch, user?._id]);

  useEffect(() => {
    if (activeChat) {
      dispatch(getChatMessages(activeChat.id));
      dispatch(markAsRead(activeChat.id));
      dispatch(clearUnreadCount(activeChat.id));

      const socket = getSocket();
      if (socket) {
        socket.emit("join_chat", activeChat.id);
      }
    }

    return () => {
      if (activeChat) {
        const socket = getSocket();
        if (socket) {
          socket.emit("leave_chat", activeChat.id);
        }
      }
    };
  }, [activeChat, dispatch]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChat || !user) return;

    const payload = {
      chatId: activeChat.id,
      content: inputText,
      senderId: user._id,
      senderRole: user.role,
    };

    dispatch(sendMessage(payload));
    setInputText("");
  };

  const handleDeleteConfirm = async () => {
    if (!activeChat) return;
    try {
      await dispatch(deleteChat(activeChat.id)).unwrap();
      toast.success("Conversation deleted successfully");
      setIsDeleteModalOpen(false);
    } catch (error: any) {
      toast.error(error || "Failed to delete conversation");
    }
  };

  const filteredChats = Array.isArray(chats)
    ? chats.filter((chat) => {
        const name =
          user?.role === "Employer" ? chat.candidateName : chat.employerName;
        return name?.toLowerCase().includes(searchTerm.toLowerCase());
      })
    : [];

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex flex-1 overflow-hidden">
        {/* Chat List Sidebar */}
        <div className="md:block w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredChats.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No conversations found
              </div>
            ) : (
              filteredChats.map((chat) => {
                const displayName =
                  user?.role === "Employer"
                    ? chat.candidateName || "Candidate"
                    : chat.employerName || "Employer";
                const displayImage = chat.avatar;

                const isActive = activeChat?.id === chat.id;

                return (
                  <div
                    key={chat.id}
                    onClick={() => dispatch(setActiveChat(chat))}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      isActive ? "bg-blue-50 border-r-4 border-blue-500" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        {displayImage ? (
                          <img
                            src={displayImage}
                            alt="Avatar"
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="bg-blue-100 p-2 rounded-full">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                        )}
                        {chat.isOnline && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-gray-800 truncate">
                            {displayName}
                          </h3>
                          {chat.lastMessageAt && (
                            <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                              {new Date(chat.lastMessageAt).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </span>
                          )}
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-sm text-gray-500 truncate pr-2">
                            {chat.lastMessage || "Start a conversation"}
                          </p>
                          {/* Unread Badge */}
                          {chat.unreadCount && chat.unreadCount > 0 ? (
                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[1.25rem] text-center">
                              {chat.unreadCount}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {activeChat.avatar ? (
                      <img
                        src={activeChat.avatar}
                        alt="Avatar"
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="bg-blue-600 p-2 rounded-full text-white">
                        <User className="h-5 w-5" />
                      </div>
                    )}
                    {activeChat.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">
                      {user?.role === "Employer"
                        ? activeChat.candidateName || "Candidate"
                        : activeChat.employerName || "Employer"}
                    </h3>
                    {activeChat.isOnline ? (
                      <span className="text-xs text-green-500 flex items-center gap-1">
                        Online
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">Offline</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                  title="Delete Conversation"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
                {messages.map((msg, idx) => {
                  const isMe = msg.senderId === user?._id;
                  return (
                    <div
                      key={msg.id || idx}
                      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-2xl shadow-sm ${
                          isMe
                            ? "bg-blue-600 text-white rounded-br-none"
                            : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                        }`}
                      >
                        <p>{msg.content}</p>
                        <div
                          className={`text-xs mt-1 text-right ${
                            isMe ? "text-blue-200" : "text-gray-400"
                          }`}
                        >
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={scrollRef} />
              </div>

              <form
                onSubmit={handleSendMessage}
                className="p-4 border-t border-gray-200 bg-white"
              >
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim() || loading}
                    className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <div className="bg-gray-100 p-6 rounded-full mb-4">
                <User className="h-12 w-12 text-gray-300" />
              </div>
              <p className="text-lg">Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>

      <DeleteChatModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        chatPartnerName={
          (user?.role === "Employer"
            ? activeChat?.candidateName
            : activeChat?.employerName) || "User"
        }
        loading={loading}
      />
    </div>
  );
};

export default Chat;
