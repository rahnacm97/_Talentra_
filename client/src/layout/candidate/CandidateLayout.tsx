import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../../pages/common/Header";
import CandidateSidebar from "./CandidateSidebar";

const CandidateLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <CandidateSidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <main className="flex-1 lg:ml-0 min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CandidateLayout;
