"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Camera, Upload, Database, BarChart2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function Dashboard() {
  const [recentAlerts] = useState([
    { id: 1, camera: "Main Entrance", time: "Today, 10:23 AM", confidence: 87 },
    { id: 2, camera: "Parking Lot", time: "Yesterday, 8:45 PM", confidence: 92 },
    { id: 3, camera: "Hallway", time: "Yesterday, 3:12 PM", confidence: 78 },
  ])

  const [systemStats] = useState({
    totalModels: 5,
    activeCameras: 8,
    totalAlerts: 27,
    sampleCount: 1240,
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/video-detection">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Upload className="h-6 w-6 text-blue-700" />
              </div>
              <div>
                <h3 className="font-medium">Video Detection</h3>
                <p className="text-sm text-gray-500">Upload and analyze videos</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/camera-detection">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Camera className="h-6 w-6 text-green-700" />
              </div>
              <div>
                <h3 className="font-medium">Camera Detection</h3>
                <p className="text-sm text-gray-500">Real-time surveillance</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/alerts">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="bg-red-100 p-3 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-700" />
              </div>
              <div>
                <h3 className="font-medium">View Alerts</h3>
                <p className="text-sm text-gray-500">Check recent detections</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Total Models</p>
                <h3 className="text-2xl font-bold">{systemStats.totalModels}</h3>
              </div>
              <Database className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Active Cameras</p>
                <h3 className="text-2xl font-bold">{systemStats.activeCameras}</h3>
              </div>
              <Camera className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Total Alerts</p>
                <h3 className="text-2xl font-bold">{systemStats.totalAlerts}</h3>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Sample Count</p>
                <h3 className="text-2xl font-bold">{systemStats.sampleCount}</h3>
              </div>
              <BarChart2 className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Violence Alerts</CardTitle>
          <CardDescription>Latest detected violent behaviors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-red-100 p-2 rounded-full">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{alert.camera}</h4>
                    <p className="text-sm text-gray-500">{alert.time}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{alert.confidence}% confidence</span>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-center">
            <Link href="/alerts">
              <Button variant="outline">View All Alerts</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

