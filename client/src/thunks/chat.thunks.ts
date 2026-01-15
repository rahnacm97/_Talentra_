import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createChatApi,
  getUserChatsApi,
  sendMessageApi,
  getChatMessagesApi,
  markMessagesAsReadApi,
  deleteChatApi,
} from "../features/chat/chatApi";
import type { CreateChatPayload, SendMessagePayload } from "../types/chat/chat";

//Initiating chat
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
//Fetching conversations
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
//Message send
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
//Fetch messages
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
//Mark as read
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
//Delete chat
export const deleteChat = createAsyncThunk(
  "chat/deleteChat",
  async (chatId: string, { rejectWithValue }) => {
    try {
      await deleteChatApi(chatId);
      return chatId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete chat",
      );
    }
  },
);
