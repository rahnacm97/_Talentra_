import { api } from "../../api/api";
import { API_ROUTES } from "../../shared/constants/constants";

export const fetchMyOffersApi = (params: {
  search?: string;
  page?: number;
  limit?: number;
  jobType?: string;
  sortBy?: string;
  order?: string;
}) => {
  return api.get(API_ROUTES.OFFERS.MY_OFFERS, {
    params,
  });
};
