import { api } from "../../api/api";
import { API_ROUTES } from "../../shared/constants/constants";
import type {
  Feedback,
  FeedbackCreateRequest,
  FeedbackUpdateRequest,
} from "../../types/feedback/feedback.types";
//Feedback submission
export const submitFeedbackApi = async (
  data: FeedbackCreateRequest,
): Promise<Feedback> => {
  const response = await api.post<{ data: Feedback }>(
    API_ROUTES.FEEDBACK.BASE,
    data,
  );
  return response.data.data;
};
//Fetch public feedback
export const fetchPublicFeedbackApi = async (): Promise<Feedback[]> => {
  const response = await api.get<{ data: Feedback[] }>(
    API_ROUTES.FEEDBACK.PUBLIC,
  );
  return response.data.data;
};
//fetch featured feedback
export const fetchFeaturedFeedbackApi = async (): Promise<Feedback[]> => {
  const response = await api.get<{ data: Feedback[] }>(
    API_ROUTES.FEEDBACK.FEATURED,
  );
  return response.data.data;
};
//Fetch all feedback
export const fetchAdminFeedbackApi = async (
  page = 1,
  limit = 10,
  search = "",
): Promise<{ data: Feedback[]; total: number }> => {
  const response = await api.get<{ data: Feedback[]; total: number }>(
    `${API_ROUTES.FEEDBACK.ADMIN}?page=${page}&limit=${limit}${search ? `&search=${search}` : ""}`,
  );
  return response.data;
};
//Update feedback
export const updateFeedbackApi = async (
  id: string,
  data: FeedbackUpdateRequest,
): Promise<Feedback> => {
  const response = await api.patch<{ data: Feedback }>(
    API_ROUTES.FEEDBACK.ADMIN_BY_ID(id),
    data,
  );
  return response.data.data;
};
//Delete feedback
export const deleteFeedbackApi = async (id: string): Promise<void> => {
  await api.delete(API_ROUTES.FEEDBACK.ADMIN_BY_ID(id));
};
