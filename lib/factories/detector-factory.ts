import type { Model, ModelData, ModelPredictionResult } from "./model-factory"

// Abstract Detector
export type DetectorType = "video" | "camera" | "batch"

export interface VideoDetectionInput {
  videoFile: File
}

export interface CameraDetectionInput {
  cameraId: string
}

export interface BatchDetectionInput {
  videoFiles: File[]
}

export type DetectionInput = VideoDetectionInput | CameraDetectionInput | BatchDetectionInput

export interface VideoDetectionResult extends ModelPredictionResult {
  fight: boolean
  percentageoffight: string
  processing_time_ms: string
}

export interface CameraDetectionResult {
  message: string
}

export interface BatchDetectionResult {
  filename: string
  fight: boolean
  percentageoffight: string
  processing_time_ms: string
}

export type DetectionResult = VideoDetectionResult | CameraDetectionResult | BatchDetectionResult[]

export interface Detector {
  id: string
  name: string
  type: DetectorType
  model: Model
  detect(input: DetectionInput): Promise<DetectionResult>
}

// Abstract Factory
export abstract class DetectorFactory {
  abstract createDetector(type: DetectorType, model: Model): Detector
}

// Concrete Video Detector
export class VideoDetector implements Detector {
  id: string
  name: string
  type: "video"
  model: Model

  constructor(id: string, name: string, model: Model) {
    this.id = id
    this.name = name
    this.type = "video"
    this.model = model
  }

  async detect(input: VideoDetectionInput): Promise<VideoDetectionResult> {
    const modelData: ModelData = { videoFile: input.videoFile }
    const result = await this.model.predict(modelData)
    return result as VideoDetectionResult
  }
}

// Concrete Camera Detector
export class CameraDetector implements Detector {
  id: string
  name: string
  type: "camera"
  model: Model

  constructor(id: string, name: string, model: Model) {
    this.id = id
    this.name = name
    this.type = "camera"
    this.model = model
  }

  async detect(input: CameraDetectionInput): Promise<CameraDetectionResult> {
    console.log(`Starting detection on camera ${input.cameraId} with model ${this.model.name}`)
    return {
      message: `Detection started on camera ${input.cameraId} using ${this.model.name}`,
    }
  }
}

// Concrete Batch Detector
export class BatchDetector implements Detector {
  id: string
  name: string
  type: "batch"
  model: Model

  constructor(id: string, name: string, model: Model) {
    this.id = id
    this.name = name
    this.type = "batch"
    this.model = model
  }

  async detect(input: BatchDetectionInput): Promise<BatchDetectionResult[]> {
    const results: BatchDetectionResult[] = []
    for (const file of input.videoFiles) {
      const modelData: ModelData = { videoFile: file }
      const result = await this.model.predict(modelData)
      results.push({
        filename: file.name,
        fight: result.fight || false,
        percentageoffight: result.percentageoffight || "0",
        processing_time_ms: result.processing_time_ms,
      })
    }
    return results
  }
}

// Concrete Factory
export class ConcreteDetectorFactory extends DetectorFactory {
  createDetector(type: DetectorType, model: Model): Detector {
    switch (type) {
      case "video":
        return new VideoDetector(`detector-${Date.now()}`, "Video Detector", model)
      case "camera":
        return new CameraDetector(`detector-${Date.now()}`, "Camera Detector", model)
      case "batch":
        return new BatchDetector(`detector-${Date.now()}`, "Batch Detector", model)
      default:
        throw new Error(`Unknown detector type: ${type}`)
    }
  }
}

// Singleton instance
let detectorFactoryInstance: ConcreteDetectorFactory | null = null

export function getDetectorFactory(): ConcreteDetectorFactory {
  if (!detectorFactoryInstance) {
    detectorFactoryInstance = new ConcreteDetectorFactory()
  }
  return detectorFactoryInstance
}

