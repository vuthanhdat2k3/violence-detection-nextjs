// Abstract Model Factory
export interface ModelData {
  videoFile: File | Blob
}

export interface ModelPredictionResult {
  fight?: boolean
  percentageoffight?: string
  movement?: boolean
  confidence?: string
  behavior?: "violent" | "normal"
  processing_time_ms: string
}

export interface ModelInfo {
  id: string
  name: string
  type: string
  accuracy: number
  status: "active" | "inactive"
  lastUpdated: string
  size: string
}

export interface ModelConfig {
  name?: string
  accuracy?: number
  size?: string
}

// Abstract Model Interface
export interface Model {
  id: string
  name: string
  type: string
  accuracy: number
  predict(data: ModelData): Promise<ModelPredictionResult>
  getInfo(): ModelInfo
}

// Abstract Factory
export abstract class ModelFactory {
  abstract createModel(type: string, config?: ModelConfig): Model
  abstract getAvailableModels(): ModelInfo[]
}

// Concrete Violence Model
export class ViolenceModel implements Model {
  id: string
  name: string
  type: string
  accuracy: number
  status: "active" | "inactive"
  lastUpdated: string
  size: string

  constructor(
    id: string,
    name: string,
    accuracy: number,
    status: "active" | "inactive",
    lastUpdated: string,
    size: string,
  ) {
    this.id = id
    this.name = name
    this.type = "Violence Detection"
    this.accuracy = accuracy
    this.status = status
    this.lastUpdated = lastUpdated
    this.size = size
  }

  async predict(data: ModelData): Promise<ModelPredictionResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const isFight = Math.random() > 0.5
        resolve({
          fight: isFight,
          percentageoffight: (isFight ? 70 + Math.random() * 25 : Math.random() * 30).toFixed(2),
          processing_time_ms: (Math.random() * 1000 + 500).toFixed(0),
        })
      }, 2000)
    })
  }

  getInfo(): ModelInfo {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      accuracy: this.accuracy,
      status: this.status,
      lastUpdated: this.lastUpdated,
      size: this.size,
    }
  }
}

// Concrete Movement Model
export class MovementModel implements Model {
  id: string
  name: string
  type: string
  accuracy: number
  status: "active" | "inactive"
  lastUpdated: string
  size: string

  constructor(
    id: string,
    name: string,
    accuracy: number,
    status: "active" | "inactive",
    lastUpdated: string,
    size: string,
  ) {
    this.id = id
    this.name = name
    this.type = "Movement Detection"
    this.accuracy = accuracy
    this.status = status
    this.lastUpdated = lastUpdated
    this.size = size
  }

  async predict(data: ModelData): Promise<ModelPredictionResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          movement: Math.random() > 0.3,
          confidence: (70 + Math.random() * 25).toFixed(2),
          processing_time_ms: (Math.random() * 800 + 300).toFixed(0),
        })
      }, 1500)
    })
  }

  getInfo(): ModelInfo {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      accuracy: this.accuracy,
      status: this.status,
      lastUpdated: this.lastUpdated,
      size: this.size,
    }
  }
}

// Concrete Behavior Model
export class BehaviorModel implements Model {
  id: string
  name: string
  type: string
  accuracy: number
  status: "active" | "inactive"
  lastUpdated: string
  size: string

  constructor(
    id: string,
    name: string,
    accuracy: number,
    status: "active" | "inactive",
    lastUpdated: string,
    size: string,
  ) {
    this.id = id
    this.name = name
    this.type = "Behavior Analysis"
    this.accuracy = accuracy
    this.status = status
    this.lastUpdated = lastUpdated
    this.size = size
  }

  async predict(data: ModelData): Promise<ModelPredictionResult> {
    // Implementation for behavior analysis
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          behavior: Math.random() > 0.5 ? "violent" : "normal",
          confidence: (70 + Math.random() * 25).toFixed(2),
          processing_time_ms: (Math.random() * 1200 + 400).toFixed(0),
        })
      }, 2500)
    })
  }

  getInfo(): ModelInfo {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      accuracy: this.accuracy,
      status: this.status,
      lastUpdated: this.lastUpdated,
      size: this.size,
    }
  }
}

// Concrete Factory
export class ConcreteModelFactory extends ModelFactory {
  private models: Model[] = []

  constructor() {
    super()
    this.models.push(
      new ViolenceModel("model1", "Default Violence Model", 94.7, "active", "2023-12-15", "245 MB"),
      new ViolenceModel("model2", "Enhanced Violence Model", 96.2, "active", "2024-02-20", "312 MB"),
      new MovementModel("model3", "Person Movement Model", 92.5, "inactive", "2023-11-05", "178 MB"),
      new BehaviorModel("model4", "Custom Behavior Model 1", 88.3, "active", "2024-01-10", "203 MB"),
    )
  }

  createModel(type: string, config?: ModelConfig): Model {
    const modelConfig: ModelConfig = config || {}
    const modelId = `model${this.models.length + 1}`
    const modelName =
      modelConfig.name || `New ${type.charAt(0).toUpperCase() + type.slice(1)} Model ${this.models.length + 1}`
    const modelAccuracy = modelConfig.accuracy || 90.0
    const modelSize = modelConfig.size || "250 MB"
    const currentDate = new Date().toISOString().split("T")[0]

    let newModel: Model

    switch (type) {
      case "violence":
        newModel = new ViolenceModel(modelId, modelName, modelAccuracy, "active", currentDate, modelSize)
        break
      case "movement":
        newModel = new MovementModel(modelId, modelName, modelAccuracy, "active", currentDate, modelSize)
        break
      case "behavior":
        newModel = new BehaviorModel(modelId, modelName, modelAccuracy, "active", currentDate, modelSize)
        break
      default:
        throw new Error(`Unknown model type: ${type}`)
    }

    this.models.push(newModel)
    return newModel
  }

  getAvailableModels(): ModelInfo[] {
    return this.models.map((model) => model.getInfo())
  }

  getModelById(id: string): Model | undefined {
    return this.models.find((model) => model.id === id)
  }

  addModel(model: Model): void {
    this.models.push(model)
  }

  updateModelStatus(id: string, status: "active" | "inactive"): boolean {
    const model = this.models.find((m) => m.id === id)
    if (model) {
      // Use type assertion to access status property
      ;(model as ViolenceModel | MovementModel | BehaviorModel).status = status
      return true
    }
    return false
  }
}

// Singleton instance
let modelFactoryInstance: ConcreteModelFactory | null = null

export function getModelFactory(): ConcreteModelFactory {
  if (!modelFactoryInstance) {
    modelFactoryInstance = new ConcreteModelFactory()
  }
  return modelFactoryInstance
}

