import { GoogleAuthUserData } from "../../types/types";

export interface GoogleUser {
  id: string;
  role: string;
  user?: GoogleAuthUserData;
  accessToken?: string;
  refreshToken?: string;
}
