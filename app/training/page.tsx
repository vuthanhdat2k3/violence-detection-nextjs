"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Upload, Play, Pause, BarChart2, Save, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getTrainingFactory, type TrainingSession } from "@/lib/factories/training-factory"
import { getSampleFactory } from "@/lib/factories/sample-factory"
import { getModelFactory } from "@/lib/factories/model-factory"

export default function Training() {
  const [activeTraining, setActiveTraining] = useState<TrainingSession | null>(null)
  const [trainingSessions, setTrainingSessions] = useState<TrainingSession[]>([])
  const [newModelName, setNewModelName] = useState("New Violence Model")
  const [modelType, setModelType] = useState("violence")
  const [datasetType, setDatasetType] = useState("default")
  const [epochs, setEpochs] = useState(10)
  const [batchSize, setBatchSize] = useState(32)

  const trainingFactory = getTrainingFactory()
  const sampleFactory = getSampleFactory()
  const modelFactory = getModelFactory()

  useEffect(() => {
    // Load training sessions
    setTrainingSessions(trainingFactory.getTrainingSessions())

    // Set up interval to update progress
    const interval = setInterval(() => {
      if (activeTraining) {
        const progress = activeTraining.getProgress()
        if (progress >= 100) {
          setActiveTraining(null)
          // Refresh training sessions
          setTrainingSessions(trainingFactory.getTrainingSessions())
        } else {
          // Force a re-render to update progress
          setActiveTraining({ ...activeTraining })
        }
      }
    }, 500)

    return () => clearInterval(interval)
  }, [activeTraining])

  const startTraining = () => {
    // Get samples based on dataset type
    const samples = sampleFactory.getAvailableSamples()

    // Create a new training session
    const newSession = trainingFactory.createTrainingSession(newModelName, "New Training", samples)

    // Start the training
    newSession.startTraining()
    setActiveTraining(newSession)

    // Update the training sessions list
    setTrainingSessions(trainingFactory.getTrainingSessions())
  }

  const stopTraining = () => {
    if (activeTraining) {
      activeTraining.stopTraining()
      setActiveTraining(null)
      // Refresh training sessions
      setTrainingSessions(trainingFactory.getTrainingSessions())
    }
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Model Training</h1>

      <Tabs defaultValue="new">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="new">New Training</TabsTrigger>
          <TabsTrigger value="finetune">Fine-tune Existing</TabsTrigger>
          <TabsTrigger value="history">Training History</TabsTrigger>
        </TabsList>

        <TabsContent value="new">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Train New Model</CardTitle>
                  <CardDescription>Create and train a new violence detection model</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid w-full items-center gap-1.5">
                      <label className="text-sm font-medium">Model Name</label>
                      <input
                        type="text"
                        placeholder="Enter model name"
                        className="w-full p-2 border rounded-md"
                        value={newModelName}
                        onChange={(e) => setNewModelName(e.target.value)}
                      />
                    </div>

                    <div className="grid w-full items-center gap-1.5">
                      <label className="text-sm font-medium">Model Type</label>
                      <select
                        className="w-full p-2 border rounded-md"
                        value={modelType}
                        onChange={(e) => setModelType(e.target.value)}
                      >
                        <option value="violence">Violence Detection</option>
                        <option value="movement">Movement Detection</option>
                        <option value="behavior">Behavior Analysis</option>
                      </select>
                    </div>

                    <div className="grid w-full items-center gap-1.5">
                      <label className="text-sm font-medium">Training Dataset</label>
                      <select
                        className="w-full p-2 border rounded-md"
                        value={datasetType}
                        onChange={(e) => setDatasetType(e.target.value)}
                      >
                        <option value="default">Default Violence Dataset</option>
                        <option value="extended">Extended Violence Dataset</option>
                        <option value="custom">Custom Dataset</option>
                      </select>
                    </div>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                      <Upload className="mx-auto h-8 w-8 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">Upload additional training data (optional)</p>
                    </div>
                  </div>

                  {activeTraining && (
                    <div className="space-y-4 bg-gray-50 p-4 rounded-md">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">Training Progress</h3>
                        <Badge>{activeTraining.progress}%</Badge>
                      </div>
                      <Progress value={activeTraining.progress} className="h-2" />

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Epoch:</span>
                          <p className="font-medium">{activeTraining.epoch}/10</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Loss:</span>
                          <p className="font-medium">{activeTraining.loss.toFixed(3)}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Accuracy:</span>
                          <p className="font-medium">{activeTraining.accuracy?.toFixed(1) || "0.0"}%</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  {!activeTraining ? (
                    <Button onClick={startTraining} className="w-full">
                      <Play className="h-4 w-4 mr-2" />
                      Start Training
                    </Button>
                  ) : (
                    <div className="flex w-full space-x-4">
                      <Button variant="outline" onClick={stopTraining} className="w-1/2">
                        <Pause className="h-4 w-4 mr-2" />
                        Stop Training
                      </Button>
                      <Button disabled={activeTraining.progress < 100} className="w-1/2">
                        <Save className="h-4 w-4 mr-2" />
                        Save Model
                      </Button>
                    </div>
                  )}
                </CardFooter>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Training Parameters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid w-full items-center gap-1.5">
                    <label className="text-sm font-medium">Epochs</label>
                    <input
                      type="number"
                      value={epochs}
                      onChange={(e) => setEpochs(Number.parseInt(e.target.value))}
                      min="1"
                      max="100"
                      className="w-full p-2 border rounded-md"
                    />
                  </div>

                  <div className="grid w-full items-center gap-1.5">
                    <label className="text-sm font-medium">Batch Size</label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={batchSize}
                      onChange={(e) => setBatchSize(Number.parseInt(e.target.value))}
                    >
                      <option value="8">8</option>
                      <option value="16">16</option>
                      <option value="32">32</option>
                      <option value="64">64</option>
                    </select>
                  </div>

                  <div className="grid w-full items-center gap-1.5">
                    <label className="text-sm font-medium">Learning Rate</label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="0.001">0.001</option>
                      <option value="0.0005" selected>
                        0.0005
                      </option>
                      <option value="0.0001">0.0001</option>
                    </select>
                  </div>

                  <div className="grid w-full items-center gap-1.5">
                    <label className="text-sm font-medium">Optimizer</label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="adam" selected>
                        Adam
                      </option>
                      <option value="sgd">SGD</option>
                      <option value="rmsprop">RMSprop</option>
                    </select>
                  </div>

                  <div className="grid w-full items-center gap-1.5">
                    <label className="text-sm font-medium">Data Augmentation</label>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="augmentation" defaultChecked />
                      <label htmlFor="augmentation">Enable</label>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset to Defaults
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="finetune">
          <Card>
            <CardHeader>
              <CardTitle>Fine-tune Existing Model</CardTitle>
              <CardDescription>Improve an existing model with additional training</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="grid w-full items-center gap-1.5">
                    <label className="text-sm font-medium">Select Base Model</label>
                    <select className="w-full p-2 border rounded-md">
                      {modelFactory.getAvailableModels().map((model) => (
                        <option key={model.id} value={model.id}>
                          {model.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid w-full items-center gap-1.5">
                    <label className="text-sm font-medium">New Model Name</label>
                    <input type="text" placeholder="Enter new model name" className="w-full p-2 border rounded-md" />
                  </div>

                  <div className="grid w-full items-center gap-1.5">
                    <label className="text-sm font-medium">Training Dataset</label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="default">Default Violence Dataset</option>
                      <option value="extended">Extended Violence Dataset</option>
                      <option value="custom">Custom Dataset</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid w-full items-center gap-1.5">
                    <label className="text-sm font-medium">Epochs</label>
                    <input type="number" defaultValue="5" min="1" max="50" className="w-full p-2 border rounded-md" />
                  </div>

                  <div className="grid w-full items-center gap-1.5">
                    <label className="text-sm font-medium">Learning Rate</label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="0.001">0.001</option>
                      <option value="0.0005" selected>
                        0.0005
                      </option>
                      <option value="0.0001">0.0001</option>
                    </select>
                  </div>

                  <div className="grid w-full items-center gap-1.5">
                    <label className="text-sm font-medium">Freeze Layers</label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="none">None (Train All Layers)</option>
                      <option value="partial" selected>
                        Partial (Keep Base Layers)
                      </option>
                      <option value="most">Most (Only Train Final Layers)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">Upload additional training data (optional)</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Play className="h-4 w-4 mr-2" />
                Start Fine-tuning
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Training History</CardTitle>
              <CardDescription>View past training sessions and results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-2 text-left">Date</th>
                        <th className="p-2 text-left">Model</th>
                        <th className="p-2 text-left">Type</th>
                        <th className="p-2 text-left">Duration</th>
                        <th className="p-2 text-left">Final Accuracy</th>
                        <th className="p-2 text-left">Status</th>
                        <th className="p-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trainingSessions.map((session) => {
                        const duration =
                          session.endTime && session.startTime
                            ? Math.round((session.endTime.getTime() - session.startTime.getTime()) / (1000 * 60))
                            : 0

                        const hours = Math.floor(duration / 60)
                        const minutes = duration % 60
                        const durationStr = `${hours}h ${minutes}m`

                        return (
                          <tr key={session.id} className="border-b">
                            <td className="p-2">{session.startTime.toISOString().split("T")[0]}</td>
                            <td className="p-2">{session.modelName}</td>
                            <td className="p-2">{session.type}</td>
                            <td className="p-2">{session.endTime ? durationStr : "In progress"}</td>
                            <td className="p-2">{session.accuracy ? `${session.accuracy.toFixed(1)}%` : "-"}</td>
                            <td className="p-2">
                              <Badge
                                variant={
                                  session.status === "completed"
                                    ? "default"
                                    : session.status === "in-progress"
                                      ? "secondary"
                                      : "destructive"
                                }
                              >
                                {session.status === "completed"
                                  ? "Completed"
                                  : session.status === "in-progress"
                                    ? "In Progress"
                                    : "Failed"}
                              </Badge>
                            </td>
                            <td className="p-2">
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="h-80 flex items-center justify-center bg-gray-100 rounded-md">
                  <div className="text-center">
                    <BarChart2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Training performance charts would be displayed here</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

