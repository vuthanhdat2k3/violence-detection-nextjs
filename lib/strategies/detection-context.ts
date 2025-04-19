import type { VideoData, DetectionResult } from "../types/detection-types"
import { type DetectionStrategy, DetectionStrategyFactory } from "./detection-strategy"

export class DetectionContext {
  private strategy: DetectionStrategy

  constructor(strategyType = "violence") {
    this.strategy = DetectionStrategyFactory.createStrategy(strategyType)
  }

  setStrategy(strategyType: string): void {
    this.strategy = DetectionStrategyFactory.createStrategy(strategyType)
  }

  async detectViolence(data: VideoData): Promise<DetectionResult> {
    return this.strategy.detect(data)
  }

  getStrategyName(): string {
    return this.strategy.getName()
  }

  getStrategyDescription(): string {
    return this.strategy.getDescription()
  }

  getStrategyAccuracy(): number {
    return this.strategy.getAccuracy()
  }

  static getAvailableStrategies() {
    return DetectionStrategyFactory.getAvailableStrategies()
  }
}

