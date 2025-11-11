import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import PersonSearchRoundedIcon from "@mui/icons-material/PersonSearchRounded";
import VerifiedIcon from "@mui/icons-material/Verified";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { useAppSelector, useAppDispatch } from "../../hooks/hooks";
import { logout } from "../../features/auth/authSlice";
import { serverLogout } from "../../thunks/auth.thunk";
import { toast } from "react-toastify";
import { FRONTEND_ROUTES } from "../../shared/constants/constants";
import Cookies from "js-cookie";

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, accessToken, blocked } = useAppSelector((state) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const hasShownBlockedToast = useRef(false);

  useEffect(() => {
    if (blocked && !hasShownBlockedToast.current) {
      hasShownBlockedToast.current = true;
      toast.error("Your account has been blocked by the admin.");
      setTimeout(() => {
        dispatch(logout());
        Cookies.remove("refreshToken", { sameSite: "Lax" });
        navigate(FRONTEND_ROUTES.LOGIN, { replace: true });
      }, 3500);
    }
  }, [blocked, dispatch, navigate]);

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

  const renderEmployerBadges = () => {
    if (user?.role !== "Employer") return null;

    const badges: React.ReactNode[] = [];

    badges.push(
      <span
        key="role"
        className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full"
      >
        Employer
      </span>,
    );

    if (user.verified) {
      badges.push(
        <span
          key="verified"
          className="text-xs bg-green-600 text-white px-0.5 py-0 rounded-full ml-1 flex items-center"
        >
          <VerifiedIcon sx={{ fontSize: 12 }} />
        </span>,
      );
    } else {
      badges.push(
        <button
          key="not-verified"
          onClick={() => {
            setDropdownOpen(false);
            setMobileMenuOpen(false);
            navigate(FRONTEND_ROUTES.EMPLOYERPROFILE);
          }}
          className="group relative text-xs bg-amber-500 hover:bg-amber-600 text-white px-0.5 py-0.5 rounded-full flex items-center transition-colors cursor-pointer"
          title="Complete verification to unlock features"
        >
          <WarningAmberRoundedIcon sx={{ fontSize: 12 }} />
          <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 whitespace-nowrap bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Click to finish verification
          </span>
        </button>,
      );
    }

    return <div className="flex items-center space-x-1">{badges}</div>;
  };

  const DesktopNav = () => (
    <nav className="hidden md:flex items-center space-x-6">
      <Link
        to={FRONTEND_ROUTES.HOME}
        className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
      >
        Home
      </Link>

      {user?.role === "Candidate" && !user.blocked && (
        <Link
          to={FRONTEND_ROUTES.JOBVIEW}
          className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
        >
          Jobs
        </Link>
      )}

      {!user ? (
        <>
          <Link
            to={FRONTEND_ROUTES.LOGIN}
            className="text-gray-700 hover:text-blue-600 font-medium px-4 py-2 rounded-lg hover:bg-blue-50"
          >
            Sign In
          </Link>
          <Link
            to={FRONTEND_ROUTES.SIGNUP}
            className="bg-blue-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
          >
            Sign Up
          </Link>
        </>
      ) : (
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
          >
            <span className="font-medium">{user.name}</span>
            {renderEmployerBadges()}
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
                onClick={() => {
                  setDropdownOpen(false);
                  const route =
                    user.role === "Candidate"
                      ? FRONTEND_ROUTES.CANDIDATEPROFILE
                      : user.role === "Employer"
                        ? FRONTEND_ROUTES.EMPLOYERPROFILE
                        : FRONTEND_ROUTES.ADMIN_DASHBOARD;
                  navigate(route);
                }}
              >
                {user.role === "Admin" ? "Dashboard" : "Profile"}
              </button>
              <button
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );

  const MobileNav = () => (
    <div className="md:hidden mt-2 space-y-2 border-t border-gray-200 pt-2">
      <Link
        to={FRONTEND_ROUTES.HOME}
        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
        onClick={() => setMobileMenuOpen(false)}
      >
        Home
      </Link>

      {user?.role === "Candidate" && (
        <Link
          to={FRONTEND_ROUTES.JOBVIEW}
          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          onClick={() => setMobileMenuOpen(false)}
        >
          Jobs
        </Link>
      )}

      {!user ? (
        <>
          <Link
            to={FRONTEND_ROUTES.LOGIN}
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            onClick={() => setMobileMenuOpen(false)}
          >
            Sign In
          </Link>
          <Link
            to={FRONTEND_ROUTES.SIGNUP}
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
            {renderEmployerBadges()}
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
            onClick={() => setMobileMenuOpen(false)}
          >
            {user.role === "Admin" ? "Dashboard" : "Profile"}
          </Link>

          <button
            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );

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

          <DesktopNav />

          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 hover:text-gray-800"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {mobileMenuOpen && <MobileNav />}
      </div>
    </header>
  );
};

export default Header;
