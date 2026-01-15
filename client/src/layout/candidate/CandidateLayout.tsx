import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../../pages/common/Header";
import CandidateSidebar from "./CandidateSidebar";
import FeedbackModal from "../../components/common/feedback/FeedbackModal";

const CandidateLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = React.useState(false);

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <CandidateSidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          onFeedbackClick={() => setIsFeedbackModalOpen(true)}
        />
        <main className="flex-1 overflow-y-auto relative">
          <Outlet />
        </main>
      </div>
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
      />
    </div>
  );
};

export default CandidateLayout;
