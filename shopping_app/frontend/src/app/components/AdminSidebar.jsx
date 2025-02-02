import React from "react";
import { LogOut, Home, Package } from "lucide-react";
import { useRouter } from "next/navigation";

export const AdminSidebar = ({ sidebarOpen}) => {
  const router = useRouter();
  return (
  <aside className={`${sidebarOpen ? "w-64" : "w-20"} bg-white shadow-sm transition-all duration-300 h-[calc(100vh-64px)]`}>
    <nav className="p-4">
      <ul className="space-y-2">
        {["products"].map((route) => (
          <li key={route}>
            <button
              className={`flex items-center w-full p-3 rounded-lg text-indigo-600 bg-indigo-50`}
            >
              <Package className="h-6 w-6" />
               {sidebarOpen && <span className="ml-3 capitalize">{route}</span>}
            </button>
          </li>
        ))}
      <li className="mt-auto">
          <button onClick={() => router.push('/')} className="flex items-center w-full p-3 text-gray-600 hover:bg-gray-50 rounded-lg">
            <Home className="h-6 w-6" />
            {sidebarOpen && <span className="ml-3">Home</span>}
          </button>
        </li>
        <li className="mt-auto">
          <button className="flex items-center w-full p-3 text-gray-600 hover:bg-gray-50 rounded-lg">
            <LogOut className="h-6 w-6" />
            {sidebarOpen && <span className="ml-3">Logout</span>}
          </button>
        </li>
      </ul>
    </nav>
  </aside>
)};