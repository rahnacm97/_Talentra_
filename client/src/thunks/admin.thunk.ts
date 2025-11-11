import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllCandidatesApi,
  blockUnblockCandidateApi,
  getAllEmployersApi,
  blockUnblockEmployerApi,
  getCandidateByIdApi,
  getEmployerByIdApi,
  verifyEmployerApi,
  rejectEmployerApi,
  getAdminJobs,
} from "../features/admin/adminApi";
import type { Candidate } from "../types/admin/admin.candidate.types";
import type { EmployerResponseDTO } from "../types/admin/admin.employer.types";

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

export const fetchCandidateById = createAsyncThunk<
  Candidate,
  string,
  { rejectValue: { message: string } }
>("adminCandidates/fetchById", async (candidateId, { rejectWithValue }) => {
  try {
    const candidate = await getCandidateByIdApi(candidateId);
    if (!candidate) {
      return rejectWithValue({ message: "Candidate not found" });
    }
    return candidate;
  } catch (error: any) {
    return rejectWithValue({
      message: error.response?.data?.message || "Failed to fetch candidate",
    });
  }
});

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

export const fetchEmployerById = createAsyncThunk<
  EmployerResponseDTO,
  string,
  { rejectValue: { message: string } }
>("adminEmployers/fetchById", async (employerId, { rejectWithValue }) => {
  try {
    const employer = await getEmployerByIdApi(employerId);
    if (!employer) {
      return rejectWithValue({ message: "Employer not found" });
    }
    return employer;
  } catch (error: any) {
    return rejectWithValue({
      message: error.response?.data?.message || "Failed to fetch employer",
    });
  }
});

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

export const verifyEmployer = createAsyncThunk(
  "adminEmployers/verifyEmployer",
  async (employerId: string, { rejectWithValue }) => {
    try {
      return await verifyEmployerApi(employerId);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to verify employer",
      );
    }
  },
);

export const rejectEmployer = createAsyncThunk(
  "adminEmployers/rejectEmployer",
  async (
    { employerId, reason }: { employerId: string; reason: string },
    { rejectWithValue },
  ) => {
    try {
      return await rejectEmployerApi(employerId, reason);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to reject employer",
      );
    }
  },
);

export const fetchAdminJobs = createAsyncThunk(
  "adminJobs/fetch",
  async (params: {
    page: number;
    limit: number;
    search?: string;
    status?: "active" | "closed" | "all";
  }) => {
    const response = await getAdminJobs(params);
    return response;
  },
);
