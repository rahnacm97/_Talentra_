import { api } from "../../api/api";
import { API_ROUTES } from "../../shared/constants/constants";
import type {
  IChat,
  IMessage,
  CreateChatPayload,
  SendMessagePayload,
} from "../../types/chat/chat";

// Initiate Caht
export const createChatApi = async (
  payload: CreateChatPayload,
): Promise<IChat> => {
  const response = await api.post(API_ROUTES.CHAT.CREATE, payload);
  return response.data.data;
};

// Fetch chat
export const getUserChatsApi = async (): Promise<IChat[]> => {
  const response = await api.get(API_ROUTES.CHAT.MY_CHATS);
  return response.data.data;
};

// Sending message
export const sendMessageApi = async (
  payload: SendMessagePayload,
): Promise<IMessage> => {
  const response = await api.post(API_ROUTES.CHAT.MESSAGE, payload);
  return response.data.data;
};

//Get messages
export const getChatMessagesApi = async (
  chatId: string,
): Promise<IMessage[]> => {
  const url = `${API_ROUTES.CHAT.BASE}/${chatId}/messages`;
  const response = await api.get(url);
  return response.data.data;
};

//Mark message as read
export const markMessagesAsReadApi = async (chatId: string): Promise<void> => {
  const url = `${API_ROUTES.CHAT.BASE}/${chatId}/read`;
  await api.put(url);
};
