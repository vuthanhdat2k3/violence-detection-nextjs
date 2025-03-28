"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart2, PieChart, LineChart, Calendar, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Statistics() {
  const [dateRange, setDateRange] = useState("month")

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Statistics & Analytics</h1>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="models">Model Statistics</TabsTrigger>
          <TabsTrigger value="samples">Sample Statistics</TabsTrigger>
          <TabsTrigger value="detections">Detection History</TabsTrigger>
        </TabsList>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Time Period:</span>
            <select className="p-2 border rounded-md" value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="quarter">Last 3 Months</option>
              <option value="year">Last 12 Months</option>
              <option value="all">All Time</option>
            </select>
          </div>

          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Detection Summary</CardTitle>
                <CardDescription>
                  Violence detection statistics for{" "}
                  {dateRange === "week"
                    ? "the last 7 days"
                    : dateRange === "month"
                      ? "the last 30 days"
                      : dateRange === "quarter"
                        ? "the last 3 months"
                        : dateRange === "year"
                          ? "the last 12 months"
                          : "all time"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-gray-100 rounded-md">
                  <div className="text-center">
                    <PieChart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Detection summary chart would be displayed here</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-lg font-medium text-red-600">127</h3>
                    <p className="text-sm text-gray-500">Violence Detected</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-lg font-medium text-green-600">1,458</h3>
                    <p className="text-sm text-gray-500">Non-Violence Detected</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-lg font-medium">8.0%</h3>
                    <p className="text-sm text-gray-500">Violence Percentage</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-lg font-medium">52.8</h3>
                    <p className="text-sm text-gray-500">Avg. Detections per Day</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detection Trend</CardTitle>
                <CardDescription>Violence detection trend over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-gray-100 rounded-md">
                  <div className="text-center">
                    <LineChart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Detection trend chart would be displayed here</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-lg font-medium text-blue-600">+12.5%</h3>
                    <p className="text-sm text-gray-500">Detection Rate Change</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-lg font-medium text-yellow-600">-3.2%</h3>
                    <p className="text-sm text-gray-500">False Positive Change</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-lg font-medium">Feb 15</h3>
                    <p className="text-sm text-gray-500">Peak Detection Day</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-lg font-medium">8:00 PM</h3>
                    <p className="text-sm text-gray-500">Peak Detection Time</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Detection by Location</CardTitle>
                <CardDescription>Violence detection distribution by camera location</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-gray-100 rounded-md">
                  <div className="text-center">
                    <BarChart2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Location distribution chart would be displayed here</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mt-6">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-lg font-medium text-red-600">42</h3>
                    <p className="text-sm text-gray-500">Main Entrance</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-lg font-medium text-red-600">35</h3>
                    <p className="text-sm text-gray-500">Parking Lot</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-lg font-medium text-red-600">28</h3>
                    <p className="text-sm text-gray-500">Hallway</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-lg font-medium text-red-600">22</h3>
                    <p className="text-sm text-gray-500">Cafeteria</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="models">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Model Performance Comparison</CardTitle>
                <CardDescription>Accuracy comparison across different models</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-gray-100 rounded-md">
                  <div className="text-center">
                    <BarChart2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Model performance chart would be displayed here</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-lg font-medium">96.2%</h3>
                    <p className="text-sm text-gray-500">Enhanced Violence Model</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-lg font-medium">94.7%</h3>
                    <p className="text-sm text-gray-500">Default Violence Model</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-lg font-medium">92.5%</h3>
                    <p className="text-sm text-gray-500">Person Movement Model</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-lg font-medium">88.3%</h3>
                    <p className="text-sm text-gray-500">Custom Behavior Model</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Training History</CardTitle>
                <CardDescription>Model training metrics over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-gray-100 rounded-md">
                  <div className="text-center">
                    <LineChart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Training history chart would be displayed here</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-lg font-medium">12</h3>
                    <p className="text-sm text-gray-500">Total Training Sessions</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-lg font-medium">45.2 hrs</h3>
                    <p className="text-sm text-gray-500">Total Training Time</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-lg font-medium">+1.5%</h3>
                    <p className="text-sm text-gray-500">Avg. Accuracy Improvement</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-lg font-medium">3</h3>
                    <p className="text-sm text-gray-500">Failed Training Sessions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Model Metrics Breakdown</CardTitle>
                <CardDescription>Detailed performance metrics for each model</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-2 text-left">Model</th>
                        <th className="p-2 text-left">Accuracy</th>
                        <th className="p-2 text-left">Precision</th>
                        <th className="p-2 text-left">Recall</th>
                        <th className="p-2 text-left">F1 Score</th>
                        <th className="p-2 text-left">False Positives</th>
                        <th className="p-2 text-left">False Negatives</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-2">Enhanced Violence Model</td>
                        <td className="p-2">96.2%</td>
                        <td className="p-2">94.8%</td>
                        <td className="p-2">95.3%</td>
                        <td className="p-2">95.0%</td>
                        <td className="p-2">3.2%</td>
                        <td className="p-2">2.1%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Default Violence Model</td>
                        <td className="p-2">94.7%</td>
                        <td className="p-2">93.5%</td>
                        <td className="p-2">92.8%</td>
                        <td className="p-2">93.1%</td>
                        <td className="p-2">4.5%</td>
                        <td className="p-2">3.8%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Person Movement Model</td>
                        <td className="p-2">92.5%</td>
                        <td className="p-2">91.2%</td>
                        <td className="p-2">90.8%</td>
                        <td className="p-2">91.0%</td>
                        <td className="p-2">5.3%</td>
                        <td className="p-2">4.7%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Custom Behavior Model</td>
                        <td className="p-2">88.3%</td>
                        <td className="p-2">87.5%</td>
                        <td className="p-2">86.9%</td>
                        <td className="p-2">87.2%</td>
                        <td className="p-2">7.8%</td>
                        <td className="p-2">6.5%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="samples">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sample Distribution</CardTitle>
                <CardDescription>Distribution of samples by type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-gray-100 rounded-md">
                  <div className="text-center">
                    <PieChart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Sample distribution chart would be displayed here</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-lg font-medium text-red-600">520</h3>
                    <p className="text-sm text-gray-500">Violence Samples</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-lg font-medium text-green-600">720</h3>
                    <p className="text-sm text-gray-500">Non-Violence Samples</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-lg font-medium">1,240</h3>
                    <p className="text-sm text-gray-500">Total Samples</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-lg font-medium">42:58</h3>
                    <p className="text-sm text-gray-500">Violence:Non-Violence Ratio</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sample Growth</CardTitle>
                <CardDescription>Growth of sample database over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-gray-100 rounded-md">
                  <div className="text-center">
                    <LineChart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Sample growth chart would be displayed here</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-lg font-medium">+85</h3>
                    <p className="text-sm text-gray-500">New Samples (Last 30 Days)</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-lg font-medium">+7.3%</h3>
                    <p className="text-sm text-gray-500">Growth Rate</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-lg font-medium">45:55</h3>
                    <p className="text-sm text-gray-500">New Violence:Non-Violence Ratio</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-lg font-medium">2.8</h3>
                    <p className="text-sm text-gray-500">Avg. New Samples per Day</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Sample Quality Metrics</CardTitle>
                <CardDescription>Quality assessment of training samples</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="h-60 flex items-center justify-center bg-gray-100 rounded-md">
                    <div className="text-center">
                      <BarChart2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Sample quality chart would be displayed here</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h3 className="text-lg font-medium">85.2%</h3>
                      <p className="text-sm text-gray-500">Verified Samples</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h3 className="text-lg font-medium">12.5%</h3>
                      <p className="text-sm text-gray-500">Samples Needing Review</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h3 className="text-lg font-medium">2.3%</h3>
                      <p className="text-sm text-gray-500">Rejected Samples</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="detections">
          <Card>
            <CardHeader>
              <CardTitle>Detection History</CardTitle>
              <CardDescription>Historical record of violence detections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <span className="text-sm font-medium">Date Range:</span>
                  <input type="date" className="p-1 border rounded-md" />
                  <span>to</span>
                  <input type="date" className="p-1 border rounded-md" />
                </div>

                <Button variant="outline" size="sm">
                  Apply Filter
                </Button>
              </div>

              <div className="h-80 flex items-center justify-center bg-gray-100 rounded-md mb-6">
                <div className="text-center">
                  <LineChart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Detection history chart would be displayed here</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 text-left">Date & Time</th>
                      <th className="p-2 text-left">Location</th>
                      <th className="p-2 text-left">Detection Type</th>
                      <th className="p-2 text-left">Confidence</th>
                      <th className="p-2 text-left">Model Used</th>
                      <th className="p-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2">2024-03-20 10:23 AM</td>
                      <td className="p-2">Main Entrance</td>
                      <td className="p-2 text-red-600">Violence</td>
                      <td className="p-2">87%</td>
                      <td className="p-2">Enhanced Violence Model</td>
                      <td className="p-2">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">2024-03-19 08:45 PM</td>
                      <td className="p-2">Parking Lot</td>
                      <td className="p-2 text-red-600">Violence</td>
                      <td className="p-2">92%</td>
                      <td className="p-2">Enhanced Violence Model</td>
                      <td className="p-2">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">2024-03-19 03:12 PM</td>
                      <td className="p-2">Hallway</td>
                      <td className="p-2 text-red-600">Violence</td>
                      <td className="p-2">78%</td>
                      <td className="p-2">Default Violence Model</td>
                      <td className="p-2">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">2024-03-18 11:05 AM</td>
                      <td className="p-2">Cafeteria</td>
                      <td className="p-2 text-red-600">Violence</td>
                      <td className="p-2">83%</td>
                      <td className="p-2">Enhanced Violence Model</td>
                      <td className="p-2">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">2024-03-17 02:30 PM</td>
                      <td className="p-2">Main Entrance</td>
                      <td className="p-2 text-red-600">Violence</td>
                      <td className="p-2">75%</td>
                      <td className="p-2">Default Violence Model</td>
                      <td className="p-2">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center mt-6">
                <div className="text-sm text-gray-500">Showing 5 of 27 detections</div>

                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

