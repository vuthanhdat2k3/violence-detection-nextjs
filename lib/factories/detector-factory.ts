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
    // In a real implementation, this would process the video
    // For now, we'll delegate to the model
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
    // In a real implementation, this would connect to the camera
    // For now, we'll simulate a response
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
    // Process multiple videos in batch
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

// Registry for detector creators
type DetectorCreator = (id: string, name: string, model: Model) => Detector;

export class DetectorRegistry {
  private static creators: Map<DetectorType, DetectorCreator> = new Map();

  static register(type: DetectorType, creator: DetectorCreator) {
    DetectorRegistry.creators.set(type, creator);
  }

  static getCreator(type: DetectorType): DetectorCreator {
    const creator = DetectorRegistry.creators.get(type);
    if (!creator) {
      throw new Error(`No creator registered for detector type: ${type}`);
    }
    return creator;
  }
}

// Improved Factory
export class ConcreteDetectorFactory extends DetectorFactory {
  constructor() {
    super();
    // Register default creators
    DetectorRegistry.register("video", 
      (id, name, model) => new VideoDetector(id, name, model));
    DetectorRegistry.register("camera", 
      (id, name, model) => new CameraDetector(id, name, model));
    DetectorRegistry.register("batch", 
      (id, name, model) => new BatchDetector(id, name, model));
  }

  createDetector(type: DetectorType, model: Model): Detector {
    const creator = DetectorRegistry.getCreator(type);
    const id = `detector-${Date.now()}`;
    const name = `${type.charAt(0).toUpperCase() + type.slice(1)} Detector`;
    return creator(id, name, model);
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

