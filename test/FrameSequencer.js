import assert from "power-assert";
import sinon from "sinon";
import FrameElement from "../src/FrameElement";
import FrameSequencer from "../src/FrameSequencer";

describe("FrameSequencer", function() {
  describe("constructor(otps = {})", () => {
    it("works", () => {
      let sequencer = new FrameSequencer();

      assert(sequencer instanceof FrameSequencer);
      assert(Array.isArray(sequencer.elements));
      assert(Array.isArray(sequencer.actives));
    });
  });
  describe("add(element: FrameElement): boolean", () => {
    it("works", () => {
      let sequencer = new FrameSequencer();
      let element1 = new FrameElement();
      let element2 = new FrameElement();

      sequencer.add(element1);
      sequencer.add(element2);

      assert(sequencer.elements.length === 2);
      assert(sequencer.actives.length === 0);
      assert.deepEqual(sequencer.elements, [ element1, element2 ]);

      sequencer.add(element1);

      assert(sequencer.elements.length === 2);
      assert(sequencer.actives.length === 0);
      assert.deepEqual(sequencer.elements, [ element1, element2 ]);
    });
  });
  describe("remove(element: FrameElement): boolean", () => {
    it("works", () => {
      let sequencer = new FrameSequencer();
      let element1 = new FrameElement();
      let element2 = new FrameElement();

      sequencer.add(element1);
      sequencer.add(element2);
      sequencer.remove(element1);

      assert(sequencer.elements.length === 1);
      assert(sequencer.actives.length === 0);
      assert.deepEqual(sequencer.elements, [ element2 ]);

      sequencer.remove(element1);
      sequencer.remove(element2);

      assert(sequencer.elements.length === 0);
      assert(sequencer.actives.length === 0);
    });
  });
  describe("removeAll(): void", () => {
    it("works", () => {
      let sequencer = new FrameSequencer();
      let element1 = new FrameElement();
      let element2 = new FrameElement();

      sequencer.add(element1);
      sequencer.add(element2);
      sequencer.removeAll();

      assert(sequencer.elements.length === 0);
      assert(sequencer.actives.length === 0);
    });
  });
  describe("update(t0:number, t1: number): void", function() {
    before(() => {
      this.sequencer = new FrameSequencer();
      this.element1 = new FrameElement({ startTime: 1.5, stopTime: 3.5 });
      this.element2 = new FrameElement({ startTime: 2.5 });

      this.sequencer.onResume = sinon.spy(this.sequencer.onResume.bind(this.sequencer));
      this.sequencer.onStartElement = sinon.spy(this.sequencer.onStartElement.bind(this.sequencer));
      this.sequencer.onStopElement = sinon.spy(this.sequencer.onStopElement.bind(this.sequencer));
      this.sequencer.onPause = sinon.spy(this.sequencer.onPause.bind(this.sequencer));

      this.element1.init = sinon.spy();
      this.element2.init = sinon.spy();
      this.element1.update = sinon.spy();
      this.element2.update = sinon.spy();
      this.element1.dispose = sinon.spy();
      this.element2.dispose = sinon.spy();

      this.sequencer.add(this.element1);
      this.sequencer.add(this.element2);
    });
    beforeEach(() => {
      this.sequencer.onResume.reset();
      this.sequencer.onStartElement.reset();
      this.sequencer.onStopElement.reset();
      this.sequencer.onPause.reset();

      this.element1.init.reset();
      this.element2.init.reset();
      this.element1.update.reset();
      this.element2.update.reset();
      this.element1.dispose.reset();
      this.element2.dispose.reset();
    });
    it("works (00.000 -> 01.000)", () => {
      this.sequencer.update(0, 1);

      assert(this.sequencer.elements.length === 2);
      assert(this.sequencer.actives.length === 0);

      assert(this.sequencer.onResume.callCount === 1);
      assert(this.sequencer.onResume.args[0][0] === 0);
      assert(this.sequencer.onResume.args[0][1] === 1);
      assert(this.sequencer.onStartElement.callCount === 0);

      assert(this.element1.init.callCount === 0);
      assert(this.element2.init.callCount === 0);
      assert(this.element1.update.callCount === 0);
      assert(this.element2.update.callCount === 0);
      assert(this.element1.dispose.callCount === 0);
      assert(this.element2.dispose.callCount === 0);

      assert(this.sequencer.onStopElement.callCount === 0);
      assert(this.sequencer.onPause.callCount === 1);
      assert(this.sequencer.onPause.args[0][0] === 0);
      assert(this.sequencer.onPause.args[0][1] === 1);
    });
    it("works (01.000 -> 02.000)", () => {
      this.sequencer.update(1, 2);

      assert(this.sequencer.elements.length === 2);
      assert(this.sequencer.actives.length === 1);

      assert(this.sequencer.onResume.callCount === 1);
      assert(this.sequencer.onResume.args[0][0] === 1);
      assert(this.sequencer.onResume.args[0][1] === 2);
      assert(this.sequencer.onStartElement.callCount === 1);
      assert(this.sequencer.onStartElement.args[0][0] === this.element1);

      assert(this.element1.init.callCount === 1);
      assert(this.element1.init.args[0][0] === this.element1.startTime);
      assert(this.element2.init.callCount === 0);
      assert(this.element1.update.callCount === 1);
      assert(this.element1.update.args[0][0] === 1.5);
      assert(this.element1.update.args[0][1] === 2);
      assert(this.element2.update.callCount === 0);
      assert(this.element1.dispose.callCount === 0);
      assert(this.element2.dispose.callCount === 0);

      assert(this.sequencer.onStopElement.callCount === 0);
      assert(this.sequencer.onPause.callCount === 1);
      assert(this.sequencer.onPause.args[0][0] === 1);
      assert(this.sequencer.onPause.args[0][1] === 2);
    });
    it("works (02.000 -> 03.000)", () => {
      this.sequencer.update(2, 3);

      assert(this.sequencer.elements.length === 2);
      assert(this.sequencer.actives.length === 2);

      assert(this.sequencer.onResume.callCount === 1);
      assert(this.sequencer.onResume.args[0][0] === 2);
      assert(this.sequencer.onResume.args[0][1] === 3);
      assert(this.sequencer.onStartElement.callCount === 1);
      assert(this.sequencer.onStartElement.args[0][0] === this.element2);

      assert(this.element1.init.callCount === 0);
      assert(this.element2.init.callCount === 1);
      assert(this.element2.init.args[0][0] === this.element2.startTime);
      assert(this.element1.update.callCount === 1);
      assert(this.element1.update.args[0][0] === 2);
      assert(this.element1.update.args[0][1] === 3);
      assert(this.element2.update.callCount === 1);
      assert(this.element2.update.args[0][0] === 2.5);
      assert(this.element2.update.args[0][1] === 3);
      assert(this.element1.dispose.callCount === 0);
      assert(this.element2.dispose.callCount === 0);

      assert(this.sequencer.onStopElement.callCount === 0);
      assert(this.sequencer.onPause.callCount === 1);
      assert(this.sequencer.onPause.args[0][0] === 2);
      assert(this.sequencer.onPause.args[0][1] === 3);
    });
    it("works (03.000 -> 04.000)", () => {
      this.sequencer.update(3, 4);

      assert(this.sequencer.elements.length === 1);
      assert(this.sequencer.actives.length === 1);

      assert(this.sequencer.onResume.callCount === 1);
      assert(this.sequencer.onResume.args[0][0] === 3);
      assert(this.sequencer.onResume.args[0][1] === 4);
      assert(this.sequencer.onStartElement.callCount === 0);

      assert(this.element1.init.callCount === 0);
      assert(this.element2.init.callCount === 0);
      assert(this.element1.update.callCount === 1);
      assert(this.element1.update.args[0][0] === 3);
      assert(this.element1.update.args[0][1] === 3.5);
      assert(this.element2.update.callCount === 1);
      assert(this.element2.update.args[0][0] === 3);
      assert(this.element2.update.args[0][1] === 4);
      assert(this.element1.dispose.callCount === 1);
      assert(this.element1.dispose.args[0][0] === this.element1.stopTime);
      assert(this.element2.dispose.callCount === 0);

      assert(this.sequencer.onStopElement.callCount === 1);
      assert(this.sequencer.onStopElement.args[0][0] === this.element1);
      assert(this.sequencer.onPause.callCount === 1);
      assert(this.sequencer.onPause.args[0][0] === 3);
      assert(this.sequencer.onPause.args[0][1] === 4);
    });
    it("works (04.000 -> 05.000)", () => {
      this.sequencer.update(4, 5);

      assert(this.sequencer.elements.length === 1);
      assert(this.sequencer.actives.length === 1);

      assert(this.sequencer.onResume.callCount === 1);
      assert(this.sequencer.onResume.args[0][0] === 4);
      assert(this.sequencer.onResume.args[0][1] === 5);
      assert(this.sequencer.onStartElement.callCount === 0);

      assert(this.element1.init.callCount === 0);
      assert(this.element2.init.callCount === 0);
      assert(this.element1.update.callCount === 0);
      assert(this.element2.update.callCount === 1);
      assert(this.element2.update.args[0][0] === 4);
      assert(this.element2.update.args[0][1] === 5);
      assert(this.element1.dispose.callCount === 0);
      assert(this.element2.dispose.callCount === 0);

      assert(this.sequencer.onStopElement.callCount === 0);
      assert(this.sequencer.onPause.callCount === 1);
      assert(this.sequencer.onPause.args[0][0] === 4);
      assert(this.sequencer.onPause.args[0][1] === 5);
    });
  });
});
