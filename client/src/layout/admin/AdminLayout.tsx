import React, { useState } from "react";
import Sidebar from "./SideBar";
import { Outlet } from "react-router-dom";

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen bg-gray-50">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <main
        className="flex-1 overflow-auto bg-gray-100 p-4 lg:p-8"
        style={{ minWidth: 0 }}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
