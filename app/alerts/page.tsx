"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Calendar, CheckCircle, Download, Eye, Filter, Play } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { getAlertFactory, type Alert as AlertType } from "@/lib/factories/alert-factory"

export default function Alerts() {
  const [alerts, setAlerts] = useState<AlertType[]>([])
  const [filterLocation, setFilterLocation] = useState<"all" | "Main Entrance" | "Parking Lot" | "Hallway" | "Cafeteria">("all")
  const [filterStatus, setFilterStatus] = useState<"all" | "new" | "reviewed" | "dismissed">("all")

  const alertFactory = getAlertFactory()

  useEffect(() => {
    // Load alerts from the factory
    setAlerts(alertFactory.getAlerts())
  }, [alertFactory])

  const filteredAlerts = alerts.filter((alert) => {
    // Filter by location
    if (filterLocation !== "all" && alert.location !== filterLocation) {
      return false
    }

    // Filter by status
    if (filterStatus !== "all" && alert.status !== filterStatus) {
      return false
    }

    return true
  })

  const handleMarkAsReviewed = (alertId: string) => {
    const success = alertFactory.updateAlertStatus(alertId, "reviewed")
    if (success) {
      // Update the alerts list
      setAlerts(alertFactory.getAlerts())
    }
  }

  // const handleDismissAlert = (alertId: string) => {
  //   const success = alertFactory.updateAlertStatus(alertId, "dismissed")
  //   if (success) {
  //     // Update the alerts list
  //     setAlerts(alertFactory.getAlerts())
  //   }
  // }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Violence Alerts</h1>

      <Tabs defaultValue="all">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="all">All Alerts</TabsTrigger>
          <TabsTrigger value="new">New Alerts</TabsTrigger>
          <TabsTrigger value="reviewed">Reviewed</TabsTrigger>
          <TabsTrigger value="settings">Alert Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <select
                className="p-2 border rounded-md"
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value as "all" | "Main Entrance" | "Parking Lot" | "Hallway" | "Cafeteria")}
              >
                <option value="all">All Locations</option>
                <option value="Main Entrance">Main Entrance</option>
                <option value="Parking Lot">Parking Lot</option>
                <option value="Hallway">Hallway</option>
                <option value="Cafeteria">Cafeteria</option>
              </select>
              <select
                className="p-2 border rounded-md"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as "all" | "new" | "reviewed" | "dismissed")}
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="reviewed">Reviewed</option>
                <option value="dismissed">Dismissed</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <input type="date" className="p-1 border rounded-md" />
              <span>to</span>
              <input type="date" className="p-1 border rounded-md" />
              <Button variant="outline" size="sm">
                Apply
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Violence Alert History</CardTitle>
              <CardDescription>Review and manage detected violent behavior</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {filteredAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center space-x-4">
                      <div className="bg-red-100 p-3 rounded-full">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{alert.location}</h4>
                        <p className="text-sm text-gray-500">{alert.time}</p>
                        <div className="flex items-center mt-1">
                          <Badge
                            variant={
                              alert.status === "new" ? "default" : alert.status === "reviewed" ? "secondary" : "outline"
                            }
                            className="text-xs"
                          >
                            {alert.status === "new" ? "New" : alert.status === "reviewed" ? "Reviewed" : "Dismissed"}
                          </Badge>
                          {alert.hasVideo && <span className="text-xs text-gray-500 ml-2">Video Available</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-lg font-medium">{alert.confidence}%</span>
                      <span className="text-xs text-gray-500 mb-2">confidence</span>
                      <div className="flex space-x-2">
                        {alert.hasVideo && (
                          <Button variant="outline" size="sm">
                            <Play className="h-4 w-4 mr-2" />
                            Play
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Showing {filteredAlerts.length} of {alerts.length} alerts
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm">
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export Alert History
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="new">
          <Card>
            <CardHeader>
              <CardTitle>New Alerts</CardTitle>
              <CardDescription>Unreviewed violence alerts requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {alerts
                  .filter((alert) => alert.status === "new")
                  .map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center space-x-4">
                        <div className="bg-red-100 p-3 rounded-full">
                          <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{alert.location}</h4>
                          <p className="text-sm text-gray-500">{alert.time}</p>
                          <div className="flex items-center mt-1">
                            <Badge className="text-xs">New</Badge>
                            {alert.hasVideo && <span className="text-xs text-gray-500 ml-2">Video Available</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-lg font-medium">{alert.confidence}%</span>
                        <span className="text-xs text-gray-500 mb-2">confidence</span>
                        <div className="flex space-x-2">
                          {alert.hasVideo && (
                            <Button variant="outline" size="sm">
                              <Play className="h-4 w-4 mr-2" />
                              Play
                            </Button>
                          )}
                          <Button variant="outline" size="sm" onClick={() => handleMarkAsReviewed(alert.id)}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark Reviewed
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                {alerts.filter((alert) => alert.status === "new").length === 0 && (
                  <div className="text-center py-12">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No New Alerts</h3>
                    <p className="text-sm text-gray-500">All alerts have been reviewed</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviewed">
          <Card>
            <CardHeader>
              <CardTitle>Reviewed Alerts</CardTitle>
              <CardDescription>Previously reviewed violence alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {alerts
                  .filter((alert) => alert.status === "reviewed")
                  .map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center space-x-4">
                        <div className="bg-gray-100 p-3 rounded-full">
                          <AlertTriangle className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{alert.location}</h4>
                          <p className="text-sm text-gray-500">{alert.time}</p>
                          <div className="flex items-center mt-1">
                            <Badge variant="secondary" className="text-xs">
                              Reviewed
                            </Badge>
                            {alert.hasVideo && <span className="text-xs text-gray-500 ml-2">Video Available</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-lg font-medium">{alert.confidence}%</span>
                        <span className="text-xs text-gray-500 mb-2">confidence</span>
                        <div className="flex space-x-2">
                          {alert.hasVideo && (
                            <Button variant="outline" size="sm">
                              <Play className="h-4 w-4 mr-2" />
                              Play
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Alert Configuration</CardTitle>
                <CardDescription>Configure how violence alerts are generated</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="threshold">Alert Threshold</Label>
                  <div className="flex items-center space-x-2">
                    <input id="threshold" type="range" min="0" max="100" defaultValue="65" className="flex-1" />
                    <span className="w-12 text-right">65%</span>
                  </div>
                  <p className="text-xs text-gray-500">Minimum confidence level required to generate an alert</p>
                </div>

                <div className="space-y-2">
                  <Label>Alert Cooldown Period</Label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="0">No Cooldown</option>
                    <option value="15">15 Seconds</option>
                    <option value="30" selected>
                      30 Seconds
                    </option>
                    <option value="60">1 Minute</option>
                    <option value="300">5 Minutes</option>
                  </select>
                  <p className="text-xs text-gray-500">Minimum time between alerts from the same camera</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="record-clips">Record Alert Clips</Label>
                    <Switch id="record-clips" defaultChecked />
                  </div>
                  <p className="text-xs text-gray-500">Automatically save video clips when violence is detected</p>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="pre-record">Include Pre-Alert Footage</Label>
                    <Switch id="pre-record" defaultChecked />
                  </div>
                  <p className="text-xs text-gray-500">Include 10 seconds of footage before the alert was triggered</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Save Configuration</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure how you receive violence alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-alerts" className="block mb-1">
                        Email Alerts
                      </Label>
                      <p className="text-xs text-gray-500">Send alerts to registered email addresses</p>
                    </div>
                    <Switch id="email-alerts" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sms-alerts" className="block mb-1">
                        SMS Alerts
                      </Label>
                      <p className="text-xs text-gray-500">Send text message alerts to registered phones</p>
                    </div>
                    <Switch id="sms-alerts" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push-alerts" className="block mb-1">
                        Push Notifications
                      </Label>
                      <p className="text-xs text-gray-500">Send alerts to this application</p>
                    </div>
                    <Switch id="push-alerts" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sound-alerts" className="block mb-1">
                        Sound Alerts
                      </Label>
                      <p className="text-xs text-gray-500">Play sound when new alerts are received</p>
                    </div>
                    <Switch id="sound-alerts" defaultChecked />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Notification Recipients</Label>
                  <textarea
                    className="w-full p-2 border rounded-md"
                    rows={3}
                    placeholder="Enter email addresses, separated by commas"
                    defaultValue="admin@example.com, security@example.com"
                  ></textarea>
                </div>

                <div className="space-y-2">
                  <Label>Alert Priority</Label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="all">All Alerts</option>
                    <option value="high" selected>
                      High Confidence Only ({'>'}80%)
                    </option>
                    <option value="critical">Critical Areas Only</option>
                  </select>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Save Notification Settings</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

