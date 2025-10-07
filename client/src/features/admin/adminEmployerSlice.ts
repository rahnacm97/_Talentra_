import { createSlice, } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  EmployersState,
  EmployerResponseDTO,
} from "../../types/admin/admin.employer.types";
import { fetchEmployers, blockUnblockEmployer } from "../../thunks/admin.thunk";
import { toast } from "react-toastify";

const initialState: EmployersState = {
  employers: [],
  total: 0,
  loading: false,
  error: null,
};

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
