import React from "react";
import { Outlet } from "react-router-dom";
import {
  Building2,
  Briefcase,
  Users,
  BarChart3,
  Calendar,
  CreditCard,
  MessageCircle,
} from "lucide-react";
import Header from "../../pages/common/Header";
import EmployerSidebar from "./EmployerSidebar";
import { FRONTEND_ROUTES } from "../../shared/constants/constants";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
}

import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { useLocation } from "react-router-dom";
import SubscriptionExpiredModal from "../../components/employer/SubscriptionExpiredModal";

const EmployerLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  const isSubscriptionActiveOrTrialing = React.useMemo(() => {
    if (!user || user.role !== "Employer") return false;

    if (user.hasActiveSubscription) return true;

    if (user.trialEndsAt) {
      return new Date(user.trialEndsAt) > new Date();
    }

    return false;
  }, [user]);

  const showSubscriptionModal =
    !isSubscriptionActiveOrTrialing &&
    location.pathname !== FRONTEND_ROUTES.EMPLOYERRBILLING;

  const sidebarItems: SidebarItem[] = [
    {
      id: "profile",
      label: "Company Profile",
      icon: Building2,
      path: FRONTEND_ROUTES.EMPLOYERPROFILE,
    },
    {
      id: "jobs",
      label: "Manage Jobs",
      icon: Briefcase,
      path: FRONTEND_ROUTES.EMPLOYERJOBS,
    },
    {
      id: "applicants",
      label: "Applications",
      icon: Users,
      path: FRONTEND_ROUTES.EMPLOYERAPPLICANTS,
    },
    {
      id: "interviews",
      label: "Interviews",
      icon: Calendar,
      path: FRONTEND_ROUTES.EMPLOYERINTERVIEWS,
    },
    {
      id: "subscriptions",
      label: "Subscriptions",
      icon: CreditCard,
      path: FRONTEND_ROUTES.EMPLOYERRBILLING,
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      path: FRONTEND_ROUTES.EMPLOYERANALYTICS,
    },
    {
      id: "chat",
      label: "Messages",
      icon: MessageCircle,
      path: FRONTEND_ROUTES.EMPLOYERMESSAGES,
    },

    // {
    //   id: "settings",
    //   label: "Settings",
    //   icon: Settings,
    //   path: FRONTEND_ROUTES.EMPLOYERSETTINGS,
    // },
  ];

  const isActive = (path: string) => {
    const current = location.pathname;

    if (path === FRONTEND_ROUTES.EMPLOYERMESSAGES) {
      return current === path || current.startsWith(path + "/");
    }

    if (path === FRONTEND_ROUTES.EMPLOYERAPPLICANTS) {
      return current.startsWith(path);
    }

    return current === path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <SubscriptionExpiredModal isOpen={showSubscriptionModal} />
      <div className="flex">
        <EmployerSidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          sidebarItems={sidebarItems}
          isActive={isActive}
          activeColor="indigo-600"
        />
        <main className="flex-1 lg:ml-0 min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default EmployerLayout;
