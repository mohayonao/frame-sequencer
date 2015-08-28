import EventEmitter from "@mohayonao/event-emitter";
import appendIfNotExists from "@mohayonao/utils/appendIfNotExists";
import removeIfExists from "@mohayonao/utils/removeIfExists";

export default class FrameSequencer extends EventEmitter {
  constructor() {
    super();

    this.elements = [];
    this.actives = [];
  }

  add(element) {
    return appendIfNotExists(this.elements, element);
  }

  remove(element) {
    removeIfExists(this.actives, element);
    return removeIfExists(this.elements, element);
  }

  removeAll() {
    this.actives.splice(0);
    this.elements.splice(0);
  }

  update(t0, t1) {
    this.onResume(t0, t1);

    let elements = this.elements.sort((a, b) => a.layer - b.layer);
    let actives = this.actives;

    for (let i = 0; i < elements.length; i++) {
      let element = elements[i];

      if (t0 <= element.stopTime && element.startTime < t1) {
        if (appendIfNotExists(actives, element)) {
          element.init(element.startTime);
          this.onStartElement(element);
        }

        element.update(Math.max(t0, element.startTime), Math.min(element.stopTime, t1));
      }

      if (element.stopTime < t1) {
        if (removeIfExists(actives, element)) {
          element.dispose(element.stopTime);
          this.onStopElement(element);
        }
      }
    }

    this.elements = elements.filter(element => t1 <= element.stopTime);

    this.onPause(t0, t1);
  }

  onResume() {}
  onStartElement() {}
  onStopElement() {}
  onPause() {}
}
