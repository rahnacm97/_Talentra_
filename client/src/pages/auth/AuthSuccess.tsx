import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/hooks";
import { loginSuccess } from "../../features/auth/authSlice";
import api from "../../api/api";
import { API_ROUTES, FRONTEND_ROUTES } from "../../shared/constants/constants";

const AuthSuccess: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const didRunRef = useRef(false);

  useEffect(() => {
    if (didRunRef.current) return;
    didRunRef.current = true;

    const fetchUser = async () => {
      try {
        const res = await api.get(API_ROUTES.AUTH.ME, {
          withCredentials: true,
        });
        const user = res.data.user;

        console.log("User", user);

        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get("token") || "";
        const refreshToken = null; // Refresh token is HttpOnly

        dispatch(loginSuccess({ user, accessToken, refreshToken }));
        navigate(FRONTEND_ROUTES.HOME, { replace: true });
      } catch {
        navigate("/login", { replace: true });
      }
    };

    fetchUser();
  }, [dispatch, navigate]);

  return <div>Loading...</div>;
};

export default AuthSuccess;
