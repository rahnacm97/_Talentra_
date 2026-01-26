import React from "react";
import { Outlet } from "react-router-dom";
import {
  Building2,
  Briefcase,
  Users,
  Settings,
  BarChart3,
  Calendar,
  BellIcon,
  CreditCard,
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

const EmployerLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

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
      id: "notifications",
      label: "Notifications",
      icon: BellIcon,
      path: FRONTEND_ROUTES.EMPLOYERNOTIFICATIONS,
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      path: FRONTEND_ROUTES.EMPLOYERSETTINGS,
    },
  ];

<<<<<<< Updated upstream
=======
  const isActive = (path: string) => {
    const current = location.pathname;

    if (path === FRONTEND_ROUTES.EMPLOYERMESSAGES) {
      return current === path || current.startsWith(path + "/");
    }

    if (
      path === FRONTEND_ROUTES.EMPLOYERAPPLICANTS ||
      path === FRONTEND_ROUTES.EMPLOYERINTERVIEWS
    ) {
      return current.startsWith(path);
    }

    return current === path;
  };

>>>>>>> Stashed changes
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <EmployerSidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          sidebarItems={sidebarItems}
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
