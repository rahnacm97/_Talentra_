import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IChat, IMessage, ChatState } from "../../types/chat/chat";
import {
  initiateChat,
  getUserChats,
  sendMessage,
  getChatMessages,
} from "../../thunks/chat.thunks";

const initialState: ChatState = {
  chats: [],
  activeChat: null,
  messages: [],
  loading: false,
  error: null,
  messageSending: false,
};
//Chat slice
const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveChat: (state, action: PayloadAction<IChat | null>) => {
      state.activeChat = action.payload;
      state.messages = [];
    },
    addMessage: (state, action: PayloadAction<IMessage>) => {
      if (
        state.messages.some(
          (m) =>
            m.id === action.payload.id ||
            (m.createdAt === action.payload.createdAt &&
              m.content === action.payload.content),
        )
      )
        return;

      state.messages.push(action.payload);

      const chatIndex = state.chats.findIndex(
        (c) => c.id === action.payload.chatId,
      );
      if (chatIndex !== -1) {
        state.chats[chatIndex].lastMessage = action.payload.content;
        state.chats[chatIndex].lastMessageAt = action.payload.createdAt;

        const chat = state.chats.splice(chatIndex, 1)[0];
        state.chats.unshift(chat);
      }
    },
    updateChatList: (state, action: PayloadAction<IChat>) => {
      const index = state.chats.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.chats[index] = action.payload;
      } else {
        state.chats.unshift(action.payload);
      }
    },
    incrementUnreadCount: (state, action: PayloadAction<string>) => {
      const chat = state.chats.find((c) => c.id === action.payload);
      if (chat) {
        chat.unreadCount = (chat.unreadCount || 0) + 1;
      }
    },
    clearUnreadCount: (state, action: PayloadAction<string>) => {
      const chat = state.chats.find((c) => c.id === action.payload);
      if (chat) {
        chat.unreadCount = 0;
      }
    },
    updateUserOnlineStatus: (
      state,
      action: PayloadAction<{ userId: string; isOnline: boolean }>,
    ) => {
      state.chats.forEach((chat) => {
        if (
          chat.candidateId === action.payload.userId ||
          chat.employerId === action.payload.userId
        ) {
          chat.isOnline = action.payload.isOnline;
        }
      });
    },
  },
  extraReducers: (builder) => {
    // initiateChat
    builder.addCase(initiateChat.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(initiateChat.fulfilled, (state, action) => {
      state.loading = false;
      state.activeChat = action.payload;

      if (!state.chats.find((c) => c.id === action.payload.id)) {
        state.chats.unshift(action.payload);
      }
    });
    builder.addCase(initiateChat.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Get User Chats
    builder.addCase(getUserChats.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getUserChats.fulfilled, (state, action) => {
      state.loading = false;
      state.chats = action.payload;
    });
    builder.addCase(getUserChats.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // send Message
    builder.addCase(sendMessage.pending, (state) => {
      state.messageSending = true;
    });
    builder.addCase(sendMessage.fulfilled, (state, action) => {
      state.messageSending = false;

      if (!state.messages.some((m) => m.id === action.payload.id)) {
        state.messages.push(action.payload);
      }

      // Update last message in list
      const chatIndex = state.chats.findIndex(
        (c) => c.id === action.payload.chatId,
      );
      if (chatIndex !== -1) {
        state.chats[chatIndex].lastMessage = action.payload.content;
        state.chats[chatIndex].lastMessageAt = action.payload.createdAt;
        const chat = state.chats.splice(chatIndex, 1)[0];
        state.chats.unshift(chat);
      }
    });
    builder.addCase(sendMessage.rejected, (state, action) => {
      state.messageSending = false;
      state.error = action.payload as string;
    });

    // Get Chat Messages
    builder.addCase(getChatMessages.pending, () => {});
    builder.addCase(getChatMessages.fulfilled, (state, action) => {
      state.messages = action.payload;
    });
    builder.addCase(getChatMessages.rejected, (state, action) => {
      state.error = action.payload as string;
    });
  },
});

export const {
  setActiveChat,
  addMessage,
  updateChatList,
  incrementUnreadCount,
  clearUnreadCount,
  updateUserOnlineStatus,
} = chatSlice.actions;

export const selectTotalUnreadCount = (state: { chat: ChatState }) =>
  state.chat.chats.reduce((total, chat) => total + (chat.unreadCount || 0), 0);

export default chatSlice.reducer;
