import { api } from "../../api/api";
import type { IEmployer } from "../../types/employer/employer.types";

export const getEmployerProfileApi = async (employerId: string): Promise<IEmployer> => {
  const response = await api.get(`/employer/${employerId}`);
  return response.data;
};