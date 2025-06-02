import Sidebar from "@/components/shared/Sidebar";
import {
  formatAvatarInitials,
  formatPathname,
  formatUsername,
} from "@/lib/utils";
import { MenuOutlined } from "@ant-design/icons";
import { Avatar, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

const DashboardLayout = () => {
  const { Text } = Typography;
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = () => {
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  useEffect(() => {
    closeSidebar();
  }, [location.pathname]);
  return (
    <div className="flex h-screen overflow-hidden">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed flex lg:static inset-y-0 left-0 z-30 w-64  transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } flex-shrink-0 overflow-y-auto`}
      >
        <Sidebar />
      </aside>

      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex justify-between items-center px-4 py-3 lg:px-6">
            <div className="flex items-center  space-x-3">
              <button
                onClick={toggleSidebar}
                className="p-2 flex lg:hidden text-gray-600 rounded-md hover:bg-gray-100"
                aria-label="Toggle Button"
              >
                <MenuOutlined />
              </button>
              <Text className="text-base font-medium">
                {formatPathname(location.pathname)}
              </Text>
            </div>
            <div className="flex items-center px-3 py-2 space-x-3 bg-gray-100 rounded-xl">
              <div className="flex-col hidden sm:flex items-end">
                <h1 className="text-sm font-medium">
                  {formatUsername("John", "Doe")}
                </h1>
                <p className="text-xs text-gray-500 truncate max-w-[150px]">
                  johndoe@example.com
                </p>
              </div>
              <Avatar className="bg-primary text-white flex-shrink-0">
                {formatAvatarInitials("John", "Doe")}
              </Avatar>
            </div>
          </div>
        </header>
        <div className="pt-12 px-4 md:px-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
