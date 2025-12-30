import api from "../api/api";
import { API_ROUTES } from "../shared/constants/constants";

export const videoCallService = {
  //Initiate call
  initiateCall: async (interviewId: string, participants: string[]) => {
    const response = await api.post(API_ROUTES.VIDEO_CALL.INITIATE, {
      interviewId,
      participants,
    });
    return response.data;
  },

  //End call
  endCall: async (interviewId: string) => {
    const response = await api.post(API_ROUTES.VIDEO_CALL.END, {
      interviewId,
    });
    return response.data;
  },

  //Get call status
  getCallStatus: async (interviewId: string) => {
    const response = await api.get(API_ROUTES.VIDEO_CALL.STATUS(interviewId));
    return response.data;
  },
};
