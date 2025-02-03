import React from 'react'
import { Search, Settings, Menu } from 'lucide-react'
const AdminHeader = ({toggleSidebar}) => {
  return (
    <header className="bg-white shadow-sm">
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-gray-100">
          <Menu className="h-6 w-6 text-gray-600" />
        </button>
        <div className="flex items-center ml-4">
          <svg viewBox="0 0 100 100" className="h-8 w-8">
            <path
              d="M20,80 Q30,95 50,80 Q70,95 80,80 Q90,65 80,50 Q70,35 50,50 Q30,35 20,50 Q10,65 20,80"
              fill="#4F46E5"
              className="drop-shadow-md"
            />
            <path
              d="M30,70 Q50,85 70,70"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              className="drop-shadow-sm"
            />
          </svg>
          <span className="ml-2 text-xl font-bold text-gray-900">SoleStyle</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            className="w-64 pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Settings className="h-6 w-6 text-gray-600" />
        </button>
      </div>
    </div>
  </header>

  )
}

export default AdminHeader