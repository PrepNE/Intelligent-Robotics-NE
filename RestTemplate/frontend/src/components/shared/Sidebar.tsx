import {
  CarOutlined,
  DeploymentUnitOutlined,
  FileTextOutlined,
  HomeOutlined,
  LogoutOutlined,
  CaretDownOutlined,
  CaretRightOutlined,
  LoginOutlined
} from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "antd";
import useAuth from "@/hooks/useAuth";
import Logo from "./Logo";

interface PageRoute {
  id: number;
  name: string;
  path?: string;
  icon?: React.ReactNode;
  children?: {
    id: number;
    name: string;
    path: string;
  }[];
}

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState<Record<number, boolean>>({});

  const isAdmin = user?.role === "ADMIN";

  const pageDirectories: PageRoute[] = [
    {
      id: 1,
      name: "Overview",
      path: "/dashboard",
      icon: <HomeOutlined />,
    },
     {
      id: 2,
      name: "Entries",
      path: "/dashboard/logs",
      icon: <LoginOutlined />,
    }
  ];

  const isActive = (path: string | undefined) => {
    return path && location.pathname === path;
  };

  const isParentActive = (children?: { path: string }[]) => {
    if (!children) return false;
    return children.some(
      (child) =>
        location.pathname === child.path ||
        location.pathname.startsWith(child.path + "/")
    );
  };

  const toggleMenu = (id: number) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  useEffect(() => {
    pageDirectories.forEach((route) => {
      if (route.children && isParentActive(route.children)) {
        setExpandedMenus((prev) => ({
          ...prev,
          [route.id]: true,
        }));
      }
    });
  }, [location.pathname]);

  return (
    <div className="h-full w-64 bg-white border-r border-gray-200 shadow-sm">
      <div className="flex flex-col h-full">
        <div className="flex items-center h-16 px-4 border-b border-gray-200">
          <Link to="/" className="flex items-center">
            <Logo />
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-0.5">
            {pageDirectories.map((route) => (
              <li key={route.id}>
                {route.children ? (
                  <div>
                    <button
                      onClick={() => toggleMenu(route.id)}
                      className={`w-full flex items-center justify-between p-2.5 text-sm rounded-md transition-all ${
                        isParentActive(route.children)
                          ? "bg-blue-50 text-blue-600"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="text-lg">{route.icon}</span>
                        <span className="ml-3 font-medium">{route.name}</span>
                      </div>
                      <span className="text-xs">
                        {expandedMenus[route.id] ? (
                          <CaretDownOutlined />
                        ) : (
                          <CaretRightOutlined />
                        )}
                      </span>
                    </button>

                    <div
                      className={`mt-1 ${
                        expandedMenus[route.id] ? "block" : "hidden"
                      }`}
                    >
                      {route.children.map((child) => (
                        <Link
                          key={child.id}
                          to={child.path}
                          className={`flex items-center pl-10 pr-2 py-2 text-sm rounded-md transition-colors ${
                            isActive(child.path)
                              ? "bg-primary border-[1px] border-white border-dashed text-white"
                              : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                          }`}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    to={route.path!}
                    className={`flex items-center p-2.5 text-sm rounded-md transition-colors ${
                      isActive(route.path)
                        ? "bg-primary border-[1px] border-white border-dashed text-white"
                        : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                    }`}
                  >
                    <span className="text-lg">{route.icon}</span>
                    <span className="ml-3 font-medium">{route.name}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-gray-200 p-4">
          <Button
            onClick={logout}
            type="text"
            className="flex justify-start items-start w-full p-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
          >
            <LogoutOutlined className="text-lg text-primary" />
            <span className="ml-3 font-medium text-primary">Logout</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
