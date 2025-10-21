import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import adminCandidateReducer from "../features/admin/adminCandidateSlice";
import adminEmployerReducer from "../features/admin/adminEmployerSlice";
import candidateReducer from "../features/candidate/candidateSlice";
import employerReducer from "../features/employer/employerSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    adminCandidates: adminCandidateReducer,
    adminEmployers: adminEmployerReducer,
    candidate: candidateReducer,
    employer: employerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
