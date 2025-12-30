import { api } from "../../api/api";
import { API_ROUTES } from "../../shared/constants/constants";

//Fetching all notifications
export const fetchNotificationsApi = (params?: {
  page?: number;
  limit?: number;
  isRead?: boolean;
}) => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.isRead !== undefined)
    queryParams.append("isRead", params.isRead.toString());

  const url = `${API_ROUTES.NOTIFICATIONS.BASE}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  return api.get(url);
};
//Notification status read/unread
export const getNotificationStatsApi = () =>
  api.get(`${API_ROUTES.NOTIFICATIONS.STATS}`);
//Marking read
export const markAsReadApi = (id: string) =>
  api.patch(`${API_ROUTES.NOTIFICATIONS.MARK_READ(id)}`);
//Mark all read
export const markAllAsReadApi = () =>
  api.patch(`${API_ROUTES.NOTIFICATIONS.MARK_ALL_READ}`);
//Delete notification
export const deleteNotificationApi = (id: string) =>
  api.delete(`${API_ROUTES.NOTIFICATIONS.DELETE(id)}`);
