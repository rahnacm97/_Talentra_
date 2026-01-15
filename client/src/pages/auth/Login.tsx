import React, { useEffect } from "react";
import ScreenLeft from "../../components/common/auth/AuthLeft";
import LoginForm from "../../components/auth/LoginForm";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const error = params.get("error");
    if (error) {
      toast.error(decodeURIComponent(error));
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Panel */}
      <ScreenLeft />

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
