import React from "react";
import Sidebar from "./SideBar";
import { Outlet } from "react-router-dom";

const AdminLayout: React.FC = () => {
  return (
    <div className="flex flex-col h-screen w-screen">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main
          className="flex-1 p-6 bg-gray-100 overflow-auto"
          style={{ minWidth: 0 }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
