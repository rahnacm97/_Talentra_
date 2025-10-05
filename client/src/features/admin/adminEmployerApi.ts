import api from "../../api/api"; 
import type { EmployerResponseDTO } from "../../types/admin/admin.employer.types";

interface GetAllEmployersParams {
  page: number;
  limit: number;
  search?: string;
}

interface GetAllEmployersResponse {
  data: EmployerResponseDTO[];
  total: number;
}

export const getAllEmployersApi = async (params: GetAllEmployersParams): Promise<GetAllEmployersResponse> => {
  const response = await api.get("/admin/employers", { params });
  return response.data;
};

export const blockUnblockEmployerApi = async (employerId: string, block: boolean): Promise<EmployerResponseDTO> => {
  const response = await api.post("/admin/employers/block", { employerId, block });
  return response.data.employer;
};
