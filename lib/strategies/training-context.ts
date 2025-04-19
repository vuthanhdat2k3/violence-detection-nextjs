import type { TrainingData, TrainingResult } from "../types/training-types"
import { type TrainingStrategy, TrainingStrategyFactory } from "./training-strategy"

export class TrainingContext {
  private strategy: TrainingStrategy

  constructor(strategyType = "violence") {
    this.strategy = TrainingStrategyFactory.createStrategy(strategyType)
  }

  setStrategy(strategyType: string): void {
    this.strategy = TrainingStrategyFactory.createStrategy(strategyType)
  }

  async trainModel(data: TrainingData): Promise<TrainingResult> {
    return this.strategy.train(data)
  }

  getStrategyName(): string {
    return this.strategy.getName()
  }

  getStrategyDescription(): string {
    return this.strategy.getDescription()
  }

  getRequiredResources() {
    return this.strategy.getRequiredResources()
  }

  static getAvailableStrategies() {
    return TrainingStrategyFactory.getAvailableStrategies()
  }
}

