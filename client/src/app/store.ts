import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import adminCandidateReducer from "../features/admin/adminCandidateSlice";
import adminEmployerReducer from "../features/admin/adminEmployerSlice";
import candidateReducer from "../features/candidate/candidateSlice";
import employerReducer from "../features/employer/employerSlice";
import candidateJobReducer from "../features/job/jobSlice";
import adminJobsReducer from "../features/admin/adminJobSlice";
import interviewReducer from "../features/interview/interviewSlice";
<<<<<<< Updated upstream
import adminAnalyticsReducer from "../slices/adminAnalyticsSlice";
import employerAnalyticsReducer from "../slices/employerAnalyticsSlice";
import homepageReducer from "../slices/homepageSlice";
=======
import interviewRoundReducer from "../features/interviewRound/interviewRoundSlice";
import adminAnalyticsReducer from "../features/admin/adminAnalyticsSlice";
import subscriptionReducer from "../features/subscription/subscriptionSlice";
import notificationReducer from "../features/notification/notificationSlice";
import chatReducer from "../features/chat/chatSlice";
import feedbackReducer from "../features/feedback/feedbackSlice";
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
    adminAnalytics: adminAnalyticsReducer,
    employerAnalytics: employerAnalyticsReducer,
    homepage: homepageReducer,
=======
    interviewRound: interviewRoundReducer,
    subscription: subscriptionReducer,
    notifications: notificationReducer,
    chat: chatReducer,
    feedback: feedbackReducer,
>>>>>>> Stashed changes
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
