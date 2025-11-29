import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import adminCandidateReducer from "../features/admin/adminCandidateSlice";
import adminEmployerReducer from "../features/admin/adminEmployerSlice";
import candidateReducer from "../features/candidate/candidateSlice";
import employerReducer from "../features/employer/employerSlice";
import candidateJobReducer from "../features/job/jobSlice";
import adminJobsReducer from "../features/admin/adminJobSlice";
import interviewReducer from "../features/interview/interviewSlice";
import adminAnalyticsReducer from "../slices/adminAnalyticsSlice";
import employerAnalyticsReducer from "../slices/employerAnalyticsSlice";
import homepageReducer from "../slices/homepageSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    adminCandidates: adminCandidateReducer,
    adminEmployers: adminEmployerReducer,
    candidate: candidateReducer,
    employer: employerReducer,
    candidateJobs: candidateJobReducer,
    adminJobs: adminJobsReducer,
    interview: interviewReducer,
    adminAnalytics: adminAnalyticsReducer,
    employerAnalytics: employerAnalyticsReducer,
    homepage: homepageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
