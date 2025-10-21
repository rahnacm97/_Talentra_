import { api } from "../../api/api";
import type { IEmployer } from "../../types/employer/employer.types";
import { API_ROUTES } from "../../shared/constants";

export const getEmployerProfileApi = async (
  employerId: string,
): Promise<IEmployer> => {
  const response = await api.get(API_ROUTES.EMPLOYER.PROFILE(employerId));
  return response.data.data;
};
