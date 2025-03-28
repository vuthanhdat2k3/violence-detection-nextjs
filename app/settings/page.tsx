"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Save, RefreshCw, Database, Shield, Download, Upload } from "lucide-react"

export default function Settings() {
  const [apiEndpoint, setApiEndpoint] = useState("http://localhost:5000")

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">System Settings</h1>

      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="api">API Configuration</TabsTrigger>
          <TabsTrigger value="storage">Storage</TabsTrigger>
          <TabsTrigger value="backup">Backup & Restore</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure basic system settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>System Name</Label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      defaultValue="Violence Detection System"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Default Model</Label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="model1">Default Violence Model</option>
                      <option value="model2" selected>
                        Enhanced Violence Model
                      </option>
                      <option value="model3">Person Movement Model</option>
                      <option value="model4">Custom Behavior Model 1</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>Language</Label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="en" selected>
                        English
                      </option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="ja">Japanese</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Date Format</Label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="mdy" selected>
                        MM/DD/YYYY
                      </option>
                      <option value="dmy">DD/MM/YYYY</option>
                      <option value="ymd">YYYY/MM/DD</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>Time Format</Label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="12" selected>
                        12-hour (AM/PM)
                      </option>
                      <option value="24">24-hour</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="utc">UTC</option>
                      <option value="est" selected>
                        Eastern Time (ET)
                      </option>
                      <option value="cst">Central Time (CT)</option>
                      <option value="mst">Mountain Time (MT)</option>
                      <option value="pst">Pacific Time (PT)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-medium">System Behavior</h3>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-start" className="block mb-1">
                      Auto-start on System Boot
                    </Label>
                    <p className="text-xs text-gray-500">Automatically start detection when system boots</p>
                  </div>
                  <Switch id="auto-start" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="gpu-accel" className="block mb-1">
                      GPU Acceleration
                    </Label>
                    <p className="text-xs text-gray-500">Use GPU for model inference when available</p>
                  </div>
                  <Switch id="gpu-accel" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-update" className="block mb-1">
                      Automatic Updates
                    </Label>
                    <p className="text-xs text-gray-500">Automatically check for and install updates</p>
                  </div>
                  <Switch id="auto-update" defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
              <CardDescription>Configure connection to the backend API</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>API Endpoint</Label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={apiEndpoint}
                  onChange={(e) => setApiEndpoint(e.target.value)}
                />
                <p className="text-xs text-gray-500">The URL of your Flask backend API</p>
              </div>

              <div className="space-y-2">
                <Label>API Authentication</Label>
                <select className="w-full p-2 border rounded-md">
                  <option value="none" selected>
                    None
                  </option>
                  <option value="basic">Basic Auth</option>
                  <option value="token">API Token</option>
                  <option value="oauth">OAuth 2.0</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>API Timeout (seconds)</Label>
                <input type="number" className="w-full p-2 border rounded-md" defaultValue="30" min="1" max="300" />
              </div>

              <div className="flex justify-end">
                <Button variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Test Connection
                </Button>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-medium">Advanced API Settings</h3>

                <div className="space-y-2">
                  <Label>Request Retry Attempts</Label>
                  <input type="number" className="w-full p-2 border rounded-md" defaultValue="3" min="0" max="10" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="keep-alive" className="block mb-1">
                      Keep-Alive Connections
                    </Label>
                    <p className="text-xs text-gray-500">Maintain persistent connections to the API</p>
                  </div>
                  <Switch id="keep-alive" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="debug-mode" className="block mb-1">
                      API Debug Mode
                    </Label>
                    <p className="text-xs text-gray-500">Log detailed API request and response information</p>
                  </div>
                  <Switch id="debug-mode" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Save API Configuration
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="storage">
          <Card>
            <CardHeader>
              <CardTitle>Storage Settings</CardTitle>
              <CardDescription>Configure storage for models, samples, and detection clips</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Model Storage Location</Label>
                    <div className="flex">
                      <input type="text" className="flex-1 p-2 border rounded-l-md" defaultValue="./models" />
                      <Button className="rounded-l-none">Browse</Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Sample Storage Location</Label>
                    <div className="flex">
                      <input type="text" className="flex-1 p-2 border rounded-l-md" defaultValue="./samples" />
                      <Button className="rounded-l-none">Browse</Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Alert Clip Storage Location</Label>
                    <div className="flex">
                      <input type="text" className="flex-1 p-2 border rounded-l-md" defaultValue="./clips" />
                      <Button className="rounded-l-none">Browse</Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Storage Usage</h3>
                      <Button variant="outline" size="sm">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Models</span>
                          <span>1.2 GB / 10 GB</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: "12%" }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Samples</span>
                          <span>3.8 GB / 10 GB</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: "38%" }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Alert Clips</span>
                          <span>5.5 GB / 10 GB</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "55%" }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Total</span>
                          <span>10.5 GB / 30 GB</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: "35%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Storage Cleanup Policy</Label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="manual">Manual Cleanup</option>
                      <option value="30days" selected>
                        Auto-delete After 30 Days
                      </option>
                      <option value="90days">Auto-delete After 90 Days</option>
                      <option value="space">Auto-delete When Space Low</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="compress" className="block mb-1">
                        Compress Stored Files
                      </Label>
                      <p className="text-xs text-gray-500">Compress files to save storage space</p>
                    </div>
                    <Switch id="compress" defaultChecked />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-medium">Database Settings</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Database Type</Label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="sqlite" selected>
                        SQLite
                      </option>
                      <option value="mysql">MySQL</option>
                      <option value="postgres">PostgreSQL</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>Database Location</Label>
                    <div className="flex">
                      <input type="text" className="flex-1 p-2 border rounded-l-md" defaultValue="./database.db" />
                      <Button className="rounded-l-none">Browse</Button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline">
                    <Database className="h-4 w-4 mr-2" />
                    Optimize Database
                  </Button>
                  <Button variant="outline">
                    <Shield className="h-4 w-4 mr-2" />
                    Backup Database
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Save Storage Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="backup">
          <Card>
            <CardHeader>
              <CardTitle>Backup & Restore</CardTitle>
              <CardDescription>Backup and restore system configuration and data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Create Backup</h3>

                  <div className="space-y-2">
                    <Label>Backup Contents</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="backup-config" defaultChecked />
                        <Label htmlFor="backup-config">System Configuration</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="backup-models" defaultChecked />
                        <Label htmlFor="backup-models">Models</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="backup-samples" defaultChecked />
                        <Label htmlFor="backup-samples">Samples</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="backup-alerts" defaultChecked />
                        <Label htmlFor="backup-alerts">Alert History</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="backup-clips" />
                        <Label htmlFor="backup-clips">Alert Clips</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Backup Location</Label>
                    <div className="flex">
                      <input type="text" className="flex-1 p-2 border rounded-l-md" defaultValue="./backups" />
                      <Button className="rounded-l-none">Browse</Button>
                    </div>
                  </div>

                  <Button className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Create Backup
                  </Button>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Restore from Backup</h3>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">Click to upload or drag and drop backup file</p>
                    <p className="text-xs text-gray-500">.zip or .backup files</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Restore Options</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="restore-config" defaultChecked />
                        <Label htmlFor="restore-config">System Configuration</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="restore-models" defaultChecked />
                        <Label htmlFor="restore-models">Models</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="restore-samples" defaultChecked />
                        <Label htmlFor="restore-samples">Samples</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="restore-alerts" defaultChecked />
                        <Label htmlFor="restore-alerts">Alert History</Label>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full" disabled>
                    <Upload className="h-4 w-4 mr-2" />
                    Restore from Backup
                  </Button>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-medium">Scheduled Backups</h3>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-backup" className="block mb-1">
                      Automatic Backups
                    </Label>
                    <p className="text-xs text-gray-500">Create backups on a regular schedule</p>
                  </div>
                  <Switch id="auto-backup" defaultChecked />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Backup Frequency</Label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="daily">Daily</option>
                      <option value="weekly" selected>
                        Weekly
                      </option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>Retention Policy</Label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="3">Keep Last 3 Backups</option>
                      <option value="5" selected>
                        Keep Last 5 Backups
                      </option>
                      <option value="10">Keep Last 10 Backups</option>
                      <option value="all">Keep All Backups</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Save Backup Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

