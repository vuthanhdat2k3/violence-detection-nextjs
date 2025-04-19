// Abstract Sample
export type SampleType = "Violence" | "Non-Violence"

export interface SampleInfo {
  id: string
  name: string
  type: SampleType
  duration: string
  date: string
  verified: boolean
}

export interface Sample extends SampleInfo {
  getVideoUrl(): string | null
}

// Abstract Factory
export abstract class SampleFactory {
  abstract createSample(type: SampleType, name: string, duration: string, videoUrl?: string): Sample
  abstract getAvailableSamples(): Sample[]
}

// Concrete Sample
export class ConcreteSample implements Sample {
  id: string
  name: string
  type: SampleType
  duration: string
  date: string
  verified: boolean
  private videoUrl: string | null

  constructor(
    id: string,
    name: string,
    type: SampleType,
    duration: string,
    date: string,
    verified: boolean,
    videoUrl: string | null = null,
  ) {
    this.id = id
    this.name = name
    this.type = type
    this.duration = duration
    this.date = date
    this.verified = verified
    this.videoUrl = videoUrl
  }

  getVideoUrl(): string | null {
    return this.videoUrl
  }
}

// Concrete Factory
export class ConcreteSampleFactory extends SampleFactory {
  private samples: Sample[] = []

  constructor() {
    super()
    // Initialize with some default samples
    this.samples.push(
      new ConcreteSample("sample1", "Fight Scene 1", "Violence", "12s", "2024-01-15", true, "/samples/fight1.mp4"),
      new ConcreteSample(
        "sample2",
        "Argument Escalation",
        "Violence",
        "8s",
        "2024-02-03",
        true,
        "/samples/argument.mp4",
      ),
      new ConcreteSample(
        "sample3",
        "Normal Walking",
        "Non-Violence",
        "15s",
        "2024-01-20",
        true,
        "/samples/walking.mp4",
      ),
      new ConcreteSample(
        "sample4",
        "Group Discussion",
        "Non-Violence",
        "20s",
        "2024-02-10",
        false,
        "/samples/discussion.mp4",
      ),
      new ConcreteSample(
        "sample5",
        "Physical Altercation",
        "Violence",
        "7s",
        "2024-03-05",
        true,
        "/samples/altercation.mp4",
      ),
      new ConcreteSample(
        "sample6",
        "Running in Hallway",
        "Non-Violence",
        "10s",
        "2024-02-25",
        false,
        "/samples/running.mp4",
      ),
    )
  }

  createSample(type: SampleType, name: string, duration: string, videoUrl?: string): Sample {
    const newSample = new ConcreteSample(
      `sample${this.samples.length + 1}`,
      name,
      type,
      duration,
      new Date().toISOString().split("T")[0],
      false,
      videoUrl || null,
    )
    this.samples.push(newSample)
    return newSample
  }

  getAvailableSamples(): Sample[] {
    return [...this.samples]
  }

  getSampleById(id: string): Sample | undefined {
    return this.samples.find((sample) => sample.id === id)
  }

  updateSampleVerification(id: string, verified: boolean): boolean {
    const sample = this.samples.find((s) => s.id === id)
    if (sample) {
      ;(sample as ConcreteSample).verified = verified
      return true
    }
    return false
  }

  deleteSample(id: string): boolean {
    const index = this.samples.findIndex((s) => s.id === id)
    if (index !== -1) {
      this.samples.splice(index, 1)
      return true
    }
    return false
  }
}

// Singleton instance
let sampleFactoryInstance: ConcreteSampleFactory | null = null

export function getSampleFactory(): ConcreteSampleFactory {
  if (!sampleFactoryInstance) {
    sampleFactoryInstance = new ConcreteSampleFactory()
  }
  return sampleFactoryInstance
}

