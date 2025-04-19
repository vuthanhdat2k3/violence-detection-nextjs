"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Play, Trash2, Download, Filter, CheckCircle, XCircle } from "lucide-react"
import { getSampleFactory, type Sample } from "@/lib/factories/sample-factory"

export default function Samples() {
  const [samples, setSamples] = useState<Sample[]>([])
  const [filterType, setFilterType] = useState<"all" | "Violence" | "Non-Violence">("all")
  const [filterStatus, setFilterStatus] = useState<"all" | "verified" | "unverified">("all")
  const [searchTerm, setSearchTerm] = useState("")

  const sampleFactory = getSampleFactory()

  const loadSamples = useCallback(() => {
    setSamples(sampleFactory.getAvailableSamples())
  }, [sampleFactory])

  useEffect(() => {
    loadSamples()
  }, [loadSamples])

  const filteredSamples = samples.filter((sample) => {
    if (filterType !== "all" && sample.type !== filterType) {
      return false
    }

    if (filterStatus === "verified" && !sample.verified) {
      return false
    }
    if (filterStatus === "unverified" && sample.verified) {
      return false
    }

    if (searchTerm && !sample.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }

    return true
  })

  const handleVerifySample = useCallback((sampleId: string, verified: boolean) => {
    const success = sampleFactory.updateSampleVerification(sampleId, verified)
    if (success) {
      loadSamples()
    }
  }, [sampleFactory, loadSamples])

  // const handleCreateSample = useCallback((type: "Violence" | "Non-Violence", name: string, duration: string) => {
  //   const success = sampleFactory.createSample(type, name, duration)
  //   if (success) {
  //     loadSamples()
  //   }
  // }, [sampleFactory, loadSamples])

  const handleDeleteSample = useCallback((sampleId: string) => {
    const success = sampleFactory.deleteSample(sampleId)
    if (success) {
      loadSamples()
    }
  }, [sampleFactory, loadSamples])

  const handlePlaySample = useCallback((sampleId: string) => {
    // Implement play functionality
    console.log(`Playing sample: ${sampleId}`)
  }, [])

  const handleDownloadSample = useCallback((sampleId: string) => {
    // Implement download functionality
    console.log(`Downloading sample: ${sampleId}`)
  }, [])

  const renderSampleCard = (sample: Sample) => (
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
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handlePlaySample(sample.id)}
        >
          <Play className="h-4 w-4 mr-2" />
          Play
        </Button>
        {!sample.verified ? (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleVerifySample(sample.id, true)}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Verify
          </Button>
        ) : (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleDownloadSample(sample.id)}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        )}
        <Button 
          variant="outline" 
          size="sm" 
          className="text-red-500 hover:text-red-700"
          onClick={() => handleDeleteSample(sample.id)}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  )

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
                onChange={(e) => setFilterType(e.target.value as "all" | "Violence" | "Non-Violence")}
              >
                <option value="all">All Types</option>
                <option value="Violence">Violence</option>
                <option value="Non-Violence">Non-Violence</option>
              </select>
              <select
                className="p-2 border rounded-md"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as "all" | "verified" | "unverified")}
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
            {filteredSamples.map(renderSampleCard)}
          </div>
        </TabsContent>

        <TabsContent value="violence">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {samples
              .filter((sample) => sample.type === "Violence")
              .map(renderSampleCard)}
          </div>
        </TabsContent>

        <TabsContent value="non-violence">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {samples
              .filter((sample) => sample.type === "Non-Violence")
              .map(renderSampleCard)}
          </div>
        </TabsContent>

        <TabsContent value="upload">
          {/* Add upload form here */}
        </TabsContent>
      </Tabs>
    </div>
  )
}

