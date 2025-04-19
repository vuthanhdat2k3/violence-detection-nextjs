import type { TrainingData, TrainingResult, ResourceRequirements } from "../types/training-types"

export interface TrainingStrategy {
  train(data: TrainingData): Promise<TrainingResult>
  getName(): string
  getDescription(): string
  getRequiredResources(): ResourceRequirements
}

export class MovementRecognitionTrainingStrategy implements TrainingStrategy {
  async train(data: TrainingData): Promise<TrainingResult> {
    console.log("Sử dụng chiến lược huấn luyện nhận dạng chuyển động")

    return new Promise((resolve) => {
      let progress = 0
      const interval = setInterval(() => {
        progress += 5
        console.log(`Tiến độ huấn luyện: ${progress}%`)

        if (progress >= 100) {
          clearInterval(interval)
          resolve({
            modelId: `movement-model-${Date.now()}`,
            accuracy: 94.5 + Math.random() * 3,
            trainingTime: Math.floor(Math.random() * 3600) + 1800,
            epochs: data.epochs || 10,
            lossHistory: Array.from({ length: data.epochs || 10 }, (_, i) => ({
              epoch: i + 1,
              loss: 0.8 - i * 0.07 + Math.random() * 0.05,
            })),
            metadata: {
              framework: "TensorFlow",
              modelType: "MovementDetection",
              datasetSize: data.samples?.length || 1000,
            },
          })
        }
      }, 500)
    })
  }

  getName(): string {
    return "Huấn luyện Nhận dạng Chuyển động"
  }

  getDescription(): string {
    return "Huấn luyện mô hình để nhận dạng và theo dõi chuyển động của người trong video"
  }

  getRequiredResources(): ResourceRequirements {
    return {
      minMemory: 8, // GB
      recommendedGPU: true,
      estimatedTrainingTime: 30, // phút
      diskSpace: 5, // GB
      cpuCores: 4,
    }
  }
}

export class ViolenceBehaviorTrainingStrategy implements TrainingStrategy {
  async train(data: TrainingData): Promise<TrainingResult> {
    console.log("Sử dụng chiến lược huấn luyện nhận dạng hành vi bạo lực")

    // Mô phỏng quá trình huấn luyện
    return new Promise((resolve) => {
      let progress = 0
      const interval = setInterval(() => {
        progress += 4
        console.log(`Tiến độ huấn luyện: ${progress}%`)

        if (progress >= 100) {
          clearInterval(interval)
          resolve({
            modelId: `violence-model-${Date.now()}`,
            accuracy: 89.5 + Math.random() * 5,
            trainingTime: Math.floor(Math.random() * 5400) + 3600,
            epochs: data.epochs || 15,
            lossHistory: Array.from({ length: data.epochs || 15 }, (_, i) => ({
              epoch: i + 1,
              loss: 1.2 - i * 0.07 + Math.random() * 0.05,
            })),
            metadata: {
              framework: "PyTorch",
              modelType: "ViolenceDetection",
              datasetSize: data.samples?.length || 1500,
            },
          })
        }
      }, 600)
    })
  }

  getName(): string {
    return "Huấn luyện Nhận dạng Hành vi Bạo lực"
  }

  getDescription(): string {
    return "Huấn luyện mô hình để nhận dạng các hành vi bạo lực trong video"
  }

  getRequiredResources(): ResourceRequirements {
    return {
      minMemory: 16, // GB
      recommendedGPU: true,
      estimatedTrainingTime: 60, // phút
      diskSpace: 10, // GB
      cpuCores: 8,
    }
  }
}

export class TransferLearningTrainingStrategy implements TrainingStrategy {
  async train(data: TrainingData): Promise<TrainingResult> {
    console.log("Sử dụng chiến lược huấn luyện Transfer Learning")

    // Mô phỏng quá trình huấn luyện
    return new Promise((resolve) => {
      let progress = 0
      const interval = setInterval(() => {
        progress += 8
        console.log(`Tiến độ huấn luyện: ${progress}%`)

        if (progress >= 100) {
          clearInterval(interval)
          resolve({
            modelId: `transfer-model-${Date.now()}`,
            accuracy: 92.0 + Math.random() * 4,
            trainingTime: Math.floor(Math.random() * 1800) + 900,
            epochs: data.epochs || 5,
            lossHistory: Array.from({ length: data.epochs || 5 }, (_, i) => ({
              epoch: i + 1,
              loss: 0.5 - i * 0.08 + Math.random() * 0.03,
            })),
            metadata: {
              framework: "TensorFlow",
              modelType: "TransferLearning",
              baseModel: "MobileNetV2",
              datasetSize: data.samples?.length || 800,
            },
          })
        }
      }, 300)
    })
  }

  getName(): string {
    return "Huấn luyện Transfer Learning"
  }

  getDescription(): string {
    return "Sử dụng kỹ thuật Transfer Learning để huấn luyện mô hình nhanh hơn với ít dữ liệu hơn"
  }

  getRequiredResources(): ResourceRequirements {
    return {
      minMemory: 8, // GB
      recommendedGPU: true,
      estimatedTrainingTime: 15, // phút
      diskSpace: 3, // GB
      cpuCores: 4,
    }
  }
}

export class TrainingStrategyFactory {
  static createStrategy(type: string): TrainingStrategy {
    switch (type) {
      case "movement":
        return new MovementRecognitionTrainingStrategy()
      case "violence":
        return new ViolenceBehaviorTrainingStrategy()
      case "transfer":
        return new TransferLearningTrainingStrategy()
      default:
        return new ViolenceBehaviorTrainingStrategy() // Mặc định
    }
  }

  static getAvailableStrategies(): {
    id: string
    name: string
    description: string
    resources: ResourceRequirements
  }[] {
    return [
      {
        id: "movement",
        name: new MovementRecognitionTrainingStrategy().getName(),
        description: new MovementRecognitionTrainingStrategy().getDescription(),
        resources: new MovementRecognitionTrainingStrategy().getRequiredResources(),
      },
      {
        id: "violence",
        name: new ViolenceBehaviorTrainingStrategy().getName(),
        description: new ViolenceBehaviorTrainingStrategy().getDescription(),
        resources: new ViolenceBehaviorTrainingStrategy().getRequiredResources(),
      },
      {
        id: "transfer",
        name: new TransferLearningTrainingStrategy().getName(),
        description: new TransferLearningTrainingStrategy().getDescription(),
        resources: new TransferLearningTrainingStrategy().getRequiredResources(),
      },
    ]
  }
}

