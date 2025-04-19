import { getSampleFactory, type Sample } from "../factories/sample-factory"
import { getTrainingFactory, type TrainingSession } from "../factories/training-factory"
import { TrainingContext } from "../strategies/training-context"
import type { TrainingData, TrainingResult } from "../types/training-types"

export interface TrainingOptions {
  modelName: string
  strategyType: string
  epochs?: number
  batchSize?: number
  learningRate?: number
  sampleIds?: string[]
}

export class ModelTrainingFacade {
  private sampleFactory = getSampleFactory()
  private trainingFactory = getTrainingFactory()
  private trainingContext = new TrainingContext()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  private progressCallbacks: Map<string, Function> = new Map()
  private activeTrainingSessions: Map<string, { result: Promise<TrainingResult>; progress: number }> = new Map()

  /**
   * Bắt đầu huấn luyện mô hình mới
   */
  async startModelTraining(options: TrainingOptions): Promise<TrainingSession> {
    try {
      // Thiết lập chiến lược huấn luyện
      this.trainingContext.setStrategy(options.strategyType)

      // Lấy các mẫu dữ liệu phù hợp
      let samples: Sample[] = []

      if (options.sampleIds && options.sampleIds.length > 0) {
        // Sử dụng các mẫu được chỉ định
        samples = options.sampleIds
          .map((id) => this.sampleFactory.getSampleById(id))
          .filter((sample): sample is Sample => sample !== undefined)
      } else {
        // Lấy tất cả mẫu đã xác minh
        samples = this.sampleFactory.getAvailableSamples().filter((sample) => sample.verified)
      }

      if (samples.length === 0) {
        throw new Error("No samples available for training")
      }

      // Chuẩn bị dữ liệu huấn luyện
      const trainingData: TrainingData = {
        modelName: options.modelName,
        modelType: options.strategyType,
        samples: samples,
        epochs: options.epochs || 10,
        batchSize: options.batchSize || 32,
        learningRate: options.learningRate || 0.001,
      }

      // Tạo phiên huấn luyện mới
      const session = this.trainingFactory.createTrainingSession(options.modelName, "New Training", samples)

      // Bắt đầu huấn luyện
      const trainingPromise = this.trainingContext.trainModel(trainingData)

      // Lưu phiên huấn luyện đang hoạt động
      this.activeTrainingSessions.set(session.id, {
        result: trainingPromise,
        progress: 0,
      })

      // Xử lý kết quả huấn luyện khi hoàn thành
      trainingPromise
        .then((result) => {
          // Cập nhật thông tin phiên huấn luyện
          session.accuracy = result.accuracy
          session.status = "completed"
          session.endTime = new Date()

          // Xóa khỏi danh sách phiên đang hoạt động
          this.activeTrainingSessions.delete(session.id)
        })
        .catch((error) => {
          console.error("Training error:", error)
          session.status = "failed"
          session.endTime = new Date()
          this.activeTrainingSessions.delete(session.id)
        })

      // Bắt đầu phiên huấn luyện
      session.startTraining()

      return session
    } catch (error) {
      console.error("Error starting model training:", error)
      throw error
    }
  }

  /**
   * Dừng phiên huấn luyện
   */
  async stopTraining(sessionId: string): Promise<boolean> {
    try {
      const session = this.getTrainingSession(sessionId)
      if (!session) {
        throw new Error(`Training session with ID ${sessionId} not found`)
      }

      session.stopTraining()

      // Xóa callback theo dõi tiến trình nếu có
      this.progressCallbacks.delete(sessionId)

      // Xóa khỏi danh sách phiên đang hoạt động
      this.activeTrainingSessions.delete(sessionId)

      return true
    } catch (error) {
      console.error("Error stopping training:", error)
      return false
    }
  }

  /**
   * Lấy tiến trình huấn luyện
   */
  getTrainingProgress(sessionId: string): number {
    const session = this.getTrainingSession(sessionId)
    if (!session) {
      return 0
    }

    const activeSession = this.activeTrainingSessions.get(sessionId)
    if (activeSession) {
      return activeSession.progress
    }

    return session.getProgress()
  }

  /**
   * Thiết lập theo dõi tiến trình huấn luyện
   */
  setupProgressMonitoring(sessionId: string, callback: (progress: number) => void): void {
    const session = this.getTrainingSession(sessionId)
    if (!session) {
      return
    }

    // Lưu callback
    this.progressCallbacks.set(sessionId, callback)

    // Thiết lập interval để cập nhật tiến trình
    const intervalId = setInterval(() => {
      const activeSession = this.activeTrainingSessions.get(sessionId)

      if (!activeSession) {
        clearInterval(intervalId)
        this.progressCallbacks.delete(sessionId)
        return
      }

      // Mô phỏng cập nhật tiến trình
      activeSession.progress += Math.random() * 5
      if (activeSession.progress > 100) {
        activeSession.progress = 100
      }

      callback(activeSession.progress)

      // Nếu hoàn thành, dừng interval
      if (activeSession.progress >= 100) {
        clearInterval(intervalId)
        this.progressCallbacks.delete(sessionId)
      }
    }, 500)
  }

  /**
   * Lấy danh sách các chiến lược huấn luyện có sẵn
   */
  getAvailableTrainingStrategies() {
    return TrainingContext.getAvailableStrategies()
  }

  /**
   * Lấy danh sách các mẫu có sẵn
   */
  getAvailableSamples(): Sample[] {
    return this.sampleFactory.getAvailableSamples()
  }

  /**
   * Lấy danh sách các phiên huấn luyện
   */
  getTrainingSessions(): TrainingSession[] {
    return this.trainingFactory.getTrainingSessions()
  }

  /**
   * Lấy phiên huấn luyện theo ID
   */
  getTrainingSession(id: string): TrainingSession | null {
    return this.trainingFactory.getTrainingSessionById(id) || null
  }
}

// Singleton instance
let modelTrainingFacadeInstance: ModelTrainingFacade | null = null

export function getModelTrainingFacade(): ModelTrainingFacade {
  if (!modelTrainingFacadeInstance) {
    modelTrainingFacadeInstance = new ModelTrainingFacade()
  }
  return modelTrainingFacadeInstance
}

