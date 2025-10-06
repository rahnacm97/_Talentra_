import { adminApi } from "../../api/api";
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

export const getAllEmployersApi = async (
  params: GetAllEmployersParams,
): Promise<GetAllEmployersResponse> => {
  const response = await adminApi.get("/admin/employers", { params });
  return response.data;
};

// export const blockUnblockEmployerApi = async (
//   employerId: string,
//   block: boolean
// ): Promise<{ employer: EmployerResponseDTO; message: string }> => {
//   const response = await adminApi.patch(`/admin/candidates/block-unblock`, {
//     employerId,
//     block,
//   });
//   console.log("Access Token:", localStorage.getItem("adminAccessToken"));
//   return response.data;
// };

export const blockUnblockEmployerApi = async (
  employerId: string,
  block: boolean
): Promise<{ employer: EmployerResponseDTO; message: string }> => {
  const response = await adminApi.patch(`/admin/employers/block-unblock`, {
    employerId,
    block,
  });
  console.log("Access Token:", localStorage.getItem("adminAccessToken"));
  return response.data;
};

