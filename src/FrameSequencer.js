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

    let data = [];
    let elements = this.elements.sort((a, b) => a.layer - b.layer);
    let actives = this.actives;

    for (let i = 0; i < elements.length; i++) {
      let element = elements[i];

      if (t0 <= element.stopTime && element.startTime < t1) {
        if (appendIfNotExists(actives, element)) {
          element.init(t0, t1);
          this.onStartElement(element);
        }

        let result = element.update(t0, t1);

        if (Array.isArray(result)) {
          data.push(...result);
        }
      }

      if (element.stopTime < t1) {
        if (removeIfExists(actives, element)) {
          element.dispose(t0, t1);
          this.onStopElement(element);
        }
      }
    }

    this.elements = elements.filter(element => t1 <= element.stopTime);

    if (data.length) {
      let playbackTime = t0;

      this.emit("data", { playbackTime, data });
    }

    this.onPause(t0, t1);
  }

  onResume() {}
  onStartElement() {}
  onStopElement() {}
  onPause() {}
}
