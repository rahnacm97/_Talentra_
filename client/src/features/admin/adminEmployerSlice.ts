import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  EmployersState,
  EmployerResponseDTO,
} from "../../types/admin/admin.employer.types";
import {
  getAllEmployersApi,
  blockUnblockEmployerApi,
} from "./adminEmployerApi";
import { toast } from "react-toastify";

const initialState: EmployersState = {
  employers: [],
  total: 0,
  loading: false,
  error: null,
};

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

const adminEmployerSlice = createSlice({
  name: "adminEmployers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchEmployers.fulfilled,
        (
          state,
          action: PayloadAction<{ data: EmployerResponseDTO[]; total: number }>,
        ) => {
          state.loading = false;
          state.employers = action.payload.data;
          state.total = action.payload.total;
        },
      )
      .addCase(fetchEmployers.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      // .addCase(blockUnblockEmployer.fulfilled, (state, action: PayloadAction<EmployerResponseDTO>) => {
      //   const updated = action.payload.employer;
      //   state.employers = state.employers.map((emp) =>
      //     emp.id === action.payload.id ? { ...emp, blocked: action.payload.blocked } : emp
      //   );
      //   toast.success(`${updated.name} has been ${updated.blocked ? "blocked" : "unblocked"}`);
      // });

      .addCase(
        blockUnblockEmployer.fulfilled,
        (
          state,
          action: PayloadAction<{
            employer: EmployerResponseDTO;
            message: string;
          }>,
        ) => {
          const updated = action.payload.employer;
          state.employers = state.employers.map((emp) =>
            emp.id === updated.id ? updated : emp,
          );
          toast.success(
            `${updated.name} has been ${updated.blocked ? "blocked" : "unblocked"}`,
          );
        },
      );
  },
});

export default adminEmployerSlice.reducer;
