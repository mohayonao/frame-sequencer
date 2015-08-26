import assert from "power-assert";
import index from "../src";
import FrameElement from "../src/FrameElement";
import FrameSequencer from "../src/FrameSequencer";

describe("index", () => {
  it("exports", () => {
    assert(index.FrameElement === FrameElement);
    assert(index.FrameSequencer === FrameSequencer);
  });
});
