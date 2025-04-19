
export interface VideoData {
  videoFile?: File
  videoUrl?: string
  cameraId?: string
  startTime?: number
  duration?: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options?: Record<string, any>
}

export interface DetectionRegion {
  x: number
  y: number
  width: number
  height: number
  confidence: number
}

export interface DetectionResult {
  type: string
  detected: boolean
  confidence: number
  timestamp: string
  processingTime: number
  regions: DetectionRegion[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata: Record<string, any>
}

export interface VideoDetectionResult {
  fight?: boolean
  percentageoffight?: string
  processing_time_ms?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

