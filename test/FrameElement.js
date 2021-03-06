import assert from "power-assert";
import FrameElement from "../src/FrameElement";

describe("FrameElement", () => {
  describe("constructor(opts: object = {})", () => {
    it("works", () => {
      let layer = 1;
      let startTime = 2;
      let stopTime = 3;
      let data = { a: 4, b: 5 };
      let element = new FrameElement({ layer, startTime, stopTime, data });

      assert(element instanceof FrameElement);
      assert(element.layer === 1);
      assert(element.startTime === startTime);
      assert(element.stopTime === stopTime);
      assert(element.data === data);
    });
    it("works without options", () => {
      let element = new FrameElement();

      assert(element instanceof FrameElement);
      assert(element.layer === 0);
      assert(element.startTime === 0);
      assert(element.stopTime === Infinity);
      assert.deepEqual(element.data, {});
    });
  });
  describe("#stateAtTime(time: number): string", () => {
    it("works", () => {
      let element = new FrameElement({ startTime: 2, stopTime: 4 });

      assert(element.stateAtTime(0) === "suspended");
      assert(element.stateAtTime(1) === "suspended");
      assert(element.stateAtTime(2) === "running");
      assert(element.stateAtTime(3) === "running");
      assert(element.stateAtTime(4) === "ended");
      assert(element.stateAtTime(5) === "ended");
    });
  });
  describe("#init(startTime: number): void", () => {
    it("works", () => {
      let element = new FrameElement();

      assert.doesNotThrow(() => {
        element.init(0);
      });
    });
  });
  describe("#update(t0: number, t1: number): void", () => {
    it("works", () => {
      let element = new FrameElement();

      assert.doesNotThrow(() => {
        element.update(0, 1);
      });
    });
  });
  describe("#dispose(stopTime: number): void", () => {
    it("works", () => {
      let element = new FrameElement();

      assert.doesNotThrow(() => {
        element.dispose(1);
      });
    });
  });
});
