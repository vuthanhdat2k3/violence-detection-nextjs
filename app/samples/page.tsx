"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Upload, Play, Trash2, Download, Plus, Filter, CheckCircle, XCircle } from "lucide-react"
import { getSampleFactory, type Sample } from "@/lib/factories/sample-factory"

export default function Samples() {
  const [samples, setSamples] = useState<Sample[]>([])
  const [filterType, setFilterType] = useState<"all" | "Violence" | "Non-Violence">("all")
  const [filterStatus, setFilterStatus] = useState<"all" | "verified" | "unverified">("all")
  const [searchTerm, setSearchTerm] = useState("")

  const sampleFactory = getSampleFactory()

  useEffect(() => {
    // Load samples from the factory
    setSamples(sampleFactory.getAvailableSamples())
  }, [])

  const filteredSamples = samples.filter((sample) => {
    // Filter by type
    if (filterType !== "all" && sample.type !== filterType) {
      return false
    }

    // Filter by status
    if (filterStatus === "verified" && !sample.verified) {
      return false
    }
    if (filterStatus === "unverified" && sample.verified) {
      return false
    }

    // Filter by search term
    if (searchTerm && !sample.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }

    return true
  })

  const handleVerifySample = (sampleId: string, verified: boolean) => {
    const success = sampleFactory.updateSampleVerification(sampleId, verified)
    if (success) {
      // Update the samples list
      setSamples(sampleFactory.getAvailableSamples())
    }
  }

  const handleCreateSample = (type: "Violence" | "Non-Violence", name: string, duration: string) => {
    const newSample = sampleFactory.createSample(type, name, duration)
    // Update the samples list
    setSamples(sampleFactory.getAvailableSamples())
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Sample Management</h1>

      <Tabs defaultValue="all">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="all">All Samples</TabsTrigger>
          <TabsTrigger value="violence">Violence Samples</TabsTrigger>
          <TabsTrigger value="non-violence">Non-Violence Samples</TabsTrigger>
          <TabsTrigger value="upload">Upload New</TabsTrigger>
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
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
              >
                <option value="all">All Types</option>
                <option value="Violence">Violence</option>
                <option value="Non-Violence">Non-Violence</option>
              </select>
              <select
                className="p-2 border rounded-md"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
              >
                <option value="all">All Status</option>
                <option value="verified">Verified</option>
                <option value="unverified">Unverified</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Search samples..."
                className="p-2 border rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="outline" size="sm">
                Search
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredSamples.map((sample) => (
              <Card key={sample.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{sample.name}</CardTitle>
                      <CardDescription>
                        {sample.type} Sample • {sample.duration}
                      </CardDescription>
                    </div>
                    <Badge variant={sample.type === "Violence" ? "destructive" : "default"}>{sample.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gray-200 rounded-md flex items-center justify-center mb-4">
                    <Play className="h-8 w-8 text-gray-400" />
                  </div>

                  <div className="flex justify-between text-sm">
                    <div>
                      <span className="text-gray-500">Added:</span>
                      <p>{sample.date}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <div className="flex items-center">
                        {sample.verified ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                            <span>Verified</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 text-yellow-500 mr-1" />
                            <span>Unverified</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    <Play className="h-4 w-4 mr-2" />
                    Play
                  </Button>
                  {!sample.verified ? (
                    <Button variant="outline" size="sm" onClick={() => handleVerifySample(sample.id, true)}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Verify
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="violence">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {samples
              .filter((sample) => sample.type === "Violence")
              .map((sample) => (
                <Card key={sample.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{sample.name}</CardTitle>
                        <CardDescription>
                          {sample.type} Sample • {sample.duration}
                        </CardDescription>
                      </div>
                      <Badge variant="destructive">{sample.type}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-gray-200 rounded-md flex items-center justify-center mb-4">
                      <Play className="h-8 w-8 text-gray-400" />
                    </div>

                    <div className="flex justify-between text-sm">
                      <div>
                        <span className="text-gray-500">Added:</span>
                        <p>{sample.date}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Status:</span>
                        <div className="flex items-center">
                          {sample.verified ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                              <span>Verified</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 text-yellow-500 mr-1" />
                              <span>Unverified</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">
                      <Play className="h-4 w-4 mr-2" />
                      Play
                    </Button>
                    {!sample.verified ? (
                      <Button variant="outline" size="sm" onClick={() => handleVerifySample(sample.id, true)}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Verify
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="non-violence">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {samples
              .filter((sample) => sample.type === "Non-Violence")
              .map((sample) => (
                <Card key={sample.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{sample.name}</CardTitle>
                        <CardDescription>
                          {sample.type} Sample • {sample.duration}
                        </CardDescription>
                      </div>
                      <Badge>{sample.type}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-gray-200 rounded-md flex items-center justify-center mb-4">
                      <Play className="h-8 w-8 text-gray-400" />
                    </div>

                    <div className="flex justify-between text-sm">
                      <div>
                        <span className="text-gray-500">Added:</span>
                        <p>{sample.date}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Status:</span>
                        <div className="flex items-center">
                          {sample.verified ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                              <span>Verified</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 text-yellow-500 mr-1" />
                              <span>Unverified</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">
                      <Play className="h-4 w-4 mr-2" />
                      Play
                    </Button>
                    {!sample.verified ? (
                      <Button variant="outline" size="sm" onClick={() => handleVerifySample(sample.id, true)}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Verify
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="upload">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Sample Videos</CardTitle>
                <CardDescription>Add new samples to your training dataset</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500">MP4, AVI, MOV up to 100MB</p>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="grid w-full items-center gap-1.5">
                    <label className="text-sm font-medium">Sample Type</label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="violence">Violence</option>
                      <option value="non-violence">Non-Violence</option>
                    </select>
                  </div>

                  <div className="grid w-full items-center gap-1.5">
                    <label className="text-sm font-medium">Sample Name</label>
                    <input type="text" placeholder="Enter sample name" className="w-full p-2 border rounded-md" />
                  </div>

                  <div className="grid w-full items-center gap-1.5">
                    <label className="text-sm font-medium">Description (Optional)</label>
                    <textarea
                      placeholder="Enter description"
                      className="w-full p-2 border rounded-md"
                      rows={3}
                    ></textarea>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => handleCreateSample("Violence", "New Sample", "10s")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Sample
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Extract from Existing Videos</CardTitle>
                <CardDescription>Extract sample clips from longer videos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">Upload a longer video to extract samples</p>
                  <p className="text-xs text-gray-500">MP4, AVI, MOV up to 500MB</p>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="grid w-full items-center gap-1.5">
                    <label className="text-sm font-medium">Extraction Method</label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="manual">Manual Selection</option>
                      <option value="auto">Automatic Detection</option>
                      <option value="interval">Fixed Intervals</option>
                    </select>
                  </div>

                  <div className="grid w-full items-center gap-1.5">
                    <label className="text-sm font-medium">Sample Duration (seconds)</label>
                    <input type="number" defaultValue="10" min="1" max="60" className="w-full p-2 border rounded-md" />
                  </div>

                  <div className="grid w-full items-center gap-1.5">
                    <label className="text-sm font-medium">Default Sample Type</label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="violence">Violence</option>
                      <option value="non-violence">Non-Violence</option>
                      <option value="unclassified">Unclassified</option>
                    </select>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Extract Samples
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

