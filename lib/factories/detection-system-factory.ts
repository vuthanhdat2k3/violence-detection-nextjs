import { DetectionStrategy, ViolenceDetectionStrategy } from "../strategies/detection-strategy";
import { Detector, VideoDetector } from "./detector-factory";
import { Model, ViolenceModel } from "./model-factory";

export interface DetectionSystemFactory {
  createDetector(): Detector;
  createModel(): Model;
  createStrategy(): DetectionStrategy;
}

export class ViolenceDetectionSystemFactory implements DetectionSystemFactory {
  createDetector(): Detector {
    const id = `detector-${Date.now()}`;
    const name = "Violence Video Detector";
    const model = this.createModel();
    
    return new VideoDetector(id, name, model);
  }

  createModel(): Model {
    return new ViolenceModel(
      "violence-v1", // id
      "Violence Detection Model", // name
      90.0, // accuracy
      "active", // status
      new Date().toISOString().split("T")[0], // lastUpdated
      "250MB" // size
    );
  }

  createStrategy(): DetectionStrategy {
    return new ViolenceDetectionStrategy();
  }
}

export class MovementDetectionSystemFactory implements DetectionSystemFactory {
  createDetector(): Detector {
    const id = `detector-${Date.now()}`;
    const name = "Movement Video Detector";
    const model = this.createModel();
    
    return new VideoDetector(id, name, model);
  }

  createModel(): Model {
    return new ViolenceModel(
      "movement-v1",
      "Movement Detection Model",
      85.0,
      "active",
      new Date().toISOString().split("T")[0],
      "180MB"
    );
  }

  createStrategy(): DetectionStrategy {
    return new ViolenceDetectionStrategy(); // Should be MovementDetectionStrategy
  }
}


