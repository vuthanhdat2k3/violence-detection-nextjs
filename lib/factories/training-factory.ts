import { getModelFactory } from "./model-factory"
import type { Sample } from "./sample-factory"

// Abstract Training Session
export type TrainingType = "New Training" | "Fine-tuning"
export type TrainingStatus = "in-progress" | "completed" | "failed"

export interface TrainingInfo {
  id: string
  modelName: string
  type: TrainingType
  startTime: Date
  endTime?: Date
  status: TrainingStatus
  accuracy?: number
  progress: number
  epoch: number
  loss: number
}

export interface TrainingSession extends TrainingInfo {
  startTraining(): void
  stopTraining(): void
  getProgress(): number
}

// Abstract Factory
export abstract class TrainingFactory {
  abstract createTrainingSession(modelName: string, type: TrainingType, samples: Sample[]): TrainingSession
  abstract getTrainingSessions(): TrainingSession[]
}

// Concrete Training Session
export class ConcreteTrainingSession implements TrainingSession {
  id: string
  modelName: string
  type: TrainingType
  startTime: Date
  endTime?: Date
  status: TrainingStatus
  accuracy?: number
  progress: number
  epoch: number
  loss: number
  private intervalId?: NodeJS.Timeout
  private samples: Sample[]

  constructor(id: string, modelName: string, type: TrainingType, samples: Sample[]) {
    this.id = id
    this.modelName = modelName
    this.type = type
    this.startTime = new Date()
    this.status = "in-progress"
    this.progress = 0
    this.epoch = 0
    this.loss = 0.8
    this.samples = samples
  }

  startTraining(): void {
    // Simulate training progress
    this.intervalId = setInterval(() => {
      this.progress += 1

      // Update epoch every 10% progress
      if (Math.floor((this.progress - 1) / 10) < Math.floor(this.progress / 10)) {
        this.epoch = Math.floor(this.progress / 10)
        this.loss = Math.max(0.1, this.loss - 0.07)
      }

      if (this.progress >= 100) {
        this.completeTraining()
      }
    }, 500)
  }

  stopTraining(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.status = "failed"
    }
  }

  private completeTraining(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }

    this.status = "completed"
    this.endTime = new Date()
    this.progress = 100
    this.accuracy = 85 + Math.random() * 10

    // Create a new model based on the training
    const modelFactory = getModelFactory()
    const modelType = this.modelName.toLowerCase().includes("violence")
      ? "violence"
      : this.modelName.toLowerCase().includes("movement")
        ? "movement"
        : "behavior"

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const newModel = modelFactory.createModel(modelType, {
      name: this.modelName,
      accuracy: this.accuracy,
    })
  }

  getProgress(): number {
    return this.progress
  }
}

// Concrete Factory
export class ConcreteTrainingFactory extends TrainingFactory {
  private trainingSessions: TrainingSession[] = []

  constructor() {
    super()
    // Initialize with some completed training sessions
    this.trainingSessions.push(
      {
        id: "training1",
        modelName: "Enhanced Violence Model",
        type: "New Training",
        startTime: new Date("2024-03-15T10:00:00"),
        endTime: new Date("2024-03-15T13:45:00"),
        status: "completed",
        accuracy: 96.2,
        progress: 100,
        epoch: 10,
        loss: 0.1,
        startTraining: () => {},
        stopTraining: () => {},
        getProgress: () => 100,
      },
      {
        id: "training2",
        modelName: "Custom Behavior Model 1",
        type: "Fine-tuning",
        startTime: new Date("2024-02-28T14:00:00"),
        endTime: new Date("2024-02-28T15:20:00"),
        status: "completed",
        accuracy: 88.3,
        progress: 100,
        epoch: 10,
        loss: 0.15,
        startTraining: () => {},
        stopTraining: () => {},
        getProgress: () => 100,
      },
      {
        id: "training3",
        modelName: "Movement Detection v2",
        type: "New Training",
        startTime: new Date("2024-02-10T09:30:00"),
        endTime: new Date("2024-02-10T11:45:00"),
        status: "failed",
        progress: 45,
        epoch: 4,
        loss: 0.5,
        startTraining: () => {},
        stopTraining: () => {},
        getProgress: () => 45,
      },
    )
  }

  createTrainingSession(modelName: string, type: TrainingType, samples: Sample[]): TrainingSession {
    const newSession = new ConcreteTrainingSession(
      `training${this.trainingSessions.length + 1}`,
      modelName,
      type,
      samples,
    )

    this.trainingSessions.push(newSession)
    return newSession
  }

  getTrainingSessions(): TrainingSession[] {
    return [...this.trainingSessions]
  }

  getTrainingSessionById(id: string): TrainingSession | undefined {
    return this.trainingSessions.find((session) => session.id === id)
  }
}

// Singleton instance
let trainingFactoryInstance: ConcreteTrainingFactory | null = null

export function getTrainingFactory(): ConcreteTrainingFactory {
  if (!trainingFactoryInstance) {
    trainingFactoryInstance = new ConcreteTrainingFactory()
  }
  return trainingFactoryInstance
}

