import type { TypedUseSelectorHook } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../app/store";
import { useEffect } from "react";
import Cookies from "js-cookie";
import {
  loginSuccess,
  logout,
  setInitialized,
} from "../features/auth/authSlice";
import { API_ROUTES } from "../shared/constants/constants";
import axios from "axios";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

//Authentication
export const useAuthInitialiazer = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}${API_ROUTES.AUTH.REFRESH}`,
          {},
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        const { accessToken, user } = response.data;
        const refreshTokenFromCookie = Cookies.get("refreshToken");

        dispatch(
          loginSuccess({
            user,
            accessToken,
            refreshToken: refreshTokenFromCookie || "http-only",
          }),
        );
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          dispatch(logout());
        } else {
          console.log("Network error, auth state unchanged");
        }
      } finally {
        dispatch(setInitialized(true));
      }
    };

    initializeAuth();
  }, [dispatch]);
};
