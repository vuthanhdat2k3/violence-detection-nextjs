// Abstract Alert
export type AlertStatus = "new" | "reviewed" | "dismissed"

export interface AlertInfo {
  id: string
  location: string
  time: string
  confidence: number
  status: AlertStatus
  hasVideo: boolean
}

export interface Alert extends AlertInfo {
  getVideoUrl(): string | null
  markAsReviewed(): void
  dismiss(): void
}

// Abstract Factory
export abstract class AlertFactory {
  abstract createAlert(location: string, confidence: number, hasVideo: boolean, videoUrl?: string): Alert
  abstract getAlerts(): Alert[]
}

// Concrete Alert
export class ConcreteAlert implements Alert {
  id: string
  location: string
  time: string
  confidence: number
  status: AlertStatus
  hasVideo: boolean
  private videoUrl: string | null

  constructor(
    id: string,
    location: string,
    time: string,
    confidence: number,
    status: AlertStatus,
    hasVideo: boolean,
    videoUrl: string | null = null,
  ) {
    this.id = id
    this.location = location
    this.time = time
    this.confidence = confidence
    this.status = status
    this.hasVideo = hasVideo
    this.videoUrl = videoUrl
  }

  getVideoUrl(): string | null {
    return this.videoUrl
  }

  markAsReviewed(): void {
    this.status = "reviewed"
  }

  dismiss(): void {
    this.status = "dismissed"
  }
}

// Concrete Factory
export class ConcreteAlertFactory extends AlertFactory {
  private alerts: Alert[] = []

  constructor() {
    super()
    // Initialize with some default alerts
    this.alerts.push(
      new ConcreteAlert("alert1", "Main Entrance", "Today, 10:23 AM", 87, "new", true, "/alerts/alert1.mp4"),
      new ConcreteAlert("alert2", "Parking Lot", "Yesterday, 8:45 PM", 92, "reviewed", true, "/alerts/alert2.mp4"),
      new ConcreteAlert("alert3", "Hallway", "Yesterday, 3:12 PM", 78, "new", true, "/alerts/alert3.mp4"),
      new ConcreteAlert("alert4", "Cafeteria", "Mar 18, 11:05 AM", 83, "dismissed", true, "/alerts/alert4.mp4"),
      new ConcreteAlert("alert5", "Main Entrance", "Mar 17, 2:30 PM", 75, "reviewed", false),
    )
  }

  createAlert(location: string, confidence: number, hasVideo: boolean, videoUrl?: string): Alert {
    const now = new Date()
    const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

    const newAlert = new ConcreteAlert(
      `alert${this.alerts.length + 1}`,
      location,
      `Today, ${time}`,
      confidence,
      "new",
      hasVideo,
      videoUrl || null,
    )

    this.alerts.unshift(newAlert) // Add to the beginning of the array
    return newAlert
  }

  getAlerts(): Alert[] {
    return [...this.alerts]
  }

  getAlertById(id: string): Alert | undefined {
    return this.alerts.find((alert) => alert.id === id)
  }

  updateAlertStatus(id: string, status: AlertStatus): boolean {
    const alert = this.alerts.find((a) => a.id === id)
    if (alert) {
      alert.status = status
      return true
    }
    return false
  }
}

// Singleton instance
let alertFactoryInstance: ConcreteAlertFactory | null = null

export function getAlertFactory(): ConcreteAlertFactory {
  if (!alertFactoryInstance) {
    alertFactoryInstance = new ConcreteAlertFactory()
  }
  return alertFactoryInstance
}

