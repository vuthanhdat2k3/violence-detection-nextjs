import { getAlertFactory, type Alert } from "../factories/alert-factory"
import { DetectionContext } from "../strategies/detection-context"
import type { VideoData, DetectionResult, VideoDetectionResult } from "../types/detection-types"

export class ViolenceDetectionFacade {
  private alertFactory = getAlertFactory()
  private detectionContext = new DetectionContext()

  /**
   * Phát hiện bạo lực từ file video sử dụng chiến lược đã chọn
   */
  async detectViolenceInVideo(
    file: File,
    strategyType = "violence", // Mặc định sử dụng chiến lược phát hiện bạo lực
  ): Promise<VideoDetectionResult> {
    try {
      // Thiết lập chiến lược phát hiện
      this.detectionContext.setStrategy(strategyType)

      // Chuẩn bị dữ liệu đầu vào
      const videoData: VideoData = { videoFile: file }

      // Thực hiện phát hiện bằng chiến lược đã chọn
      const result = await this.detectionContext.detectViolence(videoData)

      // Chuyển đổi kết quả sang định dạng tương thích với code cũ
      const compatibleResult = this.convertToCompatibleResult(result)

      // Tạo cảnh báo nếu cần
      this.createAlertIfNeeded(compatibleResult, "Video Upload")

      return compatibleResult
    } catch (error) {
      console.error("Error detecting violence in video:", error)
      throw error
    }
  }

  /**
   * Phát hiện bạo lực từ camera sử dụng chiến lược đã chọn
   */
  async detectViolenceFromCamera(cameraId: string, strategyType = "violence"): Promise<void> {
    try {
      // Thiết lập chiến lược phát hiện
      this.detectionContext.setStrategy(strategyType)

      // Chuẩn bị dữ liệu đầu vào
      const videoData: VideoData = { cameraId }

      // Thực hiện phát hiện bằng chiến lược đã chọn
      await this.detectionContext.detectViolence(videoData)

      return
    } catch (error) {
      console.error("Error detecting violence from camera:", error)
      throw error
    }
  }

  /**
   * Lấy danh sách các chiến lược phát hiện có sẵn
   */
  getAvailableStrategies() {
    return DetectionContext.getAvailableStrategies()
  }

  /**
   * Lấy các cảnh báo gần đây
   */
  getRecentAlerts(limit = 5): Alert[] {
    return this.alertFactory.getAlerts().slice(0, limit)
  }

  /**
   * Chuyển đổi kết quả sang định dạng tương thích với code cũ
   */
  private convertToCompatibleResult(result: DetectionResult): VideoDetectionResult {
    return {
      fight: result.detected,
      percentageoffight: result.confidence.toFixed(2),
      processing_time_ms: result.processingTime.toString(),
      regions: result.regions || [],
      metadata: result.metadata || {},
      timestamp: result.timestamp,
      detectionType: result.type,
    }
  }

  /**
   * Tạo cảnh báo nếu phát hiện bạo lực với độ tin cậy cao
   */
  private createAlertIfNeeded(result: VideoDetectionResult, source: string): void {
    // Kiểm tra cả fight và percentageoffight có tồn tại không
    if (result.fight && result.percentageoffight !== undefined) {
      const confidence = Number.parseFloat(result.percentageoffight)
      if (confidence > 70) {
        this.alertFactory.createAlert(source, confidence, true)
      }
    }
  }
}

// Singleton instance
let violenceDetectionFacadeInstance: ViolenceDetectionFacade | null = null

export function getViolenceDetectionFacade(): ViolenceDetectionFacade {
  if (!violenceDetectionFacadeInstance) {
    violenceDetectionFacadeInstance = new ViolenceDetectionFacade()
  }
  return violenceDetectionFacadeInstance
}

