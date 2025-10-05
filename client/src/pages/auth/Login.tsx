import React from "react";
import ScreenLeft from "../../components/common/AuthLeft";
import LoginForm from "../../components/auth/LoginForm";

const Login: React.FC = () => {
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
