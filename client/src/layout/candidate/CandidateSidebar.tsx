import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  User,
  FileText,
  Heart,
  Settings,
  LogOut,
  Menu,
  X,
  BellIcon,
  Calendar,
} from "lucide-react";
import { useAppDispatch } from "../../hooks/hooks";
import { logout } from "../../features/auth/authSlice";
import { FRONTEND_ROUTES } from "../../shared/constants/constants";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
}

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const CandidateSidebar: React.FC<SidebarProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const sidebarItems: SidebarItem[] = [
    {
      id: "profile",
      label: "Profile",
      icon: User,
      path: FRONTEND_ROUTES.CANDIDATEPROFILE,
    },
    {
      id: "applications",
      label: "My Applications",
      icon: FileText,
      path: FRONTEND_ROUTES.CANDIDATEAPPLICATIONS,
    },
    {
      id: "interviews",
      label: "Interviews",
      icon: Calendar,
      path: FRONTEND_ROUTES.CANDIDATEINTERVIEW,
    },
    {
      id: "saved",
      label: "Saved Jobs",
      icon: Heart,
      path: FRONTEND_ROUTES.CANDIDATESAVEDJOBS,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: BellIcon,
      path: FRONTEND_ROUTES.CANDIDATENOTIFICATIONS,
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      path: FRONTEND_ROUTES.CANDIDATESETTINGS,
    },
  ];

  //const isActive = (path: string) => location.pathname === path;

  const isActive = (itemPath: string) => {
    const current = location.pathname;

    if (itemPath === FRONTEND_ROUTES.CANDIDATEAPPLICATIONS) {
      return (
        current === itemPath ||
        current.startsWith(`${itemPath}/`) ||
        current.startsWith(`${itemPath}?`)
      );
    }

    return current === itemPath;
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate(FRONTEND_ROUTES.LOGIN);
  };

  return (
    <>
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors cursor-pointer"
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
          fixed lg:sticky top-0 left-0 h-screen bg-white shadow-lg z-40
          w-64 transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          lg:flex flex-col
        `}
      >
        <div className="flex-1 overflow-y-auto py-6 px-4 mt-2">
          <nav className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-lg
                    transition-all duration-200 text-left cursor-pointer
                    ${
                      active
                        ? "bg-blue-50 text-blue-600 font-medium shadow-sm"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }
                  `}
                >
                  <Icon
                    className={`w-5 h-5 ${active ? "text-blue-600" : ""}`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
        <div className="border-t border-gray-200 bg-white p-4 mt-70">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 font-medium"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default CandidateSidebar;
