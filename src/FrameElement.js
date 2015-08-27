import EventEmitter from "@mohayonao/event-emitter";
import defaults from "@mohayonao/utils/defaults";

export default class FrameElement extends EventEmitter {
  constructor(opts = {}) {
    super();

    this.layer = defaults(opts.layer, 0);
    this.startTime = defaults(opts.startTime, 0);
    this.stopTime = defaults(opts.stopTime, Infinity);
    this.parameters = defaults(opts.parameters, {});
  }

  stateAtTime(time) {
    if (time < this.startTime) {
      return "suspended";
    }
    if (this.stopTime <= time) {
      return "ended";
    }
    return "running";
  }

  init() {}
  update() {}
  dispose() {}
}
