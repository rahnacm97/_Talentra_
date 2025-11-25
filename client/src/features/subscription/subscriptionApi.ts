import { api } from "../../api/api";
import { API_ROUTES } from "../../shared/constants/constants";

export const createSubscriptionApi = async (planType: "monthly" | "yearly") => {
  const res = await api.post(API_ROUTES.SUBSCRIPTION.CREATE, { planType });
  return res.data;
};

export const getCurrentSubscriptionApi = async () => {
  const res = await api.get(API_ROUTES.SUBSCRIPTION.CURRENT);
  return res.data;
};

export const cancelSubscriptionApi = async () => {
  const res = await api.post(API_ROUTES.SUBSCRIPTION.CANCEL);
  return res.data;
};
