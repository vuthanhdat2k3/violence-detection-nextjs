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

type ModelCreator = (config: ModelConfig) => Model;

export class ModelRegistry {
  private static creators: Map<string, ModelCreator> = new Map();

  static register(type: string, creator: ModelCreator) {
    ModelRegistry.creators.set(type, creator);
  }

  static getCreator(type: string): ModelCreator {
    const creator = ModelRegistry.creators.get(type);
    if (!creator) {
      throw new Error(`No creator registered for model type: ${type}`);
    }
    return creator;
  }
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async predict(data: ModelData): Promise<ModelPredictionResult> {
    // In a real implementation, this would call the API
    // For now, we'll simulate a response
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async predict(data: ModelData): Promise<ModelPredictionResult> {
    // Implementation for movement detection
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  constructor() {
    super();
    // Register default creators
    ModelRegistry.register("violence", (config) => 
      new ViolenceModel(
        this.generateId(),
        config.name || "Violence Model",
        config.accuracy || 90.0,
        "active",
        new Date().toISOString().split("T")[0],
        config.size || "250 MB"
      )
    );
    
    ModelRegistry.register("movement", (config) => 
      new MovementModel(/*...*/));
    
    ModelRegistry.register("behavior", (config) => 
      new BehaviorModel(/*...*/));
  }

  createModel(type: string, config?: ModelConfig): Model {
    const creator = ModelRegistry.getCreator(type);
    return creator(config || {});
  }

  private generateId(): string {
    return `model${this.models.length + 1}`;
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

