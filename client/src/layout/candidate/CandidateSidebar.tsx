import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  User,
  FileText,
  Heart,
  LogOut,
  Menu,
  X,
  Calendar,
  MessageCircle,
  MessageSquareQuote,
} from "lucide-react";
import { useAppDispatch } from "../../hooks/hooks";
import { logout } from "../../features/auth/authSlice";
import { FRONTEND_ROUTES } from "../../shared/constants/constants";
import { useAppSelector } from "../../hooks/hooks";
import { selectTotalUnreadCount } from "../../features/chat/chatSlice";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
}

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  onFeedbackClick: () => void;
}

const CandidateSidebar: React.FC<SidebarProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
  onFeedbackClick,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const unreadCount = useAppSelector(selectTotalUnreadCount);

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
      id: "chat",
      label: "Messages",
      icon: MessageCircle,
      path: FRONTEND_ROUTES.CANDIDATEMESSAGES,
    },
    {
      id: "feedback",
      label: "Feedback",
      icon: MessageSquareQuote,
      path: "#feedback",
    },
  ];

  //const isActive = (path: string) => location.pathname === path;

  const isActive = (itemPath: string) => {
    const current = location.pathname;

    if (
      itemPath === FRONTEND_ROUTES.CANDIDATEAPPLICATIONS ||
      itemPath === FRONTEND_ROUTES.CANDIDATEINTERVIEW
    ) {
      return (
        current === itemPath ||
        current.startsWith(`${itemPath}/`) ||
        current.startsWith(`${itemPath}?`)
      );
    }

    if (itemPath === FRONTEND_ROUTES.CANDIDATEMESSAGES) {
      return current === itemPath || current.startsWith(`${itemPath}/`);
    }

    return current === itemPath;
  };

  const handleNavigation = (item: SidebarItem) => {
    if (item.id === "feedback") {
      onFeedbackClick();
    } else {
      navigate(item.path);
    }
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
          fixed lg:relative left-0 h-full bg-white shadow-lg z-40
          w-64 transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          lg:flex flex-col
        `}
      >
        <div className="flex-1 flex flex-col overflow-y-auto py-6 px-4">
          <nav className="flex-1 space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item)}
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
                  {item.id === "chat" && active && (
                    <span className="ml-auto w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  )}
                  {item.id === "chat" && unreadCount > 0 && (
                    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="border-t border-gray-200 bg-white p-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 font-medium cursor-pointer"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default CandidateSidebar;
