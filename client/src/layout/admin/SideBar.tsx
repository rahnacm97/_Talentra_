import React from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { logout } from "../../features/auth/authSlice";
import { serverLogout } from "../../thunks/auth.thunk";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import WorkIcon from "@mui/icons-material/Work";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import PersonSearchRoundedIcon from "@mui/icons-material/PersonSearchRounded";
import LogoutIcon from "@mui/icons-material/Logout";
import { FRONTEND_ROUTES } from "../../shared/constants";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = async () => {
    try {
      await dispatch(serverLogout({ role: user?.role })).unwrap();
    } catch (error) {
      console.error("Server logout failed:", error);
    }

    dispatch(logout());
    navigate(FRONTEND_ROUTES.ADMINLOGIN);
  };

  const menuItems = [
    {
      path: FRONTEND_ROUTES.ADMIN_DASHBOARD,
      label: "Dashboard",
      icon: DashboardIcon,
      description: "Overview & Analytics",
    },
    {
      path: FRONTEND_ROUTES.ADMINCANDIDATES,
      label: "Candidates",
      icon: PersonIcon,
      description: "Manage Job Seekers",
    },
    {
      path: FRONTEND_ROUTES.ADMINEMPLOYERS,
      label: "Employers",
      icon: AccountBoxIcon,
      description: "Manage Companies",
    },
    {
      path: "/admin-jobs",
      label: "Jobs",
      icon: WorkIcon,
      description: "Job Postings",
    },
    {
      path: "/admin-settings",
      label: "Settings",
      icon: SettingsIcon,
      description: "System Configuration",
    },
    {
      path: "/admin-notification",
      label: "Notifications",
      icon: NotificationsNoneIcon,
      description: "Notifications",
    },
  ];

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside className="w-64 bg-white shadow-lg border-r border-gray-200 h-full flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3 mb-2">
          <div className="bg-blue-600 p-2 rounded-lg shadow-sm">
            <PersonSearchRoundedIcon
              sx={{
                color: "white",
                fontSize: 24,
              }}
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Talentra</h1>
            <p className="text-xs text-gray-500 -mt-1">Admin Portal</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <div className="mb-4">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 mb-3">
            Administration
          </h2>
        </div>

        <ul className="space-y-1">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = isActiveRoute(item.path);

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`group flex items-center px-3 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                >
                  <div
                    className={`flex-shrink-0 mr-3 ${
                      isActive
                        ? "text-white"
                        : "text-gray-500 group-hover:text-blue-600"
                    }`}
                  >
                    <IconComponent sx={{ fontSize: 20 }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-sm font-medium ${
                        isActive
                          ? "text-white"
                          : "text-gray-900 group-hover:text-blue-700"
                      }`}
                    >
                      {item.label}
                    </div>
                    <div
                      className={`text-xs ${
                        isActive
                          ? "text-blue-100"
                          : "text-gray-500 group-hover:text-blue-500"
                      }`}
                    >
                      {item.description}
                    </div>
                  </div>

                  {isActive && (
                    <div className="ml-2">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">
            Quick Stats
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-center">
              <div className="font-bold text-blue-600">1,247</div>
              <div className="text-gray-600">Active Jobs</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-green-600">5,832</div>
              <div className="text-gray-600">Candidates</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-xs font-semibold text-gray-600">AD</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900">
                Admin User
              </div>
              <div className="text-xs text-gray-500">System Administrator</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="text-gray-500 hover:text-red-600 transition-colors"
            title="Logout"
          >
            <LogoutIcon />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
