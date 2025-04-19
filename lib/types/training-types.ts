/* eslint-disable @typescript-eslint/no-explicit-any */
export interface TrainingData {
  modelName: string
  modelType: string
  samples?: any[]
  epochs?: number
  batchSize?: number
  learningRate?: number
  options?: Record<string, any>
}

export interface EpochInfo {
  epoch: number
  loss: number
  accuracy?: number
}

export interface TrainingResult {
  modelId: string
  accuracy: number
  trainingTime: number
  epochs: number
  lossHistory: EpochInfo[]
  metadata: Record<string, any>
}

export interface ResourceRequirements {
  minMemory: number // GB
  recommendedGPU: boolean
  estimatedTrainingTime: number // phút
  diskSpace: number // GB
  cpuCores: number
}

