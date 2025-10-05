import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/hooks";
import { loginSuccess } from "../../features/auth/authSlice";
import api from "../../api/api";
import Cookies from "js-cookie"; 

const AuthSuccess: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
   const didRunRef = useRef(false);

    useEffect(() => {if (didRunRef.current) return; 
    didRunRef.current = true;

    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me", { withCredentials: true });
        const user = res.data.user;

        console.log("User", user);

        const accessToken = Cookies.get("accessToken") || "";
        const refreshToken = Cookies.get("refreshToken") || "";

        dispatch(loginSuccess({ user, accessToken, refreshToken }));
        navigate("/", { replace: true });
      } catch (err) {
        navigate("/login", { replace: true });
      }
    };

    fetchUser();
  }, [dispatch, navigate]);

  return <div>Loading...</div>;
};

export default AuthSuccess;


