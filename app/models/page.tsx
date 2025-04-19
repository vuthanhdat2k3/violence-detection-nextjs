"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Download, Upload, Play, Pause, BarChart2, Plus, Trash2, Edit } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { getModelFactory, type ModelInfo } from "@/lib/factories/model-factory"

export default function ModelManagement() {
  const [models, setModels] = useState<ModelInfo[]>([])
  const modelFactory = getModelFactory()

  useEffect(() => {
    // Load models from the factory
    setModels(modelFactory.getAvailableModels())
  }, [modelFactory])

  const handleActivateDeactivate = (modelId: string, currentStatus: "active" | "inactive") => {
    const newStatus = currentStatus === "active" ? "inactive" : "active"
    const success = modelFactory.updateModelStatus(modelId, newStatus)

    if (success) {
      // Update the models list
      setModels(modelFactory.getAvailableModels())
    }
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Model Management</h1>

      <Tabs defaultValue="models">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="models">Available Models</TabsTrigger>
          <TabsTrigger value="import">Import/Export</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="models">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {models.map((model) => (
              <Card key={model.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{model.name}</CardTitle>
                      <CardDescription>{model.type}</CardDescription>
                    </div>
                    <Badge variant={model.status === "active" ? "default" : "secondary"}>
                      {model.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Accuracy</span>
                        <span className="font-medium">{model.accuracy.toFixed(1)}%</span>
                      </div>
                      <Progress value={model.accuracy} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Last Updated:</span>
                        <p>{model.lastUpdated}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Size:</span>
                        <p>{model.size}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  {model.status === "active" ? (
                    <Button variant="outline" size="sm" onClick={() => handleActivateDeactivate(model.id, "active")}>
                      <Pause className="h-4 w-4 mr-2" />
                      Deactivate
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => handleActivateDeactivate(model.id, "inactive")}>
                      <Play className="h-4 w-4 mr-2" />
                      Activate
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}

            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center h-full py-12">
                <Plus className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">Add New Model</h3>
                <p className="text-sm text-gray-500 text-center mb-4">Import a pre-trained model or create a new one</p>
                <Button>Create New Model</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="import">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Import Model</CardTitle>
                <CardDescription>Import a pre-trained model from file</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500">Supported formats: .h5, .pb, .tflite</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Import Model</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Export Model</CardTitle>
                <CardDescription>Export a trained model for backup or sharing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Model</label>
                  <select className="w-full p-2 border rounded-md">
                    {models.map((model) => (
                      <option key={model.id} value={model.id}>
                        {model.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Export Format</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="h5">TensorFlow (.h5)</option>
                    <option value="pb">TensorFlow SavedModel (.pb)</option>
                    <option value="tflite">TensorFlow Lite (.tflite)</option>
                  </select>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Export Model
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Model Performance Comparison</CardTitle>
              <CardDescription>Compare accuracy and performance metrics across models</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center bg-gray-100 rounded-md">
                <div className="text-center">
                  <BarChart2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Performance charts would be displayed here</p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-medium">Performance Metrics</h3>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-2 text-left">Model</th>
                        <th className="p-2 text-left">Accuracy</th>
                        <th className="p-2 text-left">Precision</th>
                        <th className="p-2 text-left">Recall</th>
                        <th className="p-2 text-left">F1 Score</th>
                        <th className="p-2 text-left">Inference Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {models.map((model) => (
                        <tr key={model.id} className="border-b">
                          <td className="p-2">{model.name}</td>
                          <td className="p-2">{model.accuracy.toFixed(1)}%</td>
                          <td className="p-2">{(Math.random() * 10 + 85).toFixed(1)}%</td>
                          <td className="p-2">{(Math.random() * 10 + 85).toFixed(1)}%</td>
                          <td className="p-2">{(Math.random() * 10 + 85).toFixed(1)}%</td>
                          <td className="p-2">{(Math.random() * 100 + 50).toFixed(0)} ms</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

