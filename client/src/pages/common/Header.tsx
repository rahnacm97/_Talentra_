import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import PersonSearchRoundedIcon from "@mui/icons-material/PersonSearchRounded";
import { useAppSelector, useAppDispatch } from "../../hooks/hooks";
import { logout } from "../../features/auth/authSlice";
import { serverLogout } from "../../thunks/auth.thunk";
import { toast } from "react-toastify";
import { FRONTEND_ROUTES } from "../../shared/constants";
import Cookies from "js-cookie";

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, accessToken } = useAppSelector((state) => {
    return state.auth;
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const hasShownBlockedToast = useRef(false);

  useEffect(() => {
    if (user?.blocked && !hasShownBlockedToast.current) {
      hasShownBlockedToast.current = true;
      toast.error("Your account has been blocked by the admin.");
      setTimeout(() => {
        dispatch(logout());
        navigate(FRONTEND_ROUTES.LOGIN);
      }, 4500);
    }
  }, [user?.blocked, dispatch, navigate]);

  const handleLogout = async () => {
    try {
      if (!user || !user.role || !accessToken) {
        dispatch(logout());
        Cookies.remove("refreshToken", { sameSite: "Lax" });
        navigate(FRONTEND_ROUTES.LOGIN);
        return;
      }
      await dispatch(serverLogout({ role: user.role })).unwrap();
      dispatch(logout());
      navigate(FRONTEND_ROUTES.LOGIN);
      setDropdownOpen(false);
      setMobileMenuOpen(false);
    } catch {
      dispatch(logout());
      navigate(FRONTEND_ROUTES.LOGIN);
    }
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg shadow-sm">
              <PersonSearchRoundedIcon sx={{ color: "white", fontSize: 28 }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                Talentra
              </h1>
              <p className="text-xs text-gray-500 -mt-1">
                Talent Discovery Platform
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-6 relative">
            <Link
              to="/home"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Home
            </Link>

            {!user ? (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-blue-50"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  <span className="font-medium">{user.name}</span>
                  {user.role === "Employer" && (
                    <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                      Employer
                    </span>
                  )}
                  <svg
                    className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <button
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      style={{ pointerEvents: "auto", cursor: "pointer" }}
                      onClick={() => {
                        setDropdownOpen(false);
                        if (user.role === "Candidate") {
                          navigate(FRONTEND_ROUTES.CANDIDATEPROFILE);
                        } else if (user.role === "Employer") {
                          navigate(FRONTEND_ROUTES.EMPLOYERPROFILE);
                        } else if (user.role === "Admin") {
                          navigate(FRONTEND_ROUTES.ADMIN_DASHBOARD);
                        }
                      }}
                    >
                      {user.role === "Admin" ? "Dashboard" : "Profile"}
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      style={{ pointerEvents: "auto", cursor: "pointer" }}
                      onClick={() => {
                        handleLogout();
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Mobile Menu Icon */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 hover:text-gray-800 focus:outline-none focus:text-gray-800"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-2 space-y-2 border-t border-gray-200 pt-2">
            <Link
              to="/home"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>

            {!user ? (
              <>
                <Link
                  to="/login"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="block px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="space-y-1">
                <div className="px-4 py-2 bg-gray-100 rounded-lg flex items-center justify-between">
                  <span className="font-medium">{user.name}</span>
                  {user.role === "Employer" && (
                    <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                      Employer
                    </span>
                  )}
                </div>
                <Link
                  to={
                    user.role === "Candidate"
                      ? FRONTEND_ROUTES.CANDIDATEPROFILE
                      : user.role === "Employer"
                        ? FRONTEND_ROUTES.EMPLOYERPROFILE
                        : FRONTEND_ROUTES.ADMIN_DASHBOARD
                  }
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  style={{ pointerEvents: "auto", cursor: "pointer" }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {user.role === "Admin" ? "Dashboard" : "Profile"}
                </Link>
                <button
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  style={{ pointerEvents: "auto", cursor: "pointer" }}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
