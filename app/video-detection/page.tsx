"use client"

import type React from "react"

import type { FormEvent } from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Upload, AlertCircle, CheckCircle, XCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getModelFactory } from "@/lib/factories/model-factory"
import {
  getDetectorFactory,
  type VideoDetectionResult,
  type VideoDetectionInput,
} from "@/lib/factories/detector-factory"

// API URL from environment variable or default to localhost during development
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export default function VideoDetection() {
  const [file, setFile] = useState<File | null>(null)
  const [videoSrc, setVideoSrc] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    fight: boolean
    percentageoffight: string
    processing_time_ms: string
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [activeTab, setActiveTab] = useState("upload")
  const [selectedModelId, setSelectedModelId] = useState("model2") // Default to Enhanced Violence Model

  const [models, setModels] = useState(getModelFactory().getAvailableModels())

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Check if file is a video
      if (!selectedFile.type.startsWith("video/")) {
        setError("Please upload a video file")
        setFile(null)
        setVideoSrc(null)
        return
      }

      // Check file size (100MB limit)
      if (selectedFile.size > 100 * 1024 * 1024) {
        setError("File size exceeds 100MB limit")
        setFile(null)
        setVideoSrc(null)
        return
      }

      setFile(selectedFile)
      setError(null)
      setResult(null)

      // Create a URL for the video preview
      const url = URL.createObjectURL(selectedFile)
      setVideoSrc(url)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault()

    if (!file) {
      setError("Please upload a video first")
      return
    }

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
      const detector = detectorFactory.createDetector("video", model)

      // Use the detector to analyze the video
      const input: VideoDetectionInput = { videoFile: file }
      const detectionResult = (await detector.detect(input)) as VideoDetectionResult

      setResult(detectionResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (videoSrc) {
        URL.revokeObjectURL(videoSrc)
      }
    }
  }, [videoSrc])

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Video Detection</h1>

      <Tabs defaultValue="upload" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="upload">Upload Video</TabsTrigger>
          <TabsTrigger value="url">Video URL</TabsTrigger>
          <TabsTrigger value="batch">Batch Processing</TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle>Upload Video for Analysis</CardTitle>
              <CardDescription>Upload a video file to detect violent behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Model</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={selectedModelId}
                    onChange={(e) => setSelectedModelId(e.target.value)}
                  >
                    {models
                      .filter((model) => model.status === "active")
                      .map((model) => (
                        <option key={model.id} value={model.id}>
                          {model.name} ({model.accuracy.toFixed(1)}% accuracy)
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* File Upload Area */}
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={handleUploadClick}
              >
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="video/*" className="hidden" />
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500">MP4, AVI, MOV up to 100MB</p>
              </div>

              {/* Video Preview */}
              {videoSrc && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Video Preview:</h3>
                  <video
                    src={videoSrc}
                    controls
                    className="w-full rounded-md border border-gray-200"
                    style={{ maxHeight: "300px" }}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {file?.name} ({(file?.size / (1024 * 1024)).toFixed(2)} MB)
                  </p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Loading State */}
              {isLoading && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Processing video...</p>
                  <Progress value={45} className="h-2" />
                </div>
              )}

              {/* Results */}
              {result && (
                <Alert className={result.fight ? "border-red-500 bg-red-50" : "border-green-500 bg-green-50"}>
                  {result.fight ? (
                    <XCircle className="h-4 w-4 text-red-600" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                  <AlertTitle className={result.fight ? "text-red-700" : "text-green-700"}>
                    {result.fight ? "Violence Detected" : "No Violence Detected"}
                  </AlertTitle>
                  <AlertDescription>
                    <div className="mt-2 text-sm">
                      <p>
                        <strong>Confidence:</strong> {result.percentageoffight}%
                      </p>
                      <p>
                        <strong>Processing Time:</strong> {result.processing_time_ms}ms
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={handleSubmit} disabled={!file || isLoading} className="w-full">
                {isLoading ? "Processing..." : "Analyze Video"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="url">
          <Card>
            <CardHeader>
              <CardTitle>Analyze Video from URL</CardTitle>
              <CardDescription>Enter a URL to a video file for analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Model</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={selectedModelId}
                    onChange={(e) => setSelectedModelId(e.target.value)}
                  >
                    {models
                      .filter((model) => model.status === "active")
                      .map((model) => (
                        <option key={model.id} value={model.id}>
                          {model.name} ({model.accuracy.toFixed(1)}% accuracy)
                        </option>
                      ))}
                  </select>
                </div>

                <div className="grid w-full items-center gap-1.5">
                  <label htmlFor="video-url" className="text-sm font-medium">
                    Video URL
                  </label>
                  <input
                    id="video-url"
                    type="url"
                    placeholder="https://example.com/video.mp4"
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <p className="text-sm text-gray-500">Supported formats: MP4, AVI, MOV. Maximum file size: 100MB.</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Analyze from URL</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="batch">
          <Card>
            <CardHeader>
              <CardTitle>Batch Processing</CardTitle>
              <CardDescription>Upload multiple videos for batch analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Model</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={selectedModelId}
                    onChange={(e) => setSelectedModelId(e.target.value)}
                  >
                    {models
                      .filter((model) => model.status === "active")
                      .map((model) => (
                        <option key={model.id} value={model.id}>
                          {model.name} ({model.accuracy.toFixed(1)}% accuracy)
                        </option>
                      ))}
                  </select>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">Click to upload multiple videos or drag and drop</p>
                  <p className="text-xs text-gray-500">MP4, AVI, MOV up to 100MB each</p>
                </div>
                <p className="text-sm text-gray-500">
                  Upload up to 10 videos for batch processing. Results will be available for download when complete.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Start Batch Processing</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

