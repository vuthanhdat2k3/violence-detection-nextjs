"use client"

import type { FormEvent } from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Camera, AlertCircle, CheckCircle, Plus, Settings } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { getModelFactory } from "@/lib/factories/model-factory"
import {
  getDetectorFactory,
  type CameraDetectionInput,
  type CameraDetectionResult,
} from "@/lib/factories/detector-factory"

// API URL from environment variable or default to localhost during development
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export default function CameraDetection() {
  const [isStarted, setIsStarted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [selectedCamera, setSelectedCamera] = useState("webcam")
  const [selectedModelId, setSelectedModelId] = useState("model2") // Default to Enhanced Violence Model
  const [alertThreshold, setAlertThreshold] = useState(65)
  const [enableNotifications, setEnableNotifications] = useState(true)
  const [recordDetections, setRecordDetections] = useState(true)

  const [cameras] = useState([
    { id: "webcam", name: "Webcam" },
    { id: "cam1", name: "Front Entrance" },
    { id: "cam2", name: "Parking Lot" },
    { id: "cam3", name: "Hallway" },
  ])

  const [models, setModels] = useState(getModelFactory().getAvailableModels())

  const startCameraDetection = async (e?: FormEvent) => {
    if (e) e.preventDefault()

    setIsLoading(true)
    setError(null)

    try {
      // Get the selected model
      const modelFactory = getModelFactory()
      const model = modelFactory.getModelById(selectedModelId)

      if (!model) {
        throw new Error("Selected model not found")
      }

      // Create a detector using the factory
      const detectorFactory = getDetectorFactory()
      const detector = detectorFactory.createDetector("camera", model)

      // Use the detector to start camera detection
      const input: CameraDetectionInput = { cameraId: selectedCamera }
      const result = (await detector.detect(input)) as CameraDetectionResult

      setMessage(result.message)
      setIsStarted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      setIsStarted(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Camera Detection</h1>

      <Tabs defaultValue="live">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="live">Live Detection</TabsTrigger>
          <TabsTrigger value="cameras">Camera Management</TabsTrigger>
          <TabsTrigger value="settings">Detection Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="live">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Live Camera Feed</CardTitle>
                  <CardDescription>Real-time violence detection from selected camera</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center h-80 bg-gray-100 rounded-md">
                  {isStarted ? (
                    <div className="text-center">
                      <p className="text-gray-500 mb-2">Camera window is open on the server machine</p>
                      <p className="text-sm text-gray-400">Press 'q' on the server to stop detection</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Camera className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Select a camera and click "Start Detection"</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="w-1/3">
                    <Select value={selectedCamera} onValueChange={setSelectedCamera}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Camera" />
                      </SelectTrigger>
                      <SelectContent>
                        {cameras.map((camera) => (
                          <SelectItem key={camera.id} value={camera.id}>
                            {camera.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={startCameraDetection} disabled={isLoading || isStarted} className="w-1/2">
                    {isLoading ? "Starting..." : isStarted ? "Detection Running" : "Start Detection"}
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Detection Model</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={selectedModelId} onValueChange={setSelectedModelId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Model" />
                    </SelectTrigger>
                    <SelectContent>
                      {models
                        .filter((model) => model.status === "active")
                        .map((model) => (
                          <SelectItem key={model.id} value={model.id}>
                            {model.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Detection Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="threshold">Alert Threshold: {alertThreshold}%</Label>
                    <input
                      id="threshold"
                      type="range"
                      min="0"
                      max="100"
                      value={alertThreshold}
                      onChange={(e) => setAlertThreshold(Number.parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifications">Enable Notifications</Label>
                    <Switch id="notifications" checked={enableNotifications} onCheckedChange={setEnableNotifications} />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="record">Record Detections</Label>
                    <Switch id="record" checked={recordDetections} onCheckedChange={setRecordDetections} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <Alert variant="destructive" className="mt-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Success Message */}
          {message && (
            <Alert className="border-green-500 bg-green-50 mt-6">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-700">Detection Started</AlertTitle>
              <AlertDescription className="text-green-600">
                {message}. A window should now be open on your computer showing the camera feed with violence detection.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="cameras">
          <Card>
            <CardHeader>
              <CardTitle>Camera Management</CardTitle>
              <CardDescription>Configure and manage surveillance cameras</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cameras.map((camera) => (
                  <div key={camera.id} className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Camera className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{camera.name}</h4>
                        <p className="text-sm text-gray-500">ID: {camera.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                      <Button variant="outline" size="sm">
                        Test
                      </Button>
                    </div>
                  </div>
                ))}

                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Camera
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Detection Settings</CardTitle>
              <CardDescription>Configure violence detection parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Detection Parameters</h3>

                    <div className="space-y-2">
                      <Label htmlFor="global-threshold">Global Alert Threshold</Label>
                      <div className="flex items-center space-x-2">
                        <input
                          id="global-threshold"
                          type="range"
                          min="0"
                          max="100"
                          value={alertThreshold}
                          onChange={(e) => setAlertThreshold(Number.parseInt(e.target.value))}
                          className="flex-1"
                        />
                        <span className="w-12 text-right">{alertThreshold}%</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Detection Frequency</Label>
                      <Select defaultValue="normal">
                        <SelectTrigger>
                          <SelectValue placeholder="Select Frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low (Every 3 seconds)</SelectItem>
                          <SelectItem value="normal">Normal (Every 1.5 seconds)</SelectItem>
                          <SelectItem value="high">High (Every 0.5 seconds)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Frame Buffer Size</Label>
                      <Select defaultValue="30">
                        <SelectTrigger>
                          <SelectValue placeholder="Select Buffer Size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 Frames</SelectItem>
                          <SelectItem value="30">30 Frames</SelectItem>
                          <SelectItem value="45">45 Frames</SelectItem>
                          <SelectItem value="60">60 Frames</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Notification Settings</h3>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-alerts">Email Alerts</Label>
                      <Switch id="email-alerts" />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="sms-alerts">SMS Alerts</Label>
                      <Switch id="sms-alerts" />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="push-alerts">Push Notifications</Label>
                      <Switch id="push-alerts" checked={enableNotifications} onCheckedChange={setEnableNotifications} />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="record-clips">Record Alert Clips</Label>
                      <Switch id="record-clips" checked={recordDetections} onCheckedChange={setRecordDetections} />
                    </div>

                    <div className="space-y-2">
                      <Label>Alert Cooldown Period</Label>
                      <Select defaultValue="30">
                        <SelectTrigger>
                          <SelectValue placeholder="Select Cooldown" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">No Cooldown</SelectItem>
                          <SelectItem value="15">15 Seconds</SelectItem>
                          <SelectItem value="30">30 Seconds</SelectItem>
                          <SelectItem value="60">1 Minute</SelectItem>
                          <SelectItem value="300">5 Minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Button className="w-full">Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

