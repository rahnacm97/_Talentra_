import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllCandidatesApi,
  blockUnblockCandidateApi,
} from "../features/admin/adminCandidateApi";
import {
  getAllEmployersApi,
  blockUnblockEmployerApi,
} from "../features/admin/adminEmployerApi";
import type { AdminLoginRequest } from "../types/admin/admin.types";
import { loginAdmin, adminLogoutApi } from "../features/admin/adminAuthApi";


export const adminLogin = createAsyncThunk(
  "admin/login",
  async (data: AdminLoginRequest, { rejectWithValue }) => {
    try {
      return await loginAdmin(data);
    } catch (error: any) {
      const message = error.response?.data?.message || "Admin login failed";
      return rejectWithValue(message);
    }
  },
);

export const serverAdminLogout = createAsyncThunk(
  "admin/logout",
  async (refreshToken: string, { rejectWithValue }) => {
    try {
      return await adminLogoutApi(refreshToken);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Admin logout failed");
    }
  }
);


export const fetchCandidates = createAsyncThunk(
  "adminCandidates/fetchAll",
  async ({
    page,
    limit,
    search,
  }: {
    page: number;
    limit: number;
    search: string;
  }) => {
    return await getAllCandidatesApi(page, limit, search);
  },
);

export const toggleBlockCandidate = createAsyncThunk(
  "adminCandidates/blockUnblock",
  async ({ candidateId, block }: { candidateId: string; block: boolean }) => {
    return await blockUnblockCandidateApi(candidateId, block);
  },
);

export const fetchEmployers = createAsyncThunk(
  "adminEmployers/fetchEmployers",
  async (
    { page, limit, search }: { page: number; limit: number; search?: string },
    { rejectWithValue },
  ) => {
    try {
      return await getAllEmployersApi({ page, limit, search });
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// Block/Unblock employer
export const blockUnblockEmployer = createAsyncThunk(
  "adminEmployers/blockUnblockEmployer",
  async (
    { employerId, block }: { employerId: string; block: boolean },
    { rejectWithValue },
  ) => {
    try {
      return await blockUnblockEmployerApi(employerId, block);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);