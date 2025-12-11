import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { X, Menu } from "lucide-react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import WorkIcon from "@mui/icons-material/Work";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import PersonSearchRoundedIcon from "@mui/icons-material/PersonSearchRounded";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { logout } from "../../features/auth/authSlice";
import { serverLogout } from "../../thunks/auth.thunk";
import { FRONTEND_ROUTES } from "../../shared/constants/constants";
import { fetchNotificationStats } from "../../thunks/notification.thunk";
import { useEffect } from "react";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  description?: string;
}

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { unreadCount } = useAppSelector((state) => state.notifications);
  const { data } = useAppSelector((state) => state.adminAnalytics);

  const activeCandidates = data?.stats.activeCandidates ?? 0;

  // Fetch notification stats on mount
  useEffect(() => {
    dispatch(fetchNotificationStats());
  }, [dispatch]);

  const sidebarItems: SidebarItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: DashboardIcon,
      path: FRONTEND_ROUTES.ADMIN_DASHBOARD,
    },
    {
      id: "candidates",
      label: "Candidates",
      icon: PersonIcon,
      path: FRONTEND_ROUTES.ADMINCANDIDATES,
    },
    {
      id: "employers",
      label: "Employers",
      icon: AccountBoxIcon,
      path: FRONTEND_ROUTES.ADMINEMPLOYERS,
    },
    {
      id: "jobs",
      label: "Jobs",
      icon: WorkIcon,
      path: FRONTEND_ROUTES.ADMINJOBS,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: NotificationsNoneIcon,
      path: FRONTEND_ROUTES.ADMINNOTIFICATIONS,
    },
    // {
    //   id: "settings",
    //   label: "Settings",
    //   icon: SettingsIcon,
    //   path: FRONTEND_ROUTES.ADMINSETTINGS,
    // },
  ];

  const isActive = (path: string) => {
    if (path === FRONTEND_ROUTES.ADMIN_DASHBOARD) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsSidebarOpen(false);
  };

  const handleLogout = async () => {
    try {
      await dispatch(serverLogout({ role: user?.role })).unwrap();
    } catch (error) {
      console.error("Logout failed:", error);
    }
    dispatch(logout());
    navigate(FRONTEND_ROUTES.ADMINLOGIN);
  };

  return (
    <>
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-4 rounded-full shadow-xl hover:bg-blue-700 transition-all duration-200 cursor-pointer ring-4 ring-blue-600/30"
      >
        {isSidebarOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen w-64 bg-white shadow-lg z-40
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          flex flex-col border-r border-gray-200
        `}
      >
        {/* Logo Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg shadow-sm">
              <PersonSearchRoundedIcon sx={{ color: "white", fontSize: 24 }} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Talentra</h1>
              <p className="text-xs text-gray-500">Admin Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4">
          <ul className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              const isNotifications = item.id === "notifications";

              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavigation(item.path)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left cursor-pointer
                      ${
                        active
                          ? "bg-blue-600 text-white shadow-md"
                          : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                      }
                    `}
                  >
                    <Icon
                      sx={{ fontSize: 20 }}
                      className={active ? "text-white" : "text-gray-500"}
                    />
                    <span className="font-medium">{item.label}</span>
                    {isNotifications && unreadCount > 0 && (
                      <span className="ml-auto bg-white-600 text-blue text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                    {active && !isNotifications && (
                      <div className="ml-auto w-2 h-2 bg-white rounded-full" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Quick Stats */}
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">
              Quick Stats
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="text-center">
                <div className="font-bold text-blue-600">
                  {data?.stats.totalJobs ?? 0}
                </div>
                <div className="text-gray-600">Active Jobs</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-green-600">
                  {" "}
                  {activeCandidates}
                </div>
                <div className="text-gray-600">Candidates</div>
              </div>
            </div>
          </div>
        </div>

        {/* User + Logout */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-gray-600">AD</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">System Admin</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
          >
            <LogoutIcon sx={{ fontSize: 20 }} />
            <span className="font-medium cursor-pointer">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
