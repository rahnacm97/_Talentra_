import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchMyOffers } from "../../thunks/offer.thunks";

interface Offer {
  id: string;
  jobId: string;
  jobTitle: string;
  name: string;
  location: string;
  salary: string;
  jobType: string;
  description: string;
  requirements: string[];
  profileImage: string;
  fullName: string;
  email: string;
  phone: string;
  resume: string;
  coverLetter: string;
  appliedAt: string;
  status: string;
  updatedAt?: string;
  hiredAt?: string;
}

interface OfferState {
  offers: Offer[];
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const initialState: OfferState = {
  offers: [],
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
};

const offerSlice = createSlice({
  name: "offer",
  initialState,
  reducers: {
    clearOfferError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyOffers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOffers.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.offers = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchMyOffers.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearOfferError } = offerSlice.actions;
export default offerSlice.reducer;
