"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Upload, Camera, Database, BarChart2, BookOpen, AlertTriangle, Settings, Layers } from "lucide-react"

export default function Sidebar() {
  const pathname = usePathname()

  const menuItems = [
    { name: "Dashboard", icon: Home, path: "/" },
    { name: "Video Detection", icon: Upload, path: "/video-detection" },
    { name: "Camera Detection", icon: Camera, path: "/camera-detection" },
    { name: "Model Management", icon: Database, path: "/models" },
    { name: "Training", icon: BookOpen, path: "/training" },
    { name: "Alerts", icon: AlertTriangle, path: "/alerts" },
    { name: "Statistics", icon: BarChart2, path: "/statistics" },
    { name: "Samples", icon: Layers, path: "/samples" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ]

  return (
    <div className="bg-gray-900 text-white w-64 flex-shrink-0 hidden md:block">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold">Violence Detection</h2>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.path
            return (
              <li key={item.path}>
                <Link href={item.path}>
                  <div
                    className={`flex items-center p-2 rounded-md hover:bg-gray-800 transition-colors ${
                      isActive ? "bg-gray-800 text-blue-400" : ""
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <span>{item.name}</span>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}

