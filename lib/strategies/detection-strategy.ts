import type { VideoData, DetectionResult } from "../types/detection-types"

export interface DetectionStrategy {
  detect(data: VideoData): Promise<DetectionResult>
  getName(): string
  getDescription(): string
  getAccuracy(): number
}

export class ViolenceDetectionStrategy implements DetectionStrategy {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async detect(data: VideoData): Promise<DetectionResult> {
    console.log("Sử dụng chiến lược phát hiện bạo lực")

    // Mô phỏng xử lý phát hiện bạo lực
    return new Promise((resolve) => {
      setTimeout(() => {
        const isFight = Math.random() > 0.4
        resolve({
          type: "violence",
          detected: isFight,
          confidence: isFight ? 70 + Math.random() * 25 : Math.random() * 30,
          timestamp: new Date().toISOString(),
          processingTime: Math.floor(Math.random() * 800 + 500),
          regions: isFight
            ? [
                { x: 0.2, y: 0.3, width: 0.3, height: 0.4, confidence: 0.85 },
                { x: 0.6, y: 0.4, width: 0.2, height: 0.3, confidence: 0.75 },
              ]
            : [],
          metadata: {
            violenceType: isFight ? "physical" : "none",
            severity: isFight ? Math.floor(Math.random() * 5) + 1 : 0,
          },
        })
      }, 1500)
    })
  }

  getName(): string {
    return "Phát hiện Bạo lực"
  }

  getDescription(): string {
    return "Phát hiện các hành vi bạo lực thể chất trong video sử dụng mô hình học sâu"
  }

  getAccuracy(): number {
    return 92.5
  }
}

export class MovementDetectionStrategy implements DetectionStrategy {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async detect(data: VideoData): Promise<DetectionResult> {
    console.log("Sử dụng chiến lược phát hiện chuyển động")

    return new Promise((resolve) => {
      setTimeout(() => {
        const hasMovement = Math.random() > 0.2
        resolve({
          type: "movement",
          detected: hasMovement,
          confidence: hasMovement ? 80 + Math.random() * 15 : Math.random() * 20,
          timestamp: new Date().toISOString(),
          processingTime: Math.floor(Math.random() * 400 + 200),
          regions: hasMovement
            ? [
                { x: 0.1, y: 0.2, width: 0.2, height: 0.3, confidence: 0.9 },
                { x: 0.5, y: 0.3, width: 0.3, height: 0.4, confidence: 0.85 },
                { x: 0.7, y: 0.6, width: 0.2, height: 0.3, confidence: 0.8 },
              ]
            : [],
          metadata: {
            movementType: hasMovement ? "human" : "none",
            speed: hasMovement ? Math.random() * 5 : 0,
          },
        })
      }, 800)
    })
  }

  getName(): string {
    return "Phát hiện Chuyển động"
  }

  getDescription(): string {
    return "Phát hiện và theo dõi chuyển động của người trong video"
  }

  getAccuracy(): number {
    return 95.8
  }
}

export class BehaviorAnalysisStrategy implements DetectionStrategy {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async detect(data: VideoData): Promise<DetectionResult> {
    console.log("Sử dụng chiến lược phân tích hành vi")

    // Mô phỏng xử lý phân tích hành vi
    return new Promise((resolve) => {
      setTimeout(() => {
        const behaviors = ["normal", "suspicious", "violent", "aggressive"]
        const detectedBehavior = behaviors[Math.floor(Math.random() * behaviors.length)]
        const isViolent = detectedBehavior === "violent" || detectedBehavior === "aggressive"

        resolve({
          type: "behavior",
          detected: isViolent,
          confidence: 65 + Math.random() * 30,
          timestamp: new Date().toISOString(),
          processingTime: Math.floor(Math.random() * 1200 + 800),
          regions: isViolent ? [{ x: 0.3, y: 0.4, width: 0.4, height: 0.5, confidence: 0.8 }] : [],
          metadata: {
            behaviorType: detectedBehavior,
            intensity: isViolent ? Math.floor(Math.random() * 5) + 3 : Math.floor(Math.random() * 3),
          },
        })
      }, 2000)
    })
  }

  getName(): string {
    return "Phân tích Hành vi"
  }

  getDescription(): string {
    return "Phân tích chi tiết hành vi người dùng để xác định các mẫu hành vi bất thường hoặc bạo lực"
  }

  getAccuracy(): number {
    return 88.3
  }
}

export class DetectionStrategyFactory {
  static createStrategy(type: string): DetectionStrategy {
    switch (type) {
      case "violence":
        return new ViolenceDetectionStrategy()
      case "movement":
        return new MovementDetectionStrategy()
      case "behavior":
        return new BehaviorAnalysisStrategy()
      default:
        return new ViolenceDetectionStrategy() // Mặc định
    }
  }

  static getAvailableStrategies(): { id: string; name: string; description: string; accuracy: number }[] {
    return [
      {
        id: "violence",
        name: new ViolenceDetectionStrategy().getName(),
        description: new ViolenceDetectionStrategy().getDescription(),
        accuracy: new ViolenceDetectionStrategy().getAccuracy(),
      },
      {
        id: "movement",
        name: new MovementDetectionStrategy().getName(),
        description: new MovementDetectionStrategy().getDescription(),
        accuracy: new MovementDetectionStrategy().getAccuracy(),
      },
      {
        id: "behavior",
        name: new BehaviorAnalysisStrategy().getName(),
        description: new BehaviorAnalysisStrategy().getDescription(),
        accuracy: new BehaviorAnalysisStrategy().getAccuracy(),
      },
    ]
  }
}

