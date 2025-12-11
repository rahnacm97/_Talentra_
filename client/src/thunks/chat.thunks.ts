import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createChatApi,
  getUserChatsApi,
  sendMessageApi,
  getChatMessagesApi,
  markMessagesAsReadApi,
} from "../features/chat/chatApi";
import type { CreateChatPayload, SendMessagePayload } from "../types/chat/chat";

export const initiateChat = createAsyncThunk(
  "chat/initiateChat",
  async (data: CreateChatPayload, { rejectWithValue }) => {
    try {
      return await createChatApi(data);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to initiate chat",
      );
    }
  },
);

export const getUserChats = createAsyncThunk(
  "chat/getUserChats",
  async (_, { rejectWithValue }) => {
    try {
      return await getUserChatsApi();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch chats",
      );
    }
  },
);

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (data: SendMessagePayload, { rejectWithValue }) => {
    try {
      return await sendMessageApi(data);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send message",
      );
    }
  },
);

export const getChatMessages = createAsyncThunk(
  "chat/getChatMessages",
  async (chatId: string, { rejectWithValue }) => {
    try {
      return await getChatMessagesApi(chatId);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch messages",
      );
    }
  },
);

export const markAsRead = createAsyncThunk(
  "chat/markAsRead",
  async (chatId: string, { rejectWithValue }) => {
    try {
      await markMessagesAsReadApi(chatId);
      return chatId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to mark as read",
      );
    }
  },
);
