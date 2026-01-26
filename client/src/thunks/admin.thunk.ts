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
import type { ApiError } from "../types/common/common.type";
import type { Candidate } from "../types/admin/admin.candidate.types";
import type { EmployerResponseDTO } from "../types/admin/admin.employer.types";
//fetch candidates
export const fetchCandidates = createAsyncThunk(
  "adminCandidates/fetchAll",
  async ({
    page,
    limit,
    search,
    status,
  }: {
    page: number;
    limit: number;
    search: string;
    status: "active" | "blocked" | "all";
  }) => {
    return await getAllCandidatesApi(page, limit, search, status);
  },
);
//Block or unblock
export const toggleBlockCandidate = createAsyncThunk(
  "adminCandidates/blockUnblock",
  async ({ candidateId, block }: { candidateId: string; block: boolean }) => {
    return await blockUnblockCandidateApi(candidateId, block);
  },
);
//Single candidate
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
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue({
      message: error.response?.data?.message || "Failed to fetch candidate",
    });
  }
});
//fetch employers
export const fetchEmployers = createAsyncThunk(
  "adminEmployers/fetchEmployers",
  async (
    {
      page,
      limit,
      search,
      status,
      verification,
    }: {
      page: number;
      limit: number;
      search?: string;
      status?: "active" | "blocked" | "all";
      verification?: "verified" | "pending" | "all";
    },
    { rejectWithValue },
  ) => {
    try {
      return await getAllEmployersApi({
        page,
        limit,
        search,
        status,
        verification,
      });
    } catch (err: unknown) {
      const error = err as ApiError;
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);
//single employer
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
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue({
      message: error.response?.data?.message || "Failed to fetch employer",
    });
  }
});
//block or unblock
export const blockUnblockEmployer = createAsyncThunk(
  "adminEmployers/blockUnblockEmployer",
  async (
    { employerId, block }: { employerId: string; block: boolean },
    { rejectWithValue },
  ) => {
    try {
      return await blockUnblockEmployerApi(employerId, block);
    } catch (err: unknown) {
      const error = err as ApiError;
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);
//employer verification
export const verifyEmployer = createAsyncThunk(
  "adminEmployers/verifyEmployer",
  async (employerId: string, { rejectWithValue }) => {
    try {
      return await verifyEmployerApi(employerId);
    } catch (err: unknown) {
      const error = err as ApiError;
      return rejectWithValue(
        error.response?.data?.message || "Failed to verify employer",
      );
    }
  },
);
//employer rejection
export const rejectEmployer = createAsyncThunk(
  "adminEmployers/rejectEmployer",
  async (
    { employerId, reason }: { employerId: string; reason: string },
    { rejectWithValue },
  ) => {
    try {
      return await rejectEmployerApi(employerId, reason);
    } catch (err: unknown) {
      const error = err as ApiError;
      return rejectWithValue(
        error.response?.data?.message || "Failed to reject employer",
      );
    }
  },
);
//Jobs fetching
export const fetchAdminJobs = createAsyncThunk(
  "adminJobs/fetch",
  async (params: {
    page: number;
    limit: number;
    search?: string;
    status?: "active" | "closed" | "draft" | "all";
    type?: string;
  }) => {
    const response = await getAdminJobs(params);
    return response;
  },
);
